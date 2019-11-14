package com.monumental.services;

import com.monumental.models.Model;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.ParameterizedType;
import java.util.Arrays;
import java.util.List;

/**
 * This class handles the generic CRUD of Hibernate entities
 *
 * @param <T> The Entity this Service is responsible for handling database transactions of
 */
@Service
public abstract class ModelService<T extends Model> {

    /**
     * This is the JPA 2 way of interacting with the database and replaces the Hibernate Session API
     * TODO: Replace ALL Hibernate Session code with EntityManager
     */
    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Various JPA methods require a Class reference to the Model being queried
     * At some points we also need the name of the table, which is accessible from the Class
     * This method retrieves the Class at runtime, avoiding type erasure
     * https://stackoverflow.com/questions/6624113/get-type-name-for-generic-parameter-of-generic-class
     * @return Class of the Model associated with this ModelService
     */
    @SuppressWarnings("unchecked")
    private Class<T> getModelClass()
    {
        return ((Class<T>) ((ParameterizedType) getClass()
                .getGenericSuperclass()).getActualTypeArguments()[0]);
    }

    /**
     * This is handles your connection to the database and has the CriteriaBuilder reference
     */
    public EntityManager getEntityManager() {
        return this.entityManager;
    }

    public CriteriaBuilder getCriteriaBuilder() {
        return this.getEntityManager().getCriteriaBuilder();
    }

    public CriteriaQuery<T> createCriteriaQuery() {
        return this.createCriteriaQuery(this.getCriteriaBuilder());
    }

    public CriteriaQuery<T> createCriteriaQuery(CriteriaBuilder builder) {
        return this.createCriteriaQuery(builder, true);
    }

    /**
     * Creates a CriteriaQuery and optionally creates its Root for you and sets it to distinct mode (no duplicates)
     * @param builder   Your CriteriaBuilder, from getCriteriaBuilder()
     * @param setRoot   If true, a Root will be created for you and set on the CriteriaQuery
     *                  You may choose to leave this false if you need a reference to the Root in order to do things
     *                  such as root.fetch("collectionName", FetchType.LEFT) if you want to include a lazy-loaded
     *                  collection in your query results
     */
    public CriteriaQuery<T> createCriteriaQuery(CriteriaBuilder builder, boolean setRoot) {
        CriteriaQuery<T> query = builder.createQuery(this.getModelClass());
        if (setRoot) {
            Root<T> root = this.createRoot(query);
            query.select(root).distinct(true);
        }
        return query;
    }

    /**
     * Creates a JPA 2 Root object, which basically tells a CriteriaQuery what object it's querying and can also
     * be used to .fetch lazily loaded collections
     * Only call this if you have a need for the reference to the Root, such as for calling .fetch, otherwise
     * just let createCriteriaQuery create the Root for you with createCriteriaQuery(builder, true)
     * @param query Your CriteriaQuery from createCriteriaQuery(builder, false)
     */
    public Root<T> createRoot(CriteriaQuery<T> query) {
        Root<T> root = query.from(this.getModelClass());
        return root;
    }

    public List<T> getWithCriteriaQuery(CriteriaQuery<T> query) {
        return this.getEntityManager().createQuery(query).getResultList();
    }

    public List<T> getWithCriteriaQuery(CriteriaQuery<T> query, Integer limit) {
        return this.getEntityManager().createQuery(query).setMaxResults(limit).getResultList();
    }

    public List<T> getWithCriteriaQuery(CriteriaQuery<T> query, Integer limit, Integer page) {
        return this.getEntityManager().createQuery(query).setMaxResults(limit).setFirstResult(page * limit).getResultList();
    }

    public void initializeAllLazyLoadedCollections(T record) {
        initializeAllLazyLoadedCollections(Arrays.asList(record));
    }

    /**
     * Helper method that attempts to get and initialize all collections on a record before its session is closed
     * This is helpful when you need to access lazy loaded data, since sessions are always closed in the get methods
     * before the calling class ever has a chance to initialize lazy collections
     * Modified from this answer https://stackoverflow.com/a/24870618/10044594
     */
    public void initializeAllLazyLoadedCollections(List<T> records) {
        for (T record : records) {
            Method[] methods = record.getClass().getMethods();
            for (Method method : methods) {

                String methodName = method.getName();

                // check Getters exclusively
                if (methodName.length() < 3 || !"get" .equals(methodName.substring(0, 3))) {
                    continue;
                }

                // Getters without parameters
                if (method.getParameterTypes().length > 0) {
                    continue;
                }

                int modifiers = method.getModifiers();

                // Getters that are public
                if (!Modifier.isPublic(modifiers))
                    continue;

                // but not static
                if (Modifier.isStatic(modifiers))
                    continue;

                try {
                    // Check result of the Getter
                    Object r = method.invoke(record);
                    if (r != null) {
                        Hibernate.initialize(r);
                    }
                } catch ( InvocationTargetException | IllegalArgumentException | IllegalAccessException e ) {
                    e.printStackTrace();
                    return;
                }
            }
        }
    }
}
