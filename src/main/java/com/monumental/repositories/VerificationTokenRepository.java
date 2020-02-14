package com.monumental.repositories;

import com.monumental.models.User;
import com.monumental.models.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Integer> {

    VerificationToken getByToken(String token);

    List<VerificationToken> findAllByUser(User user);

}
