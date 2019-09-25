package com.monumental.services;

import com.monumental.models.MandM;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class MandMService extends ModelService<MandM> {

    @PostConstruct
    public void init() {
        this.setClass(MandM.class);
    }

    // Add MandM specific database operations here if needed
}
