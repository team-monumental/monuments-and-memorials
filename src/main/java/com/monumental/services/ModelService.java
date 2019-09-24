package com.monumental.services;

import com.monumental.models.Model;
import com.monumental.services.SessionFactoryService;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

/**
 * This class handles the generic CRUD of Hibernate entities
 *
 * @param <T> The Entity this Service is responsible for handling database transactions of
 */
@Service
public abstract class ModelService<T extends Model> {

    @Autowired
    SessionFactoryService sessionFactoryService;
    private Class<T> tClass;

    /**
     * Set the Class to be used for generic calls to Hibernate later
     * This function is required before certain session functions can be
     * called because you cannot extract a generic's type due to type erasure.
     * This allows for the CRUD functions to be called without having to pass in the class every time
     *
     * @param tClass The Class of this Service's data type
     */
    public void setClass(Class<T> tClass) {
        this.tClass = tClass;
    }

    public String getTClass() {
        return this.tClass.getName();
    }

    /**
     * TODO: Handle this better
     *
     * @return true if this class has been told what class its generic is
     */
    private boolean noClassSpecified() {
        return this.tClass == null;
    }

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
        List<T> records = new ArrayList<>();

        try {
            transaction = session.beginTransaction();
            if (ids == null) {
                records = session.createQuery("FROM " + this.tClass.getName()).list();
            } else {
                for (Integer id : ids) {
                    records.add((T) session.get(this.tClass, id));
                }
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
                records = session.createCriteria(tClass).list();
            } else {
                for (Integer id : ids) {
                    records.add((T) session.get(this.tClass, id));
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
        if (this.noClassSpecified()) return null;
        ArrayList<T> records = new ArrayList<>();
        records.add(record);
        return this.doInsert(records).get(0);
    }

    public List<Integer> insert(List<T> records) throws HibernateException {
        if (this.noClassSpecified()) return null;
        return this.doInsert(records);
    }

    public T get(Integer id) throws HibernateException {
        if (this.noClassSpecified()) return null;
        ArrayList<Integer> ids = new ArrayList<>();
        ids.add(id);
        return this.doGet(ids).get(0);
    }

    public List<T> getAll(List<Integer> ids) throws HibernateException {
        if (this.noClassSpecified()) return null;
        return this.doGet(ids);
    }

    public List<T> getAll() throws HibernateException {
        if (this.noClassSpecified()) return null;
        return this.doGet(null);
    }

    public void update(T record) throws HibernateException {
        if (this.noClassSpecified()) return;
        ArrayList<T> records = new ArrayList<>();
        records.add(record);
        this.doUpdate(records);
    }

    public void update(List<T> records) throws HibernateException {
        if (this.noClassSpecified()) return;
        this.doUpdate(records);
    }

    public void delete(Integer id) throws HibernateException {
        if (this.noClassSpecified()) return;
        ArrayList<Integer> ids = new ArrayList<>();
        ids.add(id);
        this.doDelete(ids);
    }

    public void delete(List<Integer> ids) throws HibernateException {
        if (this.noClassSpecified()) return;
        this.doDelete(ids);
    }
}