package com.monumental.services;

import com.monumental.listeners.MonumentListener;
import com.monumental.models.*;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.event.service.spi.EventListenerRegistry;
import org.hibernate.event.spi.EventType;
import org.hibernate.internal.SessionFactoryImpl;
import org.hibernate.service.ServiceRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class SessionFactoryService {

    private SessionFactory factory;

    public SessionFactoryService() {

        try {
            Configuration conf = new Configuration()
                    .configure();
            Class[] classes = new Class[]{
                    Model.class,
                    Monument.class
            };
            for (Class c : classes) {
                conf.addAnnotatedClass(c);
            }
            ServiceRegistry registry = new StandardServiceRegistryBuilder().applySettings(conf.getProperties()).build();
            this.factory = conf.buildSessionFactory(registry);
        } catch (Throwable ex) {
            System.err.println("Initial SessionFactory creation failed." + ex);
            throw new ExceptionInInitializerError(ex);
        }
    }

    public SessionFactory getFactory() {
        return this.factory;
    }

    @Autowired
    private MonumentListener monumentListener;

    /**
     * Listeners must be registered here so that they are called for the proper events
     * If a listener listens to multiple EventTypes it must be added for each EventType
     */
    @PostConstruct
    public void registerListeners() {
        EventListenerRegistry registry = ((SessionFactoryImpl) this.factory).getServiceRegistry().getService(EventListenerRegistry.class);
        registry.getEventListenerGroup(EventType.PRE_INSERT).appendListener(monumentListener);
    }
}
