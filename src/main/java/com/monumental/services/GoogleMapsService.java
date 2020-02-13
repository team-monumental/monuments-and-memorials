package com.monumental.services;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.errors.ApiException;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.LatLng;
import com.monumental.util.string.StringHelper;
import com.vividsolutions.jts.geom.Point;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class GoogleMapsService {

    @Value("${GOOGLE_API_KEY:default}")
    private String GOOGLE_API_KEY;

    public String getAddressFromCoordinates(Double lat, Double lon) {
        try {
            GeoApiContext context = this.buildGeoApiContext();
            if (context != null) {
                System.out.println("[GOOGLE MAPS SERVICE]: Making reverse geocode request for lat/lon: (" + lat + ", " + lon + ")");
                GeocodingResult[] results = GeocodingApi.reverseGeocode(context, new LatLng(lat, lon))
                        .await();
                return results[0].formattedAddress;
            }
        } catch (ApiException | InterruptedException | IOException e) {
            System.out.println("[GOOGLE MAPS SERVICE]: Error when attempting to make reverse geocode request for lat/lon: (" + lat + ", " + lon + ")");
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Get a set of coordinates from the specified address using Google Maps
     * @param address - String for the address to geocode
     * @return Point - Point object containing the latitude and longitude of the address
     */
    public Point getCoordinatesFromAddress(String address) {
        if (StringHelper.isNullOrEmpty(address)) {
            return null;
        }

        try {
            GeoApiContext context = this.buildGeoApiContext();
            if (context != null) {
                System.out.println("[GOOGLE MAPS SERVICE]: Making geocode request for address: " + address);
                GeocodingResult[] results = GeocodingApi.geocode(context, address)
                        .await();
                return MonumentService.createMonumentPoint(results[0].geometry.location.lng,
                        results[0].geometry.location.lat);
            }
        } catch (ApiException | InterruptedException | IOException e) {
            System.out.println("[GOOGLE MAPS SERVICE]: Error when attempting to make geocode request for address: " + address);
            e.printStackTrace();
        }

        return null;
    }

    /**
     * Helper function to build a Google Maps GeoApiContext
     * Returns null if the GOOGLE_API_KEY is equal to "default"
     * @return GeoApiContext - new GeoApiContext, null if the GOOGLE_API_KEY is "default"
     */
    private GeoApiContext buildGeoApiContext() {
        if (GOOGLE_API_KEY.equals("default")) {
            return null;
        }

        return new GeoApiContext.Builder()
                .apiKey(this.GOOGLE_API_KEY)
                .build();
    }
}
