package com.monumental.config;

import com.rollbar.notifier.Rollbar;
import com.rollbar.notifier.config.Config;
import com.rollbar.spring.webmvc.RollbarSpringConfigBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;


@Configuration()
@EnableWebMvc
@ComponentScan({

// UPDATE TO YOUR PROJECT PACKAGE
        "com.monumental.config",
        "com.rollbar.spring"

})
public class RollbarConfig {

    /**
     * Register a Rollbar bean to configure App with Rollbar.
     */
    @Bean
    public Rollbar rollbar() {

        // Your ACCESS TOKEN is: 19851651490648898dcdb32aa21d2a78
        // Make sure to keep this secure
        return new Rollbar(getRollbarConfigs("19851651490648898dcdb32aa21d2a78"));
    }

    private Config getRollbarConfigs(String accessToken) {

        // Reference ConfigBuilder.java for all the properties you can set for Rollbar
        return RollbarSpringConfigBuilder.withAccessToken(accessToken)
                .environment("development")
                .build();
    }
}
