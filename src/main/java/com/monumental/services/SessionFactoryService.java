package com.monumental.services;

import com.monumental.models.*;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.springframework.stereotype.Service;

@Service
public class SessionFactoryService {

    private SessionFactory factory;
    private ServiceRegistry registry;

    public SessionFactoryService() {

        try {
            Configuration conf = new Configuration()
                    .configure();
            Class[] classes = new Class[]{
                    Model.class,
                    MandM.class
            };
            for (Class c : classes) {
                conf.addAnnotatedClass(c);
            }
            this.registry = new StandardServiceRegistryBuilder().applySettings(conf.getProperties()).build();
            this.factory = conf.buildSessionFactory(this.registry);
        } catch (Throwable ex) {
            System.err.println("Initial SessionFactory creation failed." + ex);
            throw new ExceptionInInitializerError(ex);
        }
    }

    public SessionFactory getFactory() {
        return this.factory;
    }
}
