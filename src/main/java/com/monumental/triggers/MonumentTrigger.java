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
        String address = googleMapsService.getAddressFromCoordinates(record.getLat(), record.getLon());
        if (address != null) record.setAddress(address);
    }

    @Override
    void beforeUpdate(Monument record, Monument original) {
        // If you call update on a record that doesn't actually exist it ends up firing the update trigger
        // when really it's an insert, so manually redirect to the insert trigger
        if (original == null) {
            beforeInsert(record);
            return;
        }
        // Don't call the API if an address is provided
        if (record.getAddress() != null) return;
        // Don't call the API if no change has been made to the coordinates
        if (record.getCoordinatePointAsString().equals(original.getCoordinatePointAsString())) {
            record.setAddress(original.getAddress());
            return;
        }
        String address = googleMapsService.getAddressFromCoordinates(record.getLat(), record.getLon());
        if (address != null) record.setAddress(address);
    }
}
