package com.monumental.services;

import com.monumental.models.Contribution;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContributionService extends ModelService<Contribution> {

    @SuppressWarnings("unchecked")
    public List<Contribution> getByMonumentId(Integer monumentId) {

        Session session = this.sessionFactoryService.getFactory().openSession();
        Transaction transaction = null;
        List<Contribution> contributions;

        try {
            transaction = session.beginTransaction();
            contributions = session.createQuery("FROM Contribution where monument_id = :monumentId")
                    .setParameter("monumentId", monumentId)
                    .list();
            transaction.commit();
            session.close();
        } catch (HibernateException e) {
            if (transaction != null) {
                transaction.rollback();
            }
            session.close();
            System.err.println("Error attempting to get all Contributions for Monument: " + monumentId);
            System.err.println(e.getMessage());
            throw e;
        }

        return contributions;
    }
}
