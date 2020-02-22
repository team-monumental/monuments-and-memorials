package com.monumental.services;

import com.monumental.controllers.helpers.CreateUserRequest;
import com.monumental.exceptions.InvalidEmailOrPasswordException;
import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.Role;
import com.monumental.models.User;
import com.monumental.models.VerificationToken;
import com.monumental.repositories.UserRepository;
import com.monumental.repositories.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import javax.validation.ValidationException;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@Transactional
public class UserService extends ModelService<User> {

    @Autowired
    UserRepository userRepository;

    @Autowired
    VerificationTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    @Qualifier("resourceBundleMessageSource")
    private MessageSource messages;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Value("${OUTBOUND_EMAIL_ADDRESS:noreply@monuments.us.org}")
    private String outboundEmailAddress;

    @Value("${spring.mail.username:#{null}}")
    private String springMailUsername;

    // This is an environment variable that should be set to the public domain name of the server
    // By default this uses the localhost setup, on the VM it should be set to the actual public server domain name
    // For localhost, it uses the react dev server url. If you are not using the react dev server you must override
    // this value to be http://localhost:8080
    @Value("${PUBLIC_URL:http://localhost:3000}")
    private String publicUrl;

    /**
     * Gets the Spring Security session object (UserDetails) which includes username (email),
     * password (hashed), and authorities (roles). This is really only useful if you don't want to involve
     * JPA/hibernate for some reason, such as not having a transaction. Otherwise just use getCurrentUser.
     * @return UserDetails - Spring Security session object
     * @throws UnauthorizedException - If the current user is not logged in
     */
    public UserDetails getSession() throws UnauthorizedException {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof UserDetails)) {
            throw new UnauthorizedException();
        }
        return (UserDetails) principal;
    }

    /**
     * Gets our User object for the currently logged in user
     * @return User - The logged in User
     * @throws UnauthorizedException - If the current user is not logged in
     */
    public User getCurrentUser() throws UnauthorizedException {
        return this.userRepository.getByEmail(this.getSession().getUsername());
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

        this.sendSignupVerificationEmail(user, this.generateVerificationToken(user, VerificationToken.Type.EMAIL));

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
        User user = this.userRepository.getByEmail(email);
        // Note: This is a security feature. We don't want the password reset form to tell everyone what email addresses are registered
        if (user == null) {
            return;
        }
        this.sendPasswordResetEmail(user, this.generateVerificationToken(user, VerificationToken.Type.PASSWORD_RESET));
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
     * Sends an email to the specified address using the stored email template name
     * TODO: Replace with HTML email templates with proper templating where user data can be filled in automatically
     * @param recipientAddress - The email address to send to
     * @param name - The email template name
     */
    private void sendEmail(String recipientAddress, String name) {
        this.sendEmail(recipientAddress, name, "");
    }

    /**
     * Sends an email to the specified address using the stored email template name, adding the extraMessage onto the
     * end of the email template
     * TODO: This is a lazy way of not having to write email templating yet. Replace this with true templating
     * @param recipientAddress - The email address to send to
     * @param templateName - The email template name
     * @param extraMessage - The extra content to add to the end of the template
     */
    private void sendEmail(String recipientAddress, String templateName, String extraMessage) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setFrom(outboundEmailAddress);
        email.setSubject(this.messages.getMessage(templateName + ".subject", null, Locale.getDefault()));
        email.setText(this.messages.getMessage(templateName + ".body", null, Locale.getDefault()) + extraMessage);

        if (this.springMailUsername == null || this.springMailUsername.equals("")) {
            System.out.println("WARNING: You have not provided mail credentials, so the following email will NOT be sent: " + email);
        } else {
            System.out.println("Sent email " + templateName + " to " + outboundEmailAddress);
            mailSender.send(email);
        }
    }

    /**
     * Sent when a user requests to change their email address, and includes a link with a verification token
     * to verify that they own the new email address
     */
    public void sendEmailChangeVerificationEmail(User user, VerificationToken token) {
        this.sendEmail(
            user.getEmail(),
            "email-change.begin",
            "\n\n" + this.publicUrl + "/account/update/confirm?token=" + token.getToken()
        );
    }

    /**
     * Sent upon signup and includes a link with a verification token to verify that the user owns the specified
     * email address
     */
    public void sendSignupVerificationEmail(User user, VerificationToken token) {
        this.sendEmail(
            user.getEmail(),
            "registration.success",
            "\n\n" + this.publicUrl + "/signup/confirm?token=" + token.getToken()
        );
    }

    /**
     * Sent when a user requests to change their password, and includes a link with a verification token
     * to verify that they own their email address still
     */
    public void sendPasswordResetEmail(User user, VerificationToken token) {
        this.sendEmail(
            user.getEmail(),
            "password-reset.begin",
            "\n\n" +     this.publicUrl + "/password-reset/confirm?token=" + token.getToken()
        );
    }

    /**
     * Sent when a user successfully changes their password
     */
    public void sendPasswordResetCompleteEmail(User user) {
        this.sendEmail(user.getEmail(), "password-reset.success");
    }
}
