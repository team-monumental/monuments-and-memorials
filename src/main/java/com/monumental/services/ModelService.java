package com.monumental.services;

import com.monumental.models.Model;
import org.hibernate.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.ParameterizedType;
import java.util.*;

/**
 * This class handles the generic CRUD of Hibernate entities
 *
 * @param <T> The Entity this Service is responsible for handling database transactions of
 */
@Service
public abstract class ModelService<T extends Model> {

    /**
     * Various hibernate methods require a Class reference to the Model being queried
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

    @Autowired
    SessionFactoryService sessionFactoryService;

    private List<Integer> doInsert(List<T> records) throws HibernateException {

        Session session = this.sessionFactoryService.getFactory().openSession();
        Transaction transaction = null;
        List<Integer> ids = new ArrayList<>();

        try {
            transaction = session.beginTransaction();
            for (T record : records) {
                ids.add((Integer) session.save(record));
            }
            transaction.commit();
            session.close();
        } catch (HibernateException e) {
            if (transaction != null) {
                transaction.rollback();
            }
            session.close();
            throw e;
        }

        return new ArrayList<>(new HashSet<>(ids));
    }

    @SuppressWarnings("unchecked")
    private List<T> doGet(List<Integer> ids, boolean initializeLazyLoadedCollections) throws HibernateException {

        Session session = this.sessionFactoryService.getFactory().openSession();
        Transaction transaction = null;
        List<T> records;

        try {
            transaction = session.beginTransaction();
            String tableName = this.getModelClass().getName();
            if (ids == null) {
                records = session.createQuery("FROM " + tableName).list();
            } else if (ids.size() == 1) {
                records = new ArrayList<>();
                records.add((T) session.get(this.getModelClass(), ids.get(0)));
            } else {
                Query q = session.createQuery(
                    "FROM " + tableName +
                    " WHERE id IN (:ids)"
                );
                q.setParameterList("ids",
                        ids);
                records = q.list();
            }
            transaction.commit();

            if (initializeLazyLoadedCollections) {
                this.initializeLazyLoadedCollections(records);
            }

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

    private void doUpdate(List<T> records) throws HibernateException {
        Session session = this.sessionFactoryService.getFactory().openSession();
        Transaction transaction = null;

        try {
            transaction = session.beginTransaction();
            for (T record : records) {
                session.update(record);
            }
            transaction.commit();
            session.close();
        } catch (HibernateException e) {
            if (transaction != null) {
                transaction.rollback();
            }
            session.close();
            throw e;
        }
    }

    @SuppressWarnings("unchecked")
    private void doDelete(List<Integer> ids) throws HibernateException {

        Session session = this.sessionFactoryService.getFactory().openSession();
        Transaction transaction = null;
        List<T> records = new ArrayList<>();

        try {
            transaction = session.beginTransaction();
            if (ids == null) {
                records = session.createCriteria(this.getModelClass()).list();
            } else {
                for (Integer id : ids) {
                    records.add((T) session.get(this.getModelClass(), id));
                }
            }
            for (T record : records) {
                session.delete(record);
            }
            transaction.commit();
            session.close();
        } catch (HibernateException e) {
            if (transaction != null) {
                transaction.rollback();
            }
            session.close();
            throw e;
        }
    }

    public Integer insert(T record) throws HibernateException {
        ArrayList<T> records = new ArrayList<>();
        records.add(record);
        return this.doInsert(records).get(0);
    }

    public List<Integer> insert(List<T> records) throws HibernateException {
        return this.doInsert(records);
    }

    public T get(Integer id) throws HibernateException {
        return this.get(id, false);
    }

    public T get(Integer id, boolean initializeLazyLoadedCollections) throws HibernateException {
        ArrayList<Integer> ids = new ArrayList<>();
        ids.add(id);
        return this.doGet(ids, initializeLazyLoadedCollections).get(0);
    }

    public List<T> get(List<Integer> ids) throws HibernateException {
        return this.get(ids, false);
    }

    public List<T> get(List<Integer> ids, boolean initializeLazyLoadedCollections) throws HibernateException {
        return this.doGet(ids, initializeLazyLoadedCollections);
    }

    public List<T> getAll() throws HibernateException {
        return this.getAll(false);
    }

    public List<T> getAll(boolean initializeLazyLoadedCollections) throws HibernateException {
        return this.doGet(null, initializeLazyLoadedCollections);
    }

    public void update(T record) throws HibernateException {
        ArrayList<T> records = new ArrayList<>();
        records.add(record);
        this.doUpdate(records);
    }

    public void update(List<T> records) throws HibernateException {
        this.doUpdate(records);
    }

    public void delete(Integer id) throws HibernateException {
        ArrayList<Integer> ids = new ArrayList<>();
        ids.add(id);
        this.doDelete(ids);
    }

    public void delete(List<Integer> ids) throws HibernateException {
        this.doDelete(ids);
    }

    List<T> getByForeignKey(String foreignKeyName, Object foreignKey) {
        return this.getByForeignKey(foreignKeyName, foreignKey, false);
    }

    @SuppressWarnings("unchecked")
    List<T> getByForeignKey(String foreignKeyName, Object foreignKey, boolean initializeLazyLoadedCollections) {
        Session session = this.sessionFactoryService.getFactory().openSession();
        Transaction transaction = null;
        List<T> records;
        String tableName = this.getModelClass().getName();

        try {
            transaction = session.beginTransaction();
            records = session.createQuery("FROM " + tableName + " where " + foreignKeyName + " = :foreignKey")
                    .setParameter("foreignKey", foreignKey)
                    .list();
            transaction.commit();

            if (initializeLazyLoadedCollections) {
                initializeLazyLoadedCollections(records);
            }

            session.close();
        } catch (HibernateException e) {
            if (transaction != null) {
                transaction.rollback();
            }
            session.close();
            System.err.println("Error attempting to get " + tableName + " by foreign key " + foreignKeyName + ": " + foreignKey);
            System.err.println(e.getMessage());
            throw e;
        }

        return records;
    }

    List<T> getByJoinTable(String relationshipName, String foreignKeyName, Object foreignKey) {
        return this.getByJoinTable(relationshipName, foreignKeyName, foreignKey, false);
    }

    @SuppressWarnings("unchecked")
    List<T> getByJoinTable(String relationshipName, String foreignKeyName, Object foreignKey, boolean initializeLazyLoadedCollections) {

        Session session = this.sessionFactoryService.getFactory().openSession();
        Transaction transaction = null;
        List<T> records;
        String tableName = this.getModelClass().getName();

        try {
            transaction = session.beginTransaction();
            records = session.createQuery("SELECT t FROM " + tableName + " t JOIN t." + relationshipName + " m WHERE m." + foreignKeyName + " = :foreignKey")
                    .setParameter("foreignKey", foreignKey)
                    .list();
            transaction.commit();

            if (initializeLazyLoadedCollections) {
                this.initializeLazyLoadedCollections(records);
            }

            session.close();
        } catch (HibernateException e) {
            if (transaction != null) {
                transaction.rollback();
            }
            session.close();
            System.err.println("Error attempting to get " + tableName + " by join table relationship " + relationshipName + " and foreign key " + foreignKeyName + ": " + foreignKey);
            System.err.println(e.getMessage());
            throw e;
        }

        return records;
    }

    /**
     * Helper method that attempts to get and initialize all collections on a record before its session is closed
     * This is helpful when you need to access lazy loaded data, since sessions are always closed in the get methods
     * before the calling class ever has a chance to initialize lazy collections
     * Modified from this answer https://stackoverflow.com/a/24870618/10044594
     */
    private void initializeLazyLoadedCollections(List<T> records) {
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