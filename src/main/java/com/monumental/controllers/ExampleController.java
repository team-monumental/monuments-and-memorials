package com.monumental.controllers;

import com.monumental.models.Example;
import com.monumental.services.ExampleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class ExampleController {

    @Autowired
    private ExampleService exampleService;

    @GetMapping("/api/example")
    @ResponseBody
    public Example getExample(Integer id) {
        return this.exampleService.get(id);
    }
}
