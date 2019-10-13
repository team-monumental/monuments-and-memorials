package com.monumental.services;

import com.monumental.models.Image;
import com.monumental.models.Model;
import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.triggers.MonumentTrigger;
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
import java.util.Arrays;
import java.util.List;

@Service
public class SessionFactoryService {

    @Autowired
    public MonumentTrigger monumentTrigger;

    /** IMPORTANT: Update these lists when creating triggers or models
     *  Triggers must be autowired, and the string must match the property's name
     */
    private final List<String> triggers = Arrays.asList(
        "monumentTrigger"
    );
    private final List<Class> models = Arrays.asList(
        Model.class, Monument.class, Tag.class,
        Image.class
    );

    private SessionFactory factory;
    private ServiceRegistry registry;

    // These must correspond with the events covered by ModelTrigger
    private static EventType[] eventTypes = new EventType[]{
        EventType.PRE_INSERT, EventType.POST_INSERT, EventType.PRE_UPDATE,
        EventType.POST_UPDATE, EventType.PRE_DELETE, EventType.POST_DELETE
    };

    public SessionFactoryService() {

        try {
            Configuration conf = new Configuration()
                    .configure();
            for (Class c : this.models) {
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

    /**
     * Listeners must be registered here so that they are called for the proper events
     * If a listener listens to multiple EventTypes it must be added for each EventType
     */
    @SuppressWarnings("unchecked")
    @PostConstruct
    public void registerListeners() throws NoSuchFieldException, IllegalAccessException {
        EventListenerRegistry registry = ((SessionFactoryImpl) this.factory).getServiceRegistry().getService(EventListenerRegistry.class);
        // Make every ModelTrigger execute on every EventType
        // If the ModelTrigger doesn't override the associated methods then they won't do anything
        for (EventType type : eventTypes) {
            for (String triggerName : this.triggers) {
                // Use reflection to get the trigger
                // The trigger must be public for this to work correctly
                registry.prependListeners(type, SessionFactoryService.class.getField(triggerName).get(this));
            }
        }
    }
}
