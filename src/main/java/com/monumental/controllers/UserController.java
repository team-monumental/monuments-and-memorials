package com.monumental.controllers;

import com.monumental.controllers.helpers.CreateUserRequest;
import com.monumental.controllers.helpers.PasswordResetRequest;
import com.monumental.exceptions.InvalidEmailOrPasswordException;
import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.Role;
import com.monumental.models.User;
import com.monumental.models.VerificationToken;
import com.monumental.repositories.UserRepository;
import com.monumental.repositories.VerificationTokenRepository;
import com.monumental.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.ValidationException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@RestController
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    VerificationTokenRepository tokenRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @PostMapping("/api/signup")
    public User signup(@RequestBody CreateUserRequest user) throws InvalidEmailOrPasswordException {
        return this.userService.signup(user);
    }

    @GetMapping("/api/session")
    @PreAuthorize("isAuthenticated()")
    public User getSession() throws UnauthorizedException {
        return this.userService.getCurrentUser();
    }

    @PostMapping("/api/signup/confirm")
    public Map<String, Boolean> confirmSignup(@RequestParam String token) throws ResourceNotFoundException {
        this.userService.verifyToken(token);
        return Map.of("success", true);
    }

    @PostMapping("/api/signup/confirm/resend")
    public Map<String, Boolean> resendConfirmation(@RequestBody User user, @RequestParam boolean signup) {
        User connectedUser = this.userRepository.getOne(user.getId());
        VerificationToken token = this.userService.generateVerificationToken(connectedUser, VerificationToken.Type.EMAIL);
        if (signup) {
            this.userService.sendSignupVerificationEmail(connectedUser, token);
        } else {
            this.userService.sendEmailChangeVerificationEmail(connectedUser, token);
        }
        return Map.of("success", true);
    }

    @PostMapping("/api/reset-password")
    public Map<String, Boolean> resetPassword(@RequestParam String email) {
        this.userService.resetPassword(email);
        return Map.of("success", true);
    }

    @PostMapping("/api/reset-password/confirm")
    public Map<String, Object> confirmPasswordReset(@RequestBody PasswordResetRequest resetRequest) throws ResourceNotFoundException, ValidationException {
        VerificationToken verificationToken = this.tokenRepository.getByToken(resetRequest.getToken());

        if (verificationToken == null) {
            throw new ResourceNotFoundException("Invalid verification token.");
        }

        if (!resetRequest.getNewPassword().equals(resetRequest.getMatchingNewPassword())) {
            throw new InvalidEmailOrPasswordException("Passwords must match.");
        }

        User user = verificationToken.getUser();
        user.setPassword(this.passwordEncoder.encode(resetRequest.getNewPassword()));
        this.userRepository.save(user);
        this.tokenRepository.delete(verificationToken);

        this.userService.sendPasswordResetCompleteEmail(user);

        return Map.of("success", true, "email", user.getEmail());
    }

    @PutMapping("/api/user")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Boolean> updateUser(@RequestBody User user, HttpServletRequest request, HttpServletResponse response) throws UnauthorizedException, ValidationException {
        User currentUser = this.userService.getCurrentUser();
        if (!user.getId().equals(currentUser.getId()) && !currentUser.getRole().equals(Role.RESEARCHER)) {
            throw new UnauthorizedException("You do not have permission to update that user.");
        }

        boolean needsConfirmation = false;
        if (!user.getEmail().equals(currentUser.getEmail())) {
            currentUser.setIsEmailVerified(false);
            this.userService.sendEmailChangeVerificationEmail(
                user,
                this.userService.generateVerificationToken(user, VerificationToken.Type.EMAIL)
            );
            needsConfirmation = true;
            this.userService.invalidateSession(request, response);
        }

        currentUser.setEmail(user.getEmail());
        currentUser.setFirstName(user.getFirstName());
        currentUser.setLastName(user.getLastName());

        this.userRepository.save(currentUser);

        return Map.of("success", true, "needsConfirmation", needsConfirmation);
    }

    @PostMapping("/api/user/change-email/confirm")
    public Map<String, Boolean> confirmChangeEmail(@RequestParam String token) throws ResourceNotFoundException {
        this.userService.verifyToken(token);
        return Map.of("success", true);
    }
}
