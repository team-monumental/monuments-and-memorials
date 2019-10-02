package com.monumental.listeners;

import com.monumental.models.Monument;
import org.hibernate.event.spi.PreInsertEvent;
import org.hibernate.event.spi.PreInsertEventListener;

public class MonumentListener implements PreInsertEventListener {

    @Override
    public boolean onPreInsert(PreInsertEvent event) {
        if (!(event.getEntity() instanceof Monument)) {
            return false;
        }

        Monument monument = (Monument) event.getEntity();
        monument.setSlug("slug");

        return false;
    }
}