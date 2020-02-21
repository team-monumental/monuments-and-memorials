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

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
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

    // This is an environment variable that should be set to the public domain name of the server
    // By default this uses the localhost setup, on the VM it should be set to the actual public server domain name
    // For localhost, it uses the react dev server url. If you are not using the react dev server you must override
    // this value to be http://localhost:8080
    @Value("${PUBLIC_URL:http://localhost:3000}")
    private String publicUrl;

    public UserDetails getSession() throws UnauthorizedException {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof UserDetails)) {
            throw new UnauthorizedException();
        }
        return (UserDetails) principal;
    }

    public User getCurrentUser() throws UnauthorizedException {
        return this.getCurrentUser(this.getSession());
    }

    public User getCurrentUser(UserDetails session) throws UnauthorizedException {
        return this.userRepository.getByEmail(session.getUsername());
    }

    public User signup(CreateUserRequest userRequest) throws InvalidEmailOrPasswordException {
        if (this.userRepository.getByEmail(userRequest.getEmail()) != null) {
            throw new InvalidEmailOrPasswordException("Email address already in use.");
        }
        if (!userRequest.getPassword().equals(userRequest.getMatchingPassword())) {
            throw new InvalidEmailOrPasswordException("Passwords must match.");
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

    @Transactional
    public void resetPassword(String email) {
        User user = this.userRepository.getByEmail(email);
        // Note: This is a security feature. We don't want the password reset form to tell everyone what email addresses are registered
        if (user == null) {
            return;
        }
        this.sendPasswordResetEmail(user, this.generateVerificationToken(user, VerificationToken.Type.PASSWORD_RESET));
    }

    public void invalidateSession(HttpServletRequest request, HttpServletResponse response) {
        request.getSession().invalidate();
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            if (!cookie.getName().equals("JSESSIONID")) continue;
            cookie.setMaxAge(0);
            response.addCookie(cookie);
        }
    }

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

    private void sendEmail(String recipientAddress, String name) {
        this.sendEmail(recipientAddress, name, "");
    }
    
    private void sendEmail(String recipientAddress, String name, String extraMessage) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setFrom(outboundEmailAddress);
        email.setSubject(this.messages.getMessage(name + ".subject", null, Locale.getDefault()));
        email.setText(this.messages.getMessage(name + ".body", null, Locale.getDefault()) + extraMessage);
        mailSender.send(email);
    }

    public void sendEmailChangeVerificationEmail(User user, VerificationToken token) {
        this.sendEmail(
            user.getEmail(),
            "email-change.begin",
            "\n\n" + this.publicUrl + "/account/update/confirm?token=" + token.getToken()
        );
    }

    public void sendSignupVerificationEmail(User user, VerificationToken token) {
        this.sendEmail(
            user.getEmail(),
            "registration.success",
            "\n\n" + this.publicUrl + "/signup/confirm?token=" + token.getToken()
        );
    }

    public void sendPasswordResetEmail(User user, VerificationToken token) {
        this.sendEmail(
            user.getEmail(),
            "password-reset.begin",
            "\n\n" +     this.publicUrl + "/password-reset/confirm?token=" + token.getToken()
        );
    }

    public void sendPasswordResetCompleteEmail(User user) {
        this.sendEmail(user.getEmail(), "password-reset.success");
    }
}
