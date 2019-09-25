package com.monumental.services;

import com.monumental.models.Monument;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class MonumentService extends ModelService<Monument> {

    @PostConstruct
    public void init() {
        this.setClass(Monument.class);
    }

    // Add Monument specific database operations here if needed
}
