package com.monumental.controllers.api;

import com.monumental.models.Monument;
import com.monumental.services.MonumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;

@Controller
public class MonumentApiController {

    @Autowired
    private MonumentService monumentService;

    @PostMapping("/api/monument")
    @ResponseBody
    public String createMonument() {
        Date date = new Date();
        Monument monument = new Monument("submittedBy", "artist", "title", date, "material", 10.0, -12.0, "city", "state");

        this.monumentService.insert(monument);

        return "Added new monument: " + monument.toString();
    }

    @GetMapping("/api/monument/{id}")
    @ResponseBody
    public Monument getMonument(@PathVariable("id") Integer id) {
        return this.monumentService.get(id);
    }
}
