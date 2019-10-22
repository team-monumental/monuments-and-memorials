package com.monumental.services;

import com.monumental.models.Monument;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
public class MonumentService extends ModelService<Monument> {

    public MonumentService(SessionFactoryService sessionFactoryService) {
        super(sessionFactoryService);
    }

    /**
     * Uses the FTS function to search for matching Monuments by title
     * TODO: Search other fields besides title
     * @param query The search string
     * @return      Matching Monuments by title
     */
    @SuppressWarnings("unchecked")
    public List<Monument> search(String query) {
        Session session = this.openSession();
        Transaction transaction = null;
        List<Monument> records;

        try {
            transaction = session.beginTransaction();
            // The "fts" function is defined by the FTSFunction and CustomPostgreSQL9Dialect classes
            Query q = session.createQuery(
                    "select m from Monument m where fts(m.title, :query) = true"
            ).setParameter("query", query);
            records = q.list();
            transaction.commit();
            session.close();
        } catch (HibernateException e) {
            if (transaction != null) {
                transaction.rollback();
            }
            session.close();
            throw e;
        }

        return new ArrayList<>(new HashSet<>(records));
    }
}
