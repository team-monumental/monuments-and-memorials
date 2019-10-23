package com.monumental.config;

import com.fasterxml.jackson.datatype.hibernate5.Hibernate5Module;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ResourceBundleMessageSource;
import com.fasterxml.jackson.databind.Module;

/**
 * Class used to configure Beans for the application
 */
@Configuration
public class AppConfig {

    @Bean
    public ResourceBundleMessageSource messageSource() {
        ResourceBundleMessageSource source = new ResourceBundleMessageSource();
        source.setBasenames("messages/resource");
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
}
