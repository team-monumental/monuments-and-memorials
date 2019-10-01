package com.monumental.services;

import com.monumental.models.Monument;
import org.springframework.stereotype.Service;

@Service
public class MonumentService extends ModelService<Monument> {

    /**
     * Public constructor for MonumentService
     * Use when NOT injecting SessionFactoryService via Spring
     * @param sessionFactoryService - instance of SessionFactoryService to use for initialization
     */
    public MonumentService(SessionFactoryService sessionFactoryService) {
        this.sessionFactoryService = sessionFactoryService;
    }

    /**
     * Public default constructor for MonumentService
     */
    public MonumentService() {

    }

    // Add Monument specific database operations here if needed
}
