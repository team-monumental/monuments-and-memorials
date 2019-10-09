package com.monumental.triggers;

import com.monumental.models.Model;
import org.hibernate.event.spi.*;
import org.hibernate.persister.entity.EntityPersister;
import org.springframework.stereotype.Component;

import java.lang.reflect.ParameterizedType;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * This class wraps the Hibernate event system into an easier-to-use parent class
 * @param <T> The Model to trigger on - only this Model type will be watched by the subclass
 */
@SuppressWarnings("unchecked")
@Component
public class ModelTrigger<T extends Model> implements
        PreInsertEventListener, PostInsertEventListener, PreUpdateEventListener, PostUpdateEventListener,
        PreDeleteEventListener, PostDeleteEventListener {

    private List<String> propertyNames;
    private List<Object> state;

    /** Trigger Methods to be Overridden */

    void beforeInsert(T record) {

    }
    void afterInsert(T record) {

    }
    void beforeUpdate(T record, T original) {

    }
    void afterUpdate(T record, T original) {

    }
    void beforeDelete(T record) {

    }
    void afterDelete(T record) {

    }

    /** Hibernate Event Listeners */

    @Override
    public boolean onPreInsert(PreInsertEvent event) {
        Object entity = event.getEntity();
        if (entity.getClass().equals(this.getModelClass())) {
            this.beforeInsert((T) entity);
        }
        return false;
    }

    @Override
    public void onPostInsert(PostInsertEvent event) {
        Object entity = event.getEntity();
        if (entity.getClass().equals(this.getModelClass())) {
            this.afterInsert((T) entity);
        }
    }

    @Override
    public boolean onPreUpdate(PreUpdateEvent event) {
        Object entity = event.getEntity();
        if (entity.getClass().equals(this.getModelClass())) {
            T model = (T) event.getEntity();
            this.state = Arrays.asList(event.getState());
            this.propertyNames = Arrays.asList(event.getPersister().getEntityMetamodel().getPropertyNames());
            this.beforeUpdate(model, (T) event.getPersister().getFactory().openSession().get(this.getModelClass(), model.getId()));
            this.state = null;
            this.propertyNames = null;
        }
        return false;
    }

    @Override
    public void onPostUpdate(PostUpdateEvent event) {
        Object entity = event.getEntity();
        if (entity.getClass().equals(this.getModelClass())) {
            T model = (T) event.getEntity();
            this.afterUpdate(model, (T) event.getPersister().getFactory().openSession().get(this.getModelClass(), model.getId()));
        }
    }

    @Override
    public boolean onPreDelete(PreDeleteEvent event) {
        Object entity = event.getEntity();
        if (entity.getClass().equals(this.getModelClass())) {
            this.beforeDelete((T) entity);
        }
        return false;
    }

    @Override
    public void onPostDelete(PostDeleteEvent event) {
        Object entity = event.getEntity();
        if (entity.getClass().equals(this.getModelClass())) {
            this.afterDelete((T) entity);
        }
    }

    /**
     * For some stupid reason, changes you make to the event entity in a PreUpdate do not persist
     * to the database, but changes you make to the event state do, so this is a helper method
     * for changing that state array during PreUpdate triggers. Not an ideal solution
     */
    void setProperty(String name, Object value) {
        this.state.set(this.propertyNames.indexOf(name), value);
    }

    /**
     * Hibernate makes it a little difficult to check what data has been changed in an update vent
     * This method makes a map of field names and values for the old state of the Model so that
     * you can check if changes have been made
     */
    private Map<String, Object> mapOldState(String[] properties, Object[] oldState) {
        Map<String, Object> mapped = new HashMap<>();
        if (properties.length != oldState.length) {
            System.err.println("Updated entity does not have matching properties and oldState.");
            return mapped;
        }

        for (int i = 0; i < properties.length; i++) {
            mapped.put(properties[i], oldState[i]);
        }

        return mapped;
    }

    /**
     * Event listeners fire on all entities, so we must know the class of the Model we're trying
     * to listen to. This method retrieves the Class at runtime, avoiding type erasure.
     * See the same class in ModelService
     * https://stackoverflow.com/questions/6624113/get-type-name-for-generic-parameter-of-generic-class
     * @return Class of the Model associated with this ModelTrigger
     */
    @SuppressWarnings("unchecked")
    private Class<T> getModelClass()
    {
        return ((Class<T>) ((ParameterizedType) getClass()
                .getGenericSuperclass()).getActualTypeArguments()[0]);
    }

    @Override
    public boolean requiresPostCommitHanding(EntityPersister persister) {
        return true;
    }

}
