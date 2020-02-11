package com.monumental.repositories;

import com.monumental.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

    User getByEmail(String email);
}
