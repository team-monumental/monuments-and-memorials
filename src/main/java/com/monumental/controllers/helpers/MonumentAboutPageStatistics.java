package com.monumental.controllers.helpers;

import com.monumental.models.Monument;

import java.util.HashMap;

/**
 * Helper class that holds statistics about the Monuments in the system for the About Page
 */
public class MonumentAboutPageStatistics {

    private int totalNumberOfMonuments;

    private String randomState;

    private int numberOfMonumentsInRandomState;

    private String randomTagName;

    private int numberOfMonumentsWithRandomTag;

    private Monument oldestMonument;

    private Monument newestMonument;

    private HashMap<String, Integer> numberOfMonumentsByState;

    private Integer nineElevenMemorialId;

    private Integer vietnamVeteransMemorialId;

    public int getTotalNumberOfMonuments() {
        return this.totalNumberOfMonuments;
    }

    public void setTotalNumberOfMonuments(int totalNumberOfMonuments) {
        this.totalNumberOfMonuments = totalNumberOfMonuments;
    }

    public String getRandomState() {
        return this.randomState;
    }

    public void setRandomState(String randomState) {
        this.randomState = randomState;
    }

    public int getNumberOfMonumentsInRandomState() {
        return this.numberOfMonumentsInRandomState;
    }

    public void setNumberOfMonumentsInRandomState(int numberOfMonumentsInRandomState) {
        this.numberOfMonumentsInRandomState = numberOfMonumentsInRandomState;
    }

    public String getRandomTagName() {
        return this.randomTagName;
    }

    public void setRandomTagName(String randomTagName) {
        this.randomTagName = randomTagName;
    }

    public int getNumberOfMonumentsWithRandomTag() {
        return this.numberOfMonumentsWithRandomTag;
    }

    public void setNumberOfMonumentsWithRandomTag(int numberOfMonumentsWithRandomTag) {
        this.numberOfMonumentsWithRandomTag = numberOfMonumentsWithRandomTag;
    }

    public Monument getOldestMonument() {
        return this.oldestMonument;
    }

    public void setOldestMonument(Monument oldestMonument) {
        this.oldestMonument = oldestMonument;
    }

    public Monument getNewestMonument() {
        return this.newestMonument;
    }

    public void setNewestMonument(Monument newestMonument) {
        this.newestMonument = newestMonument;
    }

    public HashMap<String, Integer> getNumberOfMonumentsByState() {
        return this.numberOfMonumentsByState;
    }

    public void setNumberOfMonumentsByState(HashMap<String, Integer> numberOfMonumentsByState) {
        this.numberOfMonumentsByState = numberOfMonumentsByState;
    }

    public Integer getNineElevenMemorialId() {
        return this.nineElevenMemorialId;
    }

    public void setNineElevenMemorialId(Integer nineElevenMemorialId) {
        this.nineElevenMemorialId = nineElevenMemorialId;
    }

    public Integer getVietnamVeteransMemorialId() {
        return this.vietnamVeteransMemorialId;
    }

    public void setVietnamVeteransMemorialId(Integer vietnamVeteransMemorialId) {
        this.vietnamVeteransMemorialId = vietnamVeteransMemorialId;
    }
}
