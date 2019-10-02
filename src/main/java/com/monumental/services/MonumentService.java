package com.monumental.services;

import com.github.slugify.Slugify;
import com.monumental.models.Monument;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class MonumentService extends ModelService<Monument> {

    static Slugify slugify = new Slugify();

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
     * Generate a unique slug for the given monument
     * @param monument  Monument to generate a slug for
     */
    public void generateSlug(Monument monument) {

        List<Monument> duplicates;
        try {
            System.out.println("getting duplicates");
            duplicates = getPossibleSlugDuplicates(monument);
        } catch (HibernateException e) {
            System.err.println("Hibernate Exception occurred while finding duplicate slugs");
            throw e;
        }

        System.out.println("got duplicates");

        // Generate the slug from the Monument's title, city, and state
        List<String> slugParts = Arrays.asList(monument.getTitle(), monument.getCity(), monument.getState());
        // If these fields do not create a unique key, add on an additional identifier to make it unique
        if (duplicates.size() > 0) slugParts.add(String.valueOf(duplicates.size()));

        // Use the Slugify package to create a nice, readable slug from these fields
        monument.setSlug(slugify.slugify(String.join(" ", slugParts)));
    }

    /**
     * Queries for Monuments with matching title, city, and state, since these conditions could lead to duplicate slugs
     * The query excludes the Id of the reference monument so that only other Monuments are returned
     * @param monument  The reference Monument to check for possible slug duplicates of
     * @return          Matching monuments that were found which would lead to duplicate slugs
     * @throws HibernateException   Thrown upon query exception
     */
    @SuppressWarnings("unchecked")
    public List<Monument> getPossibleSlugDuplicates(Monument monument) throws HibernateException {
        Session session = this.sessionFactoryService.getFactory().openSession();
        Transaction transaction = null;
        List<Monument> records;

        try {
            transaction = session.beginTransaction();
            String queryString = "FROM " + Monument.class.getName() +
                    "WHERE title = '" + monument.getTitle() + "' " +
                    "AND city = '" + monument.getCity() + "' " +
                    "AND state = '" + monument.getState() + "'";
            if (monument.getId() != null) {
                queryString += " AND id != " + monument.getId();
            }
            records = session.createQuery(queryString).list();
            transaction.commit();
            session.close();
        } catch (HibernateException e) {
            if (transaction != null) {
                transaction.rollback();
            }
            session.close();
            throw e;
        }

        return records;
    }
}
