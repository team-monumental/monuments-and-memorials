package com.monumental.controllers;

import com.monumental.controllers.helpers.CreateUserRequest;
import com.monumental.controllers.helpers.LoginUserRequest;
import com.monumental.exceptions.InvalidEmailOrPasswordException;
import com.monumental.models.User;
import com.monumental.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("/api/user/signup")
    public User signup(@RequestBody CreateUserRequest user) throws InvalidEmailOrPasswordException {
        return this.userService.signup(user);
    }

    @PostMapping("/api/user/login")
    public User login(@RequestBody LoginUserRequest user) throws InvalidEmailOrPasswordException {
        return this.userService.login(user);
    }
}
