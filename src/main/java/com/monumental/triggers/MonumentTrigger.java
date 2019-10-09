package com.monumental.triggers;

import com.monumental.models.Monument;
import com.monumental.services.GoogleMapsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MonumentTrigger extends ModelTrigger<Monument> {

    @Autowired
    GoogleMapsService googleMapsService;

    @Override
    void beforeInsert(Monument record) {
        // Only call the Google API if there's no address
        if (record.getAddress() != null) {
            return;
        }

        record.setAddress(googleMapsService.getAddressFromCoordinates(record.getLat(), record.getLon()));
    }

    @Override
    void beforeUpdate(Monument record, Monument original) {
        // Don't call the API if an address is provided
        if (record.getAddress() != null) return;
        // Don't call the API if no change has been made to the coordinates
        if (record.getCoordinatePointAsString().equals(original.getCoordinatePointAsString())) {
            this.setProperty("address", original.getAddress());
            return;
        }
        this.setProperty("address", googleMapsService.getAddressFromCoordinates(record.getLat(), record.getLon()));
    }
}
