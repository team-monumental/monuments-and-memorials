package com.monumental.services;

import com.monumental.models.Image;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageService extends ModelService<Image> {

    @SuppressWarnings("unchecked")
    public List<Image> getByMonumentId(Integer monumentId) {

        Session session = this.sessionFactoryService.getFactory().openSession();
        Transaction transaction = null;
        List<Image> images;

        try {
            transaction = session.beginTransaction();
            images = session.createQuery("FROM Image where monument_id = :monumentId")
                    .setParameter("monumentId", monumentId)
                    .list();
            transaction.commit();
            session.close();
        } catch (HibernateException e) {
            if (transaction != null) {
                transaction.rollback();
            }
            session.close();
            System.err.println("Error attempting to get all Images for Monument: " + monumentId);
            System.err.println(e.getMessage());
            throw e;
        }

        return images;
    }
}
