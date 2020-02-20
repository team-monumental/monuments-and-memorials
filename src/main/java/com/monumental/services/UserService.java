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
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
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

    public User signup(CreateUserRequest userRequest, String appUrl, Locale locale) throws InvalidEmailOrPasswordException {
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

        this.sendSignupVerificationEmail(user, this.generateVerificationToken(user, VerificationToken.Type.EMAIL), appUrl, locale);

        return user;
    }

    public void resetPassword(String email, String appUrl, Locale locale) {
        User user = this.userRepository.getByEmail(email);
        // Note: This is a security feature. We don't want the password reset form to tell everyone what email addresses are registered
        if (user == null) {
            return;
        }
        this.sendPasswordResetEmail(user, this.generateVerificationToken(user, VerificationToken.Type.PASSWORD_RESET), appUrl, locale);
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

    public void deleteAllVerificationTokensOfTypeForUser(User user, VerificationToken.Type type) {
        List<VerificationToken> tokens = this.tokenRepository.findAllByUserAndType(user, type);
        if (tokens != null && tokens.size() > 0) {
            this.tokenRepository.deleteAll(tokens);
        }
    }

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

    public void verifyToken(String token) throws ResourceNotFoundException{
        VerificationToken verificationToken = this.tokenRepository.getByToken(token);

        if (verificationToken == null) {
            throw new ResourceNotFoundException("Invalid verification token.");
        }

        User user = verificationToken.getUser();
        user.setIsEmailVerified(true);
        this.userRepository.save(user);
        this.tokenRepository.delete(verificationToken);
    }

    public void sendEmailChangeVerificationEmail(User user, VerificationToken token, String appUrl, Locale locale) {
        String recipientAddress = user.getEmail();
        String subject = "Verify your Monuments and Memorials email address";
        String confirmationUrl
                = appUrl + "/account/update/confirm?token=" + token.getToken();
        String message = this.messages.getMessage("email-change.begin", null, locale);

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setFrom(outboundEmailAddress);
        email.setSubject(subject);
        email.setText(message + "\n\n" + confirmationUrl);
        mailSender.send(email);
    }

    public void sendEmailChangeConfirmationEmail(User user, VerificationToken token, String appUrl, Locale locale) {
        String recipientAddress = user.getEmail();
        String subject = "Your Monuments and Memorials email address has been changed";
        String message = this.messages.getMessage("email-change.begin", null, locale);

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setFrom(outboundEmailAddress);
        email.setSubject(subject);
        email.setText(message);
        mailSender.send(email);
    }

    public void sendSignupVerificationEmail(User user, VerificationToken token, String appUrl, Locale locale) {
        String recipientAddress = user.getEmail();
        String subject = "Finish creating your Monuments and Memorials account";
        String confirmationUrl
                = appUrl + "/signup/confirm?token=" + token.getToken();
        String message = this.messages.getMessage("registration.success", null, locale);

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setFrom(outboundEmailAddress);
        email.setSubject(subject);
        email.setText(message + "\n\n" + confirmationUrl);
        mailSender.send(email);
    }

    public void sendPasswordResetEmail(User user, VerificationToken token, String appUrl, Locale locale) {
        String recipientAddress = user.getEmail();
        String subject = "Reset your Monuments and Memorials password";
        String confirmationUrl
                = appUrl + "/password-reset/confirm?token=" + token.getToken();
        String message = this.messages.getMessage("password-reset.begin", null, locale);

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setFrom(outboundEmailAddress);
        email.setSubject(subject);
        email.setText(message + "\n\n" + confirmationUrl);
        mailSender.send(email);
    }

    public void sendPasswordResetCompleteEmail(User user, String appUrl, Locale locale) {
        String recipientAddress = user.getEmail();
        String subject = "Your Monuments and Memorials password has been reset";
        String message = this.messages.getMessage("password-reset.success", null, locale);

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setFrom(outboundEmailAddress);
        email.setSubject(subject);
        email.setText(message);
        mailSender.send(email);
    }
}
