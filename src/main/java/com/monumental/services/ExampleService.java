package com.monumental.services;

import com.monumental.models.Example;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class ExampleService extends ModelService<Example> {

    @PostConstruct
    public void init() {
        this.setClass(Example.class);
    }
}
