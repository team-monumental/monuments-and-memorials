package com.monumental.controllers.helpers;

import org.springframework.web.multipart.MultipartFile;

public class BulkCreateMonumentRequest {

    private MultipartFile zip;
    private MultipartFile csv;
    private MultipartFile mapping;

    public MultipartFile getZip() {
        return this.zip;
    }

    public void setZip(MultipartFile zip) {
        this.zip = zip;
    }

    public MultipartFile getCsv() {
        return this.csv;
    }

    public void setCsv(MultipartFile csv) {
        this.csv = csv;
    }

    public MultipartFile getMapping() {
        return this.mapping;
    }

    public void setMapping(MultipartFile mapping) {
        this.mapping = mapping;
    }
}
