package com.monumental.services;

import com.monumental.models.Example;
import org.springframework.stereotype.Service;

@Service
public class ExampleService {

    public Example get(Integer id) {
        // It's a bit complex for this example - but we query for row(s) in the Example table here
        // For now just make up an Example
        return new Example();
    }
}
