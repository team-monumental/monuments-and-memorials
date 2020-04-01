package com.monumental.controllers;

import com.monumental.controllers.helpers.CreateUserRequest;
import com.monumental.controllers.helpers.PasswordResetRequest;
import com.monumental.controllers.responses.UserResponse;
import com.monumental.exceptions.InvalidEmailOrPasswordException;
import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.User;
import com.monumental.models.VerificationToken;
import com.monumental.repositories.UserRepository;
import com.monumental.repositories.VerificationTokenRepository;
import com.monumental.security.Authentication;
import com.monumental.security.Authorization;
import com.monumental.security.Role;
import com.monumental.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import javax.validation.ValidationException;
import java.util.Map;
import java.util.Optional;

@RestController
@Transactional
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
    @Transactional
    public User signup(@RequestBody CreateUserRequest user) throws InvalidEmailOrPasswordException {
        return this.userService.signup(user);
    }

    @GetMapping("/api/session")
    @PreAuthorize(Authentication.isAuthenticated)
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

    @Transactional
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
            throw new ValidationException("Passwords must match.");
        }

        User user = verificationToken.getUser();
        user.setPassword(this.passwordEncoder.encode(resetRequest.getNewPassword()));
        this.userRepository.save(user);
        this.tokenRepository.delete(verificationToken);

        this.userService.sendPasswordResetCompleteEmail(user);

        return Map.of("success", true, "email", user.getEmail());
    }

    @PutMapping("/api/user")
    @PreAuthorize(Authentication.isAuthenticated)
    public Map<String, Boolean> updateUser(@RequestBody User user, HttpServletRequest request, HttpServletResponse response) throws UnauthorizedException, ValidationException {
        User currentUser = this.userService.getCurrentUser();
        Optional<User> option = this.userRepository.findById(user.getId());
        if (option.isEmpty()) throw new ResourceNotFoundException("The requested User does not exist");
        User existingUser = option.get();
        boolean selfUpdate = user.getId().equals(currentUser.getId());
        if (!selfUpdate && !currentUser.getRole().equals(Role.ADMIN)) {
            throw new UnauthorizedException("You do not have permission to update that user.");
        }

        boolean needsConfirmation = false;
        if (!user.getEmail().equals(existingUser.getEmail())) {
            existingUser.setIsEmailVerified(false);
            this.userService.sendEmailChangeVerificationEmail(
                user,
                this.userService.generateVerificationToken(user, VerificationToken.Type.EMAIL)
            );
            needsConfirmation = true;
            if (selfUpdate) {
                this.userService.invalidateSession(request, response);
            }
        }

        existingUser.setEmail(user.getEmail());
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setRole(user.getRole());

        this.userRepository.save(existingUser);

        if (selfUpdate) this.userService.updateSessionUser(existingUser);

        return Map.of("success", true, "needsConfirmation", needsConfirmation);
    }

    @PostMapping("/api/user/change-email/confirm")
    public Map<String, Boolean> confirmChangeEmail(@RequestParam String token) throws ResourceNotFoundException {
        this.userService.verifyToken(token);
        return Map.of("success", true);
    }

    /**
     * Get a User record. This is NOT the same as getting the logged in user. For that,
     * @see UserController#getSession()
     * @param id - The id of the User to get
     * @return - The matching User
     * @throws ResourceNotFoundException - When there is no User with a matching id
     */
    @GetMapping("/api/user/{id}")
    @PreAuthorize(Authorization.isAdmin)
    public UserResponse getUser(@PathVariable("id") Integer id) throws ResourceNotFoundException {
        return new UserResponse(this.userService.getUser(id));
    }
}
