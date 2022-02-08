package com.monumental.services;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.errors.ApiException;
import com.google.maps.model.*;
import com.monumental.util.string.StringHelper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class GoogleMapsService {

    @Value("${GOOGLE_API_KEY:default}")
    private String GOOGLE_API_KEY;

    /**
     * Get an address along with city and state from the specified coordinates using Google Maps
     *
     * @param lat - latitude
     * @param lon - longitude
     * @return AddressBundle - Bundle including address, city, and state
     */
    public AddressBundle getAddressFromCoordinates(Double lat, Double lon) {
        try {
            GeoApiContext context = this.buildGeoApiContext();
            if (context != null) {
                System.out.println("[GOOGLE MAPS SERVICE]: Making reverse geocode request for lat/lon: (" + lat + ", " + lon + ")");
                GeocodingResult[] results = GeocodingApi.reverseGeocode(context, new LatLng(lat, lon))
                        .await();
                if (results.length > 0) {
                    return this.buildBundle(results[0]);
                }
            }
        } catch (ApiException | InterruptedException | IOException e) {
            System.out.println("[GOOGLE MAPS SERVICE]: Error when attempting to make reverse geocode request for lat/lon: (" + lat + ", " + lon + ")");
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Get a set of coordinates along with city and state from the specified address using Google Maps
     *
     * @param address - String for the address to geocode
     * @return AddressBundle - Bundle including Google Maps Geometry containing the location data for the address
     */
    public AddressBundle getCoordinatesFromAddress(String address) {
        if (StringHelper.isNullOrEmpty(address)) {
            return null;
        }

        try {
            GeoApiContext context = this.buildGeoApiContext();
            if (context != null) {
                System.out.println("[GOOGLE MAPS SERVICE]: Making geocode request for address: " + address);
                GeocodingResult[] results = GeocodingApi.geocode(context, address)
                        .await();
                if (results.length > 0) {
                    return this.buildBundle(results[0]);
                }
            }
        } catch (ApiException | InterruptedException | IOException e) {
            System.out.println("[GOOGLE MAPS SERVICE]: Error when attempting to make geocode request for address: " + address);
            e.printStackTrace();
        }

        return null;
    }

    /**
     * Takes a GeocodingResult and parses it for address, city, state, and geometry data, then packages it in
     * an AddressBundle
     *
     * @param result - GeocodingResult from a Google Maps Geocoding or Reverse-Geocoding request
     * @return AddressBundle - The bundle of address, geometry, city, and state data
     */
    private AddressBundle buildBundle(GeocodingResult result) {
        AddressBundle bundle = new AddressBundle();
        String country = null;
        for (AddressComponent component : result.addressComponents) {
            for (AddressComponentType type : component.types) {
                switch (type) {
                    case LOCALITY:
                        bundle.city = component.longName;
                        break;
                    case ADMINISTRATIVE_AREA_LEVEL_1:
                        bundle.state = component.shortName;
                        break;
                    case COUNTRY:
                        country = component.shortName;
                        break;
                }
            }
        }
        /* US Territories are usually listed as countries, with some strange edge cases, like
           San Juan, Puerto Rico where the administrative_area_level_1 is San Juan, not Puerto Rico.
           For Guam, there is no administrative_area_level_1, and Guam is the country
           This is kind of a catch all attempt to get a 2 letter state code
         */
        if ((bundle.state == null || bundle.state.length() != 2) && country != null && country.length() == 2) {
            bundle.state = country;
        }
        /* If there was no 2 letter state code, we could end up with something longer like San Juan, so fallback to
           leaving the field blank if it's not 2 letters long
         */
        if (bundle.state != null && bundle.state.length() != 2) {
            bundle.state = null;
        }

        bundle.address = result.formattedAddress;
        bundle.geometry = result.geometry;
        return bundle;
    }

    /**
     * Helper function to build a Google Maps GeoApiContext
     * Returns null if the GOOGLE_API_KEY is equal to "default"
     *
     * @return GeoApiContext - new GeoApiContext, null if the GOOGLE_API_KEY is "default"
     */
    private GeoApiContext buildGeoApiContext() {
        if (this.GOOGLE_API_KEY.equals("default")) {
            return null;
        }

        return new GeoApiContext.Builder()
                .apiKey(this.GOOGLE_API_KEY)
                .build();
    }

    public static class AddressBundle {
        public String address;
        public String city;
        public String state;
        public Geometry geometry;
    }
}
