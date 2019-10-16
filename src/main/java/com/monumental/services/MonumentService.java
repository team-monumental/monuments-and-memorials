package com.monumental.services;

import com.monumental.models.Contribution;
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

    /**
     * Public constructor for MonumentService
     * Use when NOT injecting SessionFactoryService via Spring
     * @param sessionFactoryService - instance of SessionFactoryService to use for initialization
     */
    public MonumentService(SessionFactoryService sessionFactoryService) {
        this.sessionFactoryService = sessionFactoryService;
    }

    /**
     * Public default constructor for MonumentService
     */
    public MonumentService() {

    }

    /**
     * Uses the FTS function to search for matching Monuments by title
     * TODO: Search other fields besides title
     * @param query The search string
     * @return      Matching Monuments by title
     */
    @SuppressWarnings("unchecked")
    public List<Monument> search(String query) {
        Session session = this.sessionFactoryService.getFactory().openSession();
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
