package com.monumental.controllers;

import com.monumental.models.Monument;
import com.monumental.repositories.MonumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.redfin.sitemapgenerator.WebSitemapGenerator;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.Writer;

import static org.springframework.http.MediaType.APPLICATION_XML_VALUE;

@RestController
public class SitemapController {

    @Value("${PUBLIC_URL:http://localhost:3000}")
    private String publicUrl;

    @Autowired
    private MonumentRepository monumentRepository;

    /**
     * Generates an XML Sitemap for Google to index the site
     */
    @RequestMapping(path = "/sitemap.xml", produces = APPLICATION_XML_VALUE)
    public void getSitemap(HttpServletResponse response) throws IOException {
        response.setContentType(APPLICATION_XML_VALUE);

        WebSitemapGenerator sitemap = new WebSitemapGenerator(this.publicUrl);

        sitemap.addUrls(
            this.publicUrl + "/",
            this.publicUrl + "/about",
            this.publicUrl + "/map",
            this.publicUrl + "/create",
            this.publicUrl + "/search"
        );

        for (Monument monument : this.monumentRepository.findAllByIsActive(true)) {
            sitemap.addUrl(this.publicUrl + "/monuments/" + monument.getId());
        }

        try (Writer writer = response.getWriter()) {
            writer.append(String.join("", sitemap.writeAsStrings()));
        }
    }
}
