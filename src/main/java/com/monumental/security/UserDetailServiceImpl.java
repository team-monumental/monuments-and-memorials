package com.monumental.security;

import com.monumental.exceptions.InvalidEmailOrPasswordException;
import com.monumental.models.User;
import com.monumental.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class UserDetailServiceImpl implements UserDetailsService {
    private final UserRepository repository;

    @Autowired
    public UserDetailServiceImpl(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws InvalidEmailOrPasswordException {
        User user = repository.getByEmail(username);

        if (user == null) throw new InvalidEmailOrPasswordException();

        return new org.springframework.security.core.userdetails.User(
            username, user.getPassword(), user.getIsEnabled(),
            true, true, true,
            AuthorityUtils.createAuthorityList(user.getRole().toString())
        );
    }

}
