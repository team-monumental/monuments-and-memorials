package com.monumental.repositories;

import com.monumental.models.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {

    List<Favorite> getAllByUserId(Integer id);

    Favorite getByUserIdAndMonumentId(Integer userId, Integer monumentId);
}
