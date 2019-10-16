package com.monumental.services;

import com.monumental.models.Tag;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService extends ModelService<Tag> {

    @SuppressWarnings("unchecked")
    public List<Tag> getByMonumentId(Integer monumentId) {

        Session session = this.sessionFactoryService.getFactory().openSession();
        Transaction transaction = null;
        List<Tag> tags;

        try {
            transaction = session.beginTransaction();
            tags = session.createQuery("FROM Tag where monument_id = :monumentId")
                    .setParameter("monumentId", monumentId)
                    .list();
            transaction.commit();
            session.close();
        } catch (HibernateException e) {
            if (transaction != null) {
                transaction.rollback();
            }
            session.close();
            System.err.println("Error attempting to get all Tags for Monument: " + monumentId);
            System.err.println(e.getMessage());
            throw e;
        }

        return tags;
    }
}
