package com.monumental.services;

import com.monumental.models.Model;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    private List<T> doGet(List<Integer> ids) throws HibernateException {

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
        ArrayList<Integer> ids = new ArrayList<>();
        ids.add(id);
        return this.doGet(ids).get(0);
    }

    public List<T> get(List<Integer> ids) throws HibernateException {
        return this.doGet(ids);
    }

    public List<T> getAll() throws HibernateException {
        return this.doGet(null);
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

    @SuppressWarnings("unchecked")
    List<T> getByForeignKey(String foreignKeyName, Integer foreignKey) {
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
}