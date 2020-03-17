package com.monumental.services.integrationtest;

import com.monumental.models.Monument;
import com.monumental.models.User;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.models.suggestions.UpdateMonumentSuggestion;
import com.monumental.repositories.UserRepository;
import com.monumental.security.UserAwareUserDetails;
import com.monumental.services.MonumentService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextTestExecutionListener;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import org.springframework.test.context.web.ServletTestExecutionListener;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;

import java.util.Date;
import java.util.List;

import static org.junit.Assert.*;
import static com.monumental.services.integrationtest.UserServiceIntegrationTests.*;

/**
 * This is a unique integration test, not specifically linked to any service, but it uses MonumentService as a concrete
 * implementation of ModelService in order to test the auditing features of Model
 */
@RunWith(SpringJUnit4ClassRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@ContextConfiguration
@TestExecutionListeners(listeners={ServletTestExecutionListener.class,
        DependencyInjectionTestExecutionListener.class,
        DirtiesContextTestExecutionListener.class,
        TransactionalTestExecutionListener.class,
        WithSecurityContextTestExecutionListener.class})
@SpringBootTest
@Transactional
public class AuditingIntegrationTests {

    @Autowired
    private MonumentService monumentService;

    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    public void setup() {
        createUsers(this.userRepository);
    }

    private Monument createMonument() {
        CreateMonumentSuggestion suggestion = new CreateMonumentSuggestion();
        suggestion.setTitle("Title");
        return this.monumentService.createMonument(suggestion);
    }

    private Monument updateMonument(Monument monument) {
        UpdateMonumentSuggestion suggestion = new UpdateMonumentSuggestion();
        suggestion.setMonument(monument);
        suggestion.setNewTitle("New Title");
        return this.monumentService.updateMonument(suggestion);
    }

    @Test
    @WithUserDetails(RESEARCHER)
    public void createMonument_correctCreatedDate() {
        Monument monument = createMonument();
        assertNotNull(monument.getCreatedDate());
        // Check that the timestamp is close enough - this is a 1m window, should not cause any transient errors
        assertTrue(new Date().getTime() - monument.getCreatedDate().getTime() < 60000);
    }

    @Test
    @WithUserDetails(RESEARCHER)
    public void createMonument_correctCreatedBy() {
        Monument monument = createMonument();
        assertNotNull(monument.getCreatedBy());
        assertEquals(RESEARCHER, monument.getCreatedBy().getEmail());
        assertEquals(RESEARCHER, monument.getLastModifiedBy().getEmail());
    }

    @Test
    @WithUserDetails(RESEARCHER)
    public void updateMonument_correctLastModifiedDate() {
        Monument monument = createMonument();
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                new UserAwareUserDetails(partner), password
        ));
        List<User> users = this.userRepository.findAll();
        monument = updateMonument(monument);
        assertNotNull(monument.getLastModifiedDate());
        assertTrue(monument.getLastModifiedDate().getTime() > monument.getCreatedDate().getTime());
    }

    @Test
    @WithUserDetails(RESEARCHER)
    public void updateMonument_correctLastModifiedBy() {
        Monument monument = createMonument();
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
            new UserAwareUserDetails(partner), password
        ));
        monument = updateMonument(monument);
        assertNotNull(monument.getLastModifiedBy());
        assertEquals(PARTNER, monument.getLastModifiedBy().getEmail());
        assertEquals(RESEARCHER, monument.getCreatedBy().getEmail());
    }
}
