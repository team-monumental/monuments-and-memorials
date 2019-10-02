package com.monumental.listeners;

import com.monumental.models.Monument;
import com.monumental.services.MonumentService;
import org.hibernate.event.spi.PreInsertEvent;
import org.hibernate.event.spi.PreInsertEventListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MonumentListener implements PreInsertEventListener {

    @Autowired
    MonumentService monumentService;

    @Override
    public boolean onPreInsert(PreInsertEvent event) {
        if (!(event.getEntity() instanceof Monument)) {
            return false;
        }

        Monument monument = (Monument) event.getEntity();
        monumentService.generateSlug(monument);

        return false;
    }
}