package com.monumental.controllers.helpers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.monumental.services.MonumentService;
import com.monumental.util.csvparsing.ZipFileHelper;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipFile;

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

    public static class ParseResult {
        public String csvFileName;
        public List<String[]> csvContents;
        public Map<String, String> mapping;
        public ZipFile zipFile;
    }

    @SuppressWarnings("unchecked")
    public ParseResult parse(MonumentService monumentService) throws IOException {
        String json = new String(this.getMapping().getBytes());
        ObjectMapper mapper = new ObjectMapper();

        ParseResult result = new ParseResult();

        result.mapping = mapper.readValue(json, Map.class);

        if (this.getZip() != null) {
            result.zipFile = ZipFileHelper.convertMultipartFileToZipFile(this.getZip());
            result.csvContents = monumentService.readCSVFromZip(result.zipFile);
        } else {
            result.csvContents = monumentService.readCSV(this.getCsv());
        }

        if (this.getCsv() != null) {
            result.csvFileName = this.getCsv().getOriginalFilename();
        }

        return result;
    }

}
