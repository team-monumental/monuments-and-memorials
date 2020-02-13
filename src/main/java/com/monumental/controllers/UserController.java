package com.monumental.controllers;

import com.monumental.controllers.helpers.CreateUserRequest;
import com.monumental.exceptions.InvalidEmailOrPasswordException;
import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.User;
import com.monumental.repositories.UserRepository;
import com.monumental.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

import java.util.Locale;

@RestController
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    // This is an environment variable that should be set to the public domain name of the server
    // By default this uses the localhost setup, on the VM it should be set to the actual public server domain name
    @Value("${PUBLIC_URL:http://localhost:8080}")
    private String publicUrl;

    @PostMapping("/api/signup")
    public User signup(@RequestBody CreateUserRequest user, WebRequest request) throws InvalidEmailOrPasswordException {
        Locale locale = request.getLocale();
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
}
