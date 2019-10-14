package com.monumental.services;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.errors.ApiException;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.LatLng;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class GoogleMapsService {

    @Value("${GOOGLE_API_KEY}")
    private String GOOGLE_API_KEY;

    public String getAddressFromCoordinates(Double lat, Double lon) {
        try {
            System.out.println("[GOOGLE MAPS SERVICE]: Making reverse geocode request for lat/lon: (" + lat + ", " + lon + ")");
            GeoApiContext context = new GeoApiContext.Builder()
                .apiKey(this.GOOGLE_API_KEY)
                .build();
            GeocodingResult[] results = GeocodingApi.reverseGeocode(context, new LatLng(lat, lon))
                .await();
            return results[0].formattedAddress;
        } catch (ApiException | InterruptedException | IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
