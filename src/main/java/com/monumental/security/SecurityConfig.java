package com.monumental.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.IOException;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private UserDetailServiceImpl userDetailService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // We permit ALL routes (except some API routes) because authentication needs to be checked by
        // react router, NOT by spring security, since you can navigate to pages through the SPA
        http.authorizeRequests()
            .antMatchers("/", "/public/*", "/build/*", "/api/signup", "/api/login").permitAll()
            .antMatchers("/api/*").authenticated()
            .and()
            .formLogin()
            .loginPage("/api/login")
            .successHandler(new AuthenticationSuccessHandler() {
                @Override
                public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
                    // Don't redirect, react can do it
                }
            })
            .permitAll()
            .and()
            .httpBasic()
            .and()
            .csrf().disable()
            .logout()
            .logoutUrl("/api/logout")
            .logoutSuccessUrl("/")
            .invalidateHttpSession(true)
            .deleteCookies("JSESSIONID");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(this.userDetailService)
            .and()
            .jdbcAuthentication()
            .dataSource(this.dataSource)
            .passwordEncoder(passwordEncoder());
//            .usersByUsernameQuery("select email as username, password, is_enabled as enabled"
//                    + " from \"user\" where email=?")
//            .authoritiesByUsernameQuery("select email as username, role"
//                    + "from \"user\" where email=?");
    }
}
