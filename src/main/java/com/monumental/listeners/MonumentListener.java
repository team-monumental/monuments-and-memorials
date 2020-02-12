package com.monumental.listeners;

import com.monumental.models.Monument;
import com.monumental.repositories.MonumentRepository;
import com.monumental.services.GoogleMapsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.persistence.*;

@Component
public class MonumentListener extends ModelListener<Monument> {

    static private GoogleMapsService googleMapsService;

    static private MonumentRepository monumentRepository;

    @Autowired
    public void init(MonumentRepository monumentRepository, GoogleMapsService googleMapsService) {
        MonumentListener.monumentRepository = monumentRepository;
        MonumentListener.googleMapsService = googleMapsService;
    }

    MonumentRepository getRepository() {
        return monumentRepository;
    }

    @PrePersist
    void onPrePersist(Object entity) {
        Monument record = (Monument) entity;
        // Only call the Google API if there's no address
        if (record.getAddress() != null) {
            return;
        }

        if (record.getCoordinates() == null) {
            return;
        }

        String address = googleMapsService.getAddressFromCoordinates(record.getLat(), record.getLon());
        if (address != null) record.setAddress(address);
    }

    @PreUpdate
    void onPreUpdate(Object entity) {
        Monument record = (Monument) entity;
        Monument original = this.getOriginal(record);
        // TODO: does this still happen with EntityListeners
        // If you call update on a record that doesn't actually exist it ends up firing the update trigger
        // when really it's an insert, so manually redirect to the insert trigger

        if (record.getCoordinates() == null) {
            return;
        }

        // Don't call the API if an address is provided
        if (record.getAddress() != null) return;
        // Don't call the API if no change has been made to the coordinates
        if (original.getCoordinates() != null && record.getCoordinates().equals(original.getCoordinates())) {
            record.setAddress(original.getAddress());
            return;
        }
        String address = googleMapsService.getAddressFromCoordinates(record.getLat(), record.getLon());
        if (address != null) record.setAddress(address);
    }
}
