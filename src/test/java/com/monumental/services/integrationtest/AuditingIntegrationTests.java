package com.monumental.services.integrationtest;

import com.monumental.controllers.helpers.CreateMonumentRequest;
import com.monumental.controllers.helpers.UpdateMonumentRequest;
import com.monumental.models.Monument;
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

import static org.junit.Assert.*;
import static com.monumental.services.integrationtest.UserServiceIntegrationTests.*;

/**
 * This is a unique integration test, not specifically linked to any service, but it uses MonumentService as a concrete
 * implementation of ModelService in order to test the auditing features of Model
 */
@RunWith(SpringJUnit4ClassRunner.class)
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
        CreateMonumentRequest request = new CreateMonumentRequest();
        request.setTitle("Title");
        return this.monumentService.createMonument(request);
    }

    private Monument updateMonument(Monument monument) {
        UpdateMonumentRequest request = new UpdateMonumentRequest();
        request.setNewTitle("New Title");
        return this.monumentService.updateMonument(monument.getId(), request);
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