package com.monumental.listeners;

import com.monumental.models.Monument;
import com.monumental.services.MonumentService;
import org.hibernate.event.spi.PreInsertEvent;
import org.hibernate.event.spi.PreInsertEventListener;
import org.hibernate.event.spi.PreUpdateEvent;
import org.hibernate.event.spi.PreUpdateEventListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MonumentListener implements PreInsertEventListener, PreUpdateEventListener {

    @Autowired
    MonumentService monumentService;

    /**
     * Before a Monument is inserted, generate its slug
     */
    @Override
    public boolean onPreInsert(PreInsertEvent event) {
        // This event is called for all inserts so filter out non-Monuments
        if (!(event.getEntity() instanceof Monument)) {
            return false;
        }

        Monument monument = (Monument) event.getEntity();
        monumentService.generateSlug(monument);

        return false;
    }

    @Override
    public boolean onPreUpdate(PreUpdateEvent event) {
        try {
            if (!(event.getEntity() instanceof Monument)) {
                return false;
            }

            Monument updatedMonument = (Monument) event.getEntity();
            Monument existingMonument = monumentService.get(updatedMonument.getId());

            // This event apparently gets called on insert sometimes, so this skips if there is no existing record
            if (existingMonument == null) return false;

            if (monumentService.slugChanged(existingMonument, updatedMonument)) {
                monumentService.generateSlug(updatedMonument);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }
}