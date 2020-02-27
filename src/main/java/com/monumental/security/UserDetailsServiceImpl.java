package com.monumental.security;

import com.monumental.models.User;
import com.monumental.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = repository.getByEmail(username);

        if (user == null) throw new UsernameNotFoundException("Invalid email or password.");

        return new UserAwareUserDetails(user, AuthorityUtils.createAuthorityList(user.getRole().toString()));
    }

}
