package com.monumental.triggers;

import com.monumental.models.Model;
import org.hibernate.event.spi.*;
import org.hibernate.persister.entity.EntityPersister;
import org.springframework.stereotype.Component;

import java.lang.reflect.InvocationTargetException;
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

    /**
     * This function and the other boolean event listeners return false as returning true
     * vetoes the operation and prevents the insert.
     * See https://docs.jboss.org/hibernate/orm/4.1/javadocs/org/hibernate/event/spi/PreInsertEventListener.html
     */
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
            T originalModel = (T) event.getPersister().getFactory().openSession().get(this.getModelClass(), model.getId());
            this.beforeUpdate(model, originalModel);

            /* Due to a bug/limitation of hibernate, the changes to the event entity do not propagate to the database
             * in PreUpdate events. This code circumvents that by manually updating the event's state array with changed
             * properties after the trigger method is run, so that they propagate
             * The propertyNames correspond to the state array by index
             */
            List<String> propertyNames = Arrays.asList(event.getPersister().getEntityMetamodel().getPropertyNames());
            List<Object> state = Arrays.asList(event.getState());

            Class modelClass = this.getModelClass();

            // Check if each field was changed
            for (int i = 0; i < propertyNames.size(); i++) {
                String propertyName = propertyNames.get(i);
                // This always appears as null in the updated object, no need for us to manually change it, that's handled by hibernate
                if (propertyName.equals("updatedDate")) continue;
                // Use reflection to call the property's associated public getter
                // This can and will fail if getters are named abnormally
                String getter = "get" + propertyName.substring(0, 1).toUpperCase() + propertyName.substring(1);
                try {
                    Object originalValue = modelClass.getMethod(getter).invoke(originalModel);
                    Object newValue = modelClass.getMethod(getter).invoke(model);
                    // Check if the originalRecord passed to the trigger method had any changes made to this field
                    if ((originalValue == null && newValue != null) ||
                        (originalValue != null && !originalValue.equals(newValue))) {
                        state.set(i, newValue);
                    }
                } catch (IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
                    System.err.println("Failed to get property reflectively: " + propertyName);
                    e.printStackTrace();
                }
            }
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
