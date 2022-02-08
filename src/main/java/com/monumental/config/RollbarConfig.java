package com.monumental.config;

import com.rollbar.notifier.Rollbar;
import com.rollbar.notifier.config.Config;
import com.rollbar.spring.webmvc.RollbarSpringConfigBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan({
        "com.monumental.config",
        "com.rollbar.spring"
})
public class RollbarConfig {

    @Value("${ROLLBAR_SERVER_KEY:111}")
    private String rollbarServerKey;

    @Value("${ROLLBAR_ENV:development}")
    private String rollbarEnv;

    /**
     * Register a Rollbar bean to configure App with Rollbar.
     */
    @Bean
    public Rollbar rollbar() {

        // Need to set this environment variable
        return new Rollbar(getRollbarConfigs(rollbarServerKey));
    }

    private Config getRollbarConfigs(String accessToken) {

        // Reference ConfigBuilder.java for all the properties you can set for Rollbar
        return RollbarSpringConfigBuilder.withAccessToken(accessToken)
                .environment(rollbarEnv)
                .build();
    }
}
