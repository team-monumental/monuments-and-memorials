package com.monumental.models.api;

import java.util.List;

/**
 * Model class for an API request to create a Monument object
 * Contains any attributes that can be specified via an API request to create a new Monument
 */
public class CreateMonumentRequest {

    private String title;

    private String address;

    private Double latitude;

    private Double longitude;

    private String year;

    private String month;

    private String date;

    private String artist;

    private List<String> references;

    private List<String> materials;

    private List<String> newMaterials;

    private List<String> tags;

    private List<String> newTags;

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAddress() {
        return this.address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getLatitude() {
        return this.latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return this.longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getYear() {
        return this.year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getMonth() {
        return this.month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getDate() {
        return this.date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getArtist() {
        return this.artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public List<String> getReferences() {
        return this.references;
    }

    public void setReferences(List<String> references) {
        this.references = references;
    }

    public List<String> getMaterials() {
        return this.materials;
    }

    public void setMaterials(List<String> materials) {
        this.materials = materials;
    }

    public List<String> getNewMaterials() {
        return this.newMaterials;
    }

    public void setNewMaterials(List<String> newMaterials) {
        this.newMaterials = newMaterials;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<String> getNewTags() {
        return this.newTags;
    }

    public void setNewTags(List<String> newTags) {
        this.newTags = newTags;
    }
}