package com.monumental.services;

import com.monumental.controllers.helpers.CreateUserRequest;
import com.monumental.exceptions.InvalidEmailOrPasswordException;
import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.User;
import com.monumental.models.VerificationToken;
import com.monumental.repositories.UserRepository;
import com.monumental.repositories.VerificationTokenRepository;
import com.monumental.security.Role;
import com.monumental.security.UserAwareUserDetails;
import com.monumental.util.search.SearchHelper;
import com.rollbar.notifier.Rollbar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.persistence.criteria.*;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import javax.validation.ValidationException;
import java.util.*;

import static com.monumental.util.string.StringHelper.isNullOrEmpty;

@Service
@Transactional
public class UserService extends ModelService<User> {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private Rollbar rollbar;

    /**
     * Gets our custom Spring Security session object (UserAwareUserDetails) which includes our User.
     * @return UserAwareUserDetails - Custom Spring Security session object
     * @throws UnauthorizedException - If the current user is not logged in
     */
    public UserAwareUserDetails getSession() throws UnauthorizedException {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof UserAwareUserDetails)) {
            throw new UnauthorizedException();
        }
        return (UserAwareUserDetails) principal;
    }

    /**
     * Gets our User object for the currently logged in user
     * @return User - The logged in User
     * @throws UnauthorizedException - If the current user is not logged in
     */
    public User getCurrentUser() throws UnauthorizedException {
        User user = this.getSession().getUser();
        if (user == null) throw new UnauthorizedException();
        return user;
    }

    /**
     * Force the session to use an updated version of the user record
     * @param user - The updated user record
     * @throws UnauthorizedException - If the current user is not logged in
     */
    public void updateSessionUser(User user) throws UnauthorizedException {
        this.getSession().setUser(user);
    }

    /**
     * Begins the signup process by creating the User with the submitted information. The User will receive
     * an email with a verification link so that we know the user owns the provided email address,
     * @param userRequest - The form data from the user including name, email, and password
     * @return User - The created User object
     * @throws InvalidEmailOrPasswordException - If the email address is already in use
     * @throws ValidationException - If the supplied password and matchingPassword do not match
     */
    @Transactional
    public User signup(CreateUserRequest userRequest) throws InvalidEmailOrPasswordException, ValidationException {
        if (this.userRepository.getByEmail(userRequest.getEmail()) != null) {
            throw new InvalidEmailOrPasswordException("Email address already in use.");
        }
        if (!userRequest.getPassword().equals(userRequest.getMatchingPassword())) {
            throw new ValidationException("Passwords must match.");
        }
        User user = new User();
        user.setEmail(userRequest.getEmail());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setRole(Role.COLLABORATOR);
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setIsEnabled(true);
        user.setIsEmailVerified(false);
        this.userRepository.save(user);

        this.emailService.sendSignupVerificationEmail(user, this.generateVerificationToken(user, VerificationToken.Type.EMAIL));

        rollbar.info("New user signed up!");

        return user;
    }

    /**
     * Begins the password reset process by sending a verification link to the user. Even if their email address is
     * already verified, we want to make sure that they still own the email address and their account is not compromised.
     * If the email address does not match any user, NO indication is given as this would expose which email addresses
     * are registered to the site.
     * @param email - The email address to verify
     */
    @Transactional
    public void resetPassword(String email) {
        try {
            User user = this.userRepository.getByEmail(email);
            // Note: This is a security feature. We don't want the password reset form to tell everyone what email addresses are registered
            if (user == null) {
                return;
            }
            VerificationToken token = this.generateVerificationToken(user, VerificationToken.Type.PASSWORD_RESET);
            this.emailService.sendPasswordResetEmail(user, token);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * This is an alternative to the Spring Security logout endpoint which will invalidate the user session by clearing
     * the JSESSIONID cookie. This is used specifically when the user's username is changed, as the Spring Security
     * session does not handle this well at all, and using the logout endpoint would redirect react to the homepage
     * which isn't desirable. Instead, this endpoint is used to silently log the user out.
     * @param request - The HTTP Request object, used to get the existing session cookie
     * @param response - The HTTP Response object, used to set the expired session cookie
     */
    public void invalidateSession(HttpServletRequest request, HttpServletResponse response) {
        request.getSession().invalidate();
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            if (!cookie.getName().equals("JSESSIONID")) continue;
            cookie.setMaxAge(0);
            response.addCookie(cookie);
        }
    }

    /**
     * Generates a verification token of the specified type for the user, usually used to verify an email address
     * Any tokens of the same type for that user are deleted upon creation of a new one, so be sure to use types
     * that do not intersect with other flows as they could invalidate each other if they share the same type.
     *
     * NOTE that this methods must be called from transactional controller methods, as it calls the tokenRepository
     *
     * @param user - The user that the verification token is intended for
     * @param type - The type of token to create, and delete existing versions of
     * @return - The generated verification token
     */
    @Transactional
    public VerificationToken generateVerificationToken(User user, VerificationToken.Type type) {
        this.tokenRepository.deleteAllByUserAndType(user, type);
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setType(type);
        this.tokenRepository.save(verificationToken);
        return verificationToken;
    }

    /**
     * Verify that a token string matches a valid VerificationToken object in the database.
     * This confirms that the user specifying the token string received it through whatever means it was given to them,
     * normally email, therefore verifying that they do own the email address.
     *
     * Once the token is verified it is immediately deleted from the database so that it cannot be used again.
     *
     * @param token - The VerificationToken token string
     * @return - The matching VerificationToken, if it was a match
     * @throws ResourceNotFoundException - If there was no matching VerificationToken. Note that this often simply means
     *                                     that a newer token has been generated in the mean time, causing this one to be
     *                                     deleted from the database.
     */
    public VerificationToken verifyToken(String token) throws ResourceNotFoundException{
        VerificationToken verificationToken = this.tokenRepository.getByToken(token);

        if (verificationToken == null) {
            throw new ResourceNotFoundException("Invalid verification token.");
        }

        User user = verificationToken.getUser();
        user.setIsEmailVerified(true);
        this.userRepository.save(user);
        this.tokenRepository.delete(verificationToken);
        return verificationToken;
    }

    /**
     * Require that the current user has a specific Role, otherwise throw AccessDeniedException
     * @param role - The Role to check for
     * @throws AccessDeniedException - If the running User does not have the specified Role
     * @throws UnauthorizedException - If there is no User in the session, i.e. logged out
     */
    public void requireUserIsInRole(Role role) throws AccessDeniedException, UnauthorizedException {
        if (!this.getCurrentUserRoles().contains(role)) {
            throw new AccessDeniedException("Access is denied");
        }
    }

    /**
     * Require that the current user have one of the desired Roles, otherwise throw AccessDeniedException
     * @param desiredRoles - The Roles to check for
     * @throws AccessDeniedException - If the running User has none of the specified Roles
     * @throws UnauthorizedException - If there is no User in the session, i.e. logged out
     */
    public void requireUserIsInRoles(Role[] desiredRoles) throws AccessDeniedException, UnauthorizedException {
        boolean hasRole = false;
        List<Role> userRoles = this.getCurrentUserRoles();
        for (Role role : desiredRoles) {
            if (userRoles.contains(role)) {
                hasRole = true;
                break;
            }
        }
        if (!hasRole) {
            throw new AccessDeniedException("Access is denied");
        }
    }

    /**
     * Throw a ResourceNotFoundException if the specified userId does not match any User, if the userId is not null
     * If the userId is null no exception will be thrown
     * @param userId - The userId to look for
     * @throws ResourceNotFoundException - If there is no matching User
     */
    public void requireUserExistsIfNotNull(Integer userId) throws ResourceNotFoundException {
        if (userId != null) {
            try {
                this.userRepository.getOne(userId);
            } catch (EntityNotFoundException e) {
                throw new ResourceNotFoundException();
            }
        }
    }

    /**
     * Get the Roles for the running User. This should only ever be one currently, but Spring Security
     * allows for multiple Roles per User so we allow for it here
     * @return - The Roles of the running User
     * @throws UnauthorizedException - If there is no running User, i.e. not logged in
     */
    private List<Role> getCurrentUserRoles() throws UnauthorizedException {
        return this.getRolesFromSession(this.getSession());
    }

    /**
     * Get the Roles for the User of a given session.
     * @param session - The session to check against
     * @return - The Roles the User of the session has
     * @throws UnauthorizedException - If the session doesn't have a logged in User
     */
    private List<Role> getRolesFromSession(UserDetails session) throws UnauthorizedException {
        List<Role> roles = new ArrayList<>();
        for (GrantedAuthority authority : session.getAuthorities()) {
            roles.add(Role.valueOf(authority.getAuthority()));
        }
        return roles;
    }

    /**
     * Generates a search for Users based on matching the specified parameters
     * May make use of the pg_trgm similarity function
     * @param name - The string to search names against, using pg_trgm similarity
     * @param email - The string to search email addresses against, using pg_trgm similarity
     * @param role - The role to filter by exactly (can be null if not filtering by role)
     * @param page - The page number of User results to return
     * @param limit - The maximum number of User results to return
     * @return List<User> - List of User results based on the specified search parameters
     */
    public List<User> search(String name, String email, String role, String page, String limit) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<User> query = this.createCriteriaQuery(builder, false);
        Root<User> root = this.createRoot(query);
        query.select(root);

        this.buildSearchQuery(builder, query, root, name, email, role, true);

        return limit != null
            ? page != null
                ? this.getWithCriteriaQuery(query, Integer.parseInt(limit), (Integer.parseInt(page)) - 1)
                : this.getWithCriteriaQuery(query, Integer.parseInt(limit))
            : this.getWithCriteriaQuery(query);
    }

    /**
     * Creates a search query on various fields of the User and adds it to the specified CriteriaQuery
     * @param builder - The CriteriaBuilder to use to help build the CriteriaQuery
     * @param query - The CriteriaQuery to add the searching logic to
     * @param root - The Root to use with the CriteriaQuery
     * @param name - The string to search names against, using pg_trgm similarity
     * @param email - The string to search email addresses against, using pg_trgm similarity
     * @param roleName - The role to filter by exactly (can be null if not filtering by role)
     * @param orderBySimilarity - If true, the results will be ordered by their similarity scores for any similarity
     *                          queries that were used
     */
    private void buildSearchQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, String name, String email,
                                  String roleName, boolean orderBySimilarity) {
        List<Predicate> predicates = new ArrayList<>();
        List<Expression<Number>> expressions = new ArrayList<>();

        if (!isNullOrEmpty(name)) {
            Expression<Number> firstNameExpression = SearchHelper.buildSimilarityExpression(builder, root, name, "firstName");
            Expression<Number> lastNameExpression = SearchHelper.buildSimilarityExpression(builder, root, name, "lastName");
            predicates.add(builder.or(
                    SearchHelper.buildSimilarityPredicate(builder, firstNameExpression, 0.1),
                    SearchHelper.buildSimilarityPredicate(builder, lastNameExpression, 0.1)
            ));
            expressions.add(firstNameExpression);
            expressions.add(lastNameExpression);
        }
        if (!isNullOrEmpty(email)) {
            Expression<Number> emailExpression = SearchHelper.buildSimilarityExpression(builder, root, email, "email");
            predicates.add(SearchHelper.buildSimilarityPredicate(builder, emailExpression, 0.1));
            expressions.add(emailExpression);
        }
        if (orderBySimilarity && expressions.size() > 0) {
            SearchHelper.orderSimilarityResults(builder, query, expressions);
        }
        if (!isNullOrEmpty(roleName)) {
            Role role = Role.valueOf(roleName.toUpperCase());
            predicates.add(builder.equal(builder.literal(role), root.get("role")));
        }

        SearchHelper.executeQueryWithPredicates(builder, query, predicates);
    }

    /**
     * Count the total number of results for a User search
     * @see UserService#search(String, String, String, String, String)
     */
    public Integer countSearchResults(String name, String email, String role) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<User> root = query.from(User.class);
        query.select(builder.countDistinct(root));
        this.buildSearchQuery(builder, query, root, name, email, role, false);

        return this.getEntityManager().createQuery(query).getSingleResult().intValue();
    }

    /**
     * Get a User by id and initialize all of its lazy loaded collections
     * @param id - The id of the User to get
     * @return User - The matching User, if one exists
     * @throws ResourceNotFoundException - If there is no User with that id
     */
    public User getUser(Integer id) throws ResourceNotFoundException {
        Optional<User> optional = this.userRepository.findById(id);
        if (optional.isEmpty()) throw new ResourceNotFoundException("The requested User does not exist");
        User user = optional.get();
        this.initializeAllLazyLoadedCollections(user);
        return user;
    }
}
