package com.monumental.listeners;

import com.monumental.models.Monument;
import com.monumental.repositories.MonumentRepository;
import com.monumental.services.GoogleMapsService;
import com.vividsolutions.jts.geom.Point;
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

        // If the record has no address, do a reverse geocode
        if (record.getAddress() == null && record.getCoordinates() != null) {
            String address = googleMapsService.getAddressFromCoordinates(record.getLat(), record.getLon());
            if (address != null) {
                record.setAddress(address);
            }
        }
        // If the record has no coordinates, do a geocode
        else if (record.getCoordinates() == null && record.getAddress() != null) {
            Point coordinates = googleMapsService.getCoordinatesFromAddress(record.getAddress());
            if (coordinates != null) {
                record.setCoordinates(coordinates);
            }
        }
    }

    @PreUpdate
    void onPreUpdate(Object entity) {
        Monument record = (Monument) entity;
        Monument original = this.getOriginal(record);
        // TODO: does this still happen with EntityListeners
        // If you call update on a record that doesn't actually exist it ends up firing the update trigger
        // when really it's an insert, so manually redirect to the insert trigger

        // If the new record has an address, no need to reverse geocode
        if (record.getAddress() != null) {
            return;
        }

        // If the new record has no coordinates, we can't reverse geocode
        if (record.getCoordinates() == null) {
            return;
        }

        // If the coordinates match, set the address on the new record
        if (original.getCoordinates() != null && record.getCoordinates().equals(original.getCoordinates())) {
            record.setAddress(original.getAddress());
            return;
        }

        // Perform reverse geocoding
        String address = googleMapsService.getAddressFromCoordinates(record.getLat(), record.getLon());
        if (address != null) {
            record.setAddress(address);
        }

        // If the new record has coordinates, no need to geocode
        if (record.getCoordinates() != null) {
            return;
        }

        // If the new record has no address, we can't geocode
        if (record.getAddress() == null) {
            return;
        }

        // If the addresses match, set the coordinates on the new record
        if (original.getAddress() != null && record.getAddress().equals(original.getAddress())) {
            record.setCoordinates(original.getCoordinates());
            return;
        }

        // Perform geocode
        Point coordinates = googleMapsService.getCoordinatesFromAddress(record.getAddress());
        if (coordinates != null) {
            record.setCoordinates(coordinates);
        }
    }
}
