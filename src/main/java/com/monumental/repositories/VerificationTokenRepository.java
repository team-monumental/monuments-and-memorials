package com.monumental.repositories;

import com.monumental.models.User;
import com.monumental.models.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Integer> {

    VerificationToken getByToken(String token);

    void deleteAllByUserAndType(User user, VerificationToken.Type type);

}
