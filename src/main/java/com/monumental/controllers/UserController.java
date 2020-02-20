package com.monumental.controllers;

import com.monumental.controllers.helpers.CreateUserRequest;
import com.monumental.exceptions.InvalidEmailOrPasswordException;
import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.User;
import com.monumental.models.VerificationToken;
import com.monumental.repositories.UserRepository;
import com.monumental.repositories.VerificationTokenRepository;
import com.monumental.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import java.util.List;
import java.util.Map;

@RestController
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    VerificationTokenRepository tokenRepository;

    // This is an environment variable that should be set to the public domain name of the server
    // By default this uses the localhost setup, on the VM it should be set to the actual public server domain name
    // For localhost, it uses the react dev server url. If you are not using the react dev server you must override
    // this value to be http://localhost:8080
    @Value("${PUBLIC_URL:http://localhost:3000}")
    private String publicUrl;

    @PostMapping("/api/signup")
    public User signup(@RequestBody CreateUserRequest user, WebRequest request) throws InvalidEmailOrPasswordException {
        return this.userService.signup(user, publicUrl, request.getLocale());
    }

    @GetMapping("/api/session")
    @PreAuthorize("isAuthenticated()")
    public User getSession() throws UnauthorizedException {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof UserDetails)) {
            throw new UnauthorizedException();
        }
        return this.userRepository.getByEmail(((UserDetails) principal).getUsername());
    }

    @PostMapping("/api/signup/confirm")
    public Map<String, Boolean> confirmSignup(@RequestParam String token) throws ResourceNotFoundException {
        VerificationToken verificationToken = this.tokenRepository.getByToken(token);

        if (verificationToken == null) {
            throw new ResourceNotFoundException("Invalid verification token.");
        }

        User user = verificationToken.getUser();
        user.setIsEmailVerified(true);
        this.userRepository.save(user);
        this.tokenRepository.delete(verificationToken);

        return Map.of("success", true);
    }

    @PostMapping("/api/signup/confirm/resend")
    public Map<String, Boolean> resendConfirmation(@RequestBody User user, WebRequest request) {
        List<VerificationToken> tokens = this.tokenRepository.findAllByUser(user);
        if (tokens != null && tokens.size() > 0) {
            this.tokenRepository.deleteAll(tokens);
        }
        User connectedUser = this.userRepository.getOne(user.getId());
        this.userService.sendVerificationEmail(
            connectedUser,
            this.userService.generateVerificationToken(connectedUser),
            this.publicUrl,
            request.getLocale()
        );
        return Map.of("success", true);
    }
}
