package com.monumental.security;

import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.User;
import com.monumental.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * This class is responsible for retrieving the User record that will be set on createdBy and lastModifiedBy in Models
 */
@Component
public class JpaAuditConfiguration implements AuditorAware<User> {

    @Autowired
    private UserService userService;

    @Override
    public Optional<User> getCurrentAuditor() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) return Optional.empty();
        try {
            return Optional.of(this.userService.getCurrentUser());
        } catch (UnauthorizedException e) {
            return Optional.empty();
        }
    }
}
