package com.monumental.config;

import com.bedatadriven.jackson.datatype.jts.JtsModule;
import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.datatype.hibernate5.Hibernate5Module;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Class used to configure Beans for the application
 */
@Configuration
@EnableAsync
@EnableJpaAuditing
@EnableTransactionManagement
public class AppConfig {

    // This is an environment variable that should be set to the public domain name of the server
    // By default this uses the localhost setup, on the VM it should be set to the actual public server domain name
    // For localhost, it uses the react dev server url. If you are not using the react dev server you must override
    // this value to be http://localhost:8080
    @Value("${PUBLIC_URL:http://localhost:3000}")
    public String publicUrl;

    @Bean
    public ResourceBundleMessageSource resourceBundleMessageSource() {
        ResourceBundleMessageSource source = new ResourceBundleMessageSource();
        source.setBasenames("messages/resource", "messages/email");
        source.setUseCodeAsDefaultMessage(true);

        return source;
    }

    /**
     * This is necessary to make "JsonInclude(JsonInclude.Include.NON_NULL)" work on proxied Hibernate collections
     * In other words, it enables you to place that annotation on lazy loaded collections.
     * If the collection has been loaded, it will be included in JSON outputs
     * If the collection has not been loaded, it will not be included in JSON outputs and you will NOT
     * get an exception for attempting to reference a proxied collection, which you normally would
     */
    @Bean
    public Module datatypeHibernateModule() {
        return new Hibernate5Module();
    }

    /**
     * This Bean is required so that the JSON deserializer knows how to deserialize GeoJson since it does not
     * know how to by default
     */
    @Bean
    public JtsModule jtsModule() {
        return new JtsModule();
    }
}
