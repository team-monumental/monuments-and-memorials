package com.monumental.listeners;

import com.monumental.models.Model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.persistence.EntityManager;

public abstract class ModelListener<M extends Model> {

    abstract JpaRepository<M, Integer> getRepository();

    static EntityManager entityManager;

    @Autowired
    public void init(EntityManager injectedEntityManager) {
        entityManager = injectedEntityManager;
    }

    @SuppressWarnings("unchecked")
    M getOriginal(M updated) {
        EntityManager cleanEM = entityManager.getEntityManagerFactory().createEntityManager();
        return (M) cleanEM.find(updated.getClass(), updated.getId());
    }

}
