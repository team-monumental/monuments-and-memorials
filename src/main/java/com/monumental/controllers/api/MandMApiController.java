package com.monumental.controllers.api;

import com.monumental.models.Monument;
import com.monumental.services.MonumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;

@Controller
public class MandMApiController {

    @Autowired
    private MonumentService mandmService;

    @GetMapping("/api/mandm")
    @ResponseBody
    public String createNewMandM() {
        Date date = new Date();
        Monument mandm = new Monument("submittedBy", "artist", "title", date, "material", 10.0, -12.0, "city", "state");

        this.mandmService.insert(mandm);

        return "Added new mandm: " + mandm.toString();
    }

    @GetMapping("/api/mandms/{id}")
    @ResponseBody
    public Monument getMandM(@PathVariable("id") Integer id) {
        return this.mandmService.get(id);
    }
}
