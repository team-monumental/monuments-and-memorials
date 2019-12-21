package com.monumental.models.api;

import com.monumental.models.Monument;

/**
 * Model class that holds statistics about the Monuments in the system for the About Page
 */
public class MonumentAboutPageStatistics {

    private int totalNumberOfMonuments;

    private String randomState;

    private int numberOfMonumentsInRandomState;

    private String randomTagName;

    private int numberOfMonumentsWithRandomTag;

    private Monument oldestMonument;

    private Monument newestMonument;

    public int getTotalNumberOfMonuments() {
        return totalNumberOfMonuments;
    }

    public void setTotalNumberOfMonuments(int totalNumberOfMonuments) {
        this.totalNumberOfMonuments = totalNumberOfMonuments;
    }

    public String getRandomState() {
        return randomState;
    }

    public void setRandomState(String randomState) {
        this.randomState = randomState;
    }

    public int getNumberOfMonumentsInRandomState() {
        return numberOfMonumentsInRandomState;
    }

    public void setNumberOfMonumentsInRandomState(int numberOfMonumentsInRandomState) {
        this.numberOfMonumentsInRandomState = numberOfMonumentsInRandomState;
    }

    public String getRandomTagName() {
        return randomTagName;
    }

    public void setRandomTagName(String randomTagName) {
        this.randomTagName = randomTagName;
    }

    public int getNumberOfMonumentsWithRandomTag() {
        return numberOfMonumentsWithRandomTag;
    }

    public void setNumberOfMonumentsWithRandomTag(int numberOfMonumentsWithRandomTag) {
        this.numberOfMonumentsWithRandomTag = numberOfMonumentsWithRandomTag;
    }

    public Monument getOldestMonument() {
        return oldestMonument;
    }

    public void setOldestMonument(Monument oldestMonument) {
        this.oldestMonument = oldestMonument;
    }

    public Monument getNewestMonument() {
        return newestMonument;
    }

    public void setNewestMonument(Monument newestMonument) {
        this.newestMonument = newestMonument;
    }
}
