package com.monumental.services;

import com.monumental.controllers.helpers.CreateUserRequest;
import com.monumental.exceptions.InvalidEmailOrPasswordException;
import com.monumental.models.Role;
import com.monumental.models.User;
import com.monumental.models.VerificationToken;
import com.monumental.repositories.UserRepository;
import com.monumental.repositories.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.MessageSource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

        this.sendVerificationEmail(user, this.generateVerificationToken(user), appUrl, locale);

        return user;
    }

    public VerificationToken generateVerificationToken(User user) {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        this.tokenRepository.save(verificationToken);
        return verificationToken;
    }

    public void sendVerificationEmail(User user, VerificationToken token, String appUrl, Locale locale) {
        String recipientAddress = user.getEmail();
        String subject = "Registration Confirmation";
        String confirmationUrl
                = appUrl + "/signup/confirm?token=" + token.getToken();
        String message = this.messages.getMessage("registration.success", null, locale);

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setFrom("monumentsplusmemorials@gmail.com");
        email.setSubject(subject);
        email.setText(message + "\n\n" + confirmationUrl);
        mailSender.send(email);
    }
}
