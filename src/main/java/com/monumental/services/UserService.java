package com.monumental.services;

import com.monumental.controllers.helpers.CreateUserRequest;
import com.monumental.controllers.helpers.LoginUserRequest;
import com.monumental.exceptions.InvalidEmailOrPasswordException;
import com.monumental.models.User;
import com.monumental.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService extends ModelService<User> {

    @Autowired
    UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User signup(CreateUserRequest userRequest) throws InvalidEmailOrPasswordException {
        if (this.userRepository.getByEmail(userRequest.getEmail()) != null) {
            throw new InvalidEmailOrPasswordException("Email address already in use.");
        }
        System.out.println("comparing " + userRequest.getPassword() + " " + userRequest.getMatchingPassword());
        if (!userRequest.getPassword().equals(userRequest.getMatchingPassword())) {
            throw new InvalidEmailOrPasswordException("Passwords must match.");
        }
        User user = new User();
        user.setEmail(userRequest.getEmail());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        this.userRepository.save(user);
        return user;
    }

    public User login(LoginUserRequest userRequest) throws InvalidEmailOrPasswordException {
        User user = this.userRepository.getByEmail(userRequest.getEmail());
        if (user == null || !this.passwordEncoder.matches(userRequest.getPassword(), user.getPassword())) {
            throw new InvalidEmailOrPasswordException("Invalid email or password");
        }
        return user;
    }
}
