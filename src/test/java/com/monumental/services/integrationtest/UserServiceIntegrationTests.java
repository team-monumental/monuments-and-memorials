package com.monumental.services.integrationtest;

import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.User;
import com.monumental.repositories.UserRepository;
import com.monumental.security.Role;
import com.monumental.services.UserService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
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
import java.util.Arrays;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration
@TestExecutionListeners(listeners={ServletTestExecutionListener.class,
        DependencyInjectionTestExecutionListener.class,
        DirtiesContextTestExecutionListener.class,
        TransactionalTestExecutionListener.class,
        WithSecurityContextTestExecutionListener.class})
@SpringBootTest
public class UserServiceIntegrationTests {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    public static final String RESEARCHER = "researcher@monuments.us.org";
    public static final String PARTNER = "partner@monuments.us.org";
    public static final String COLLABORATOR = "collaborator@monuments.us.org";
    public static final User researcher = new User();
    public static final User partner = new User();
    public static final User collaborator = new User();
    public static final String password = "password";

    // This uses @PostConstruct instead of @Before so that it runs before the @WithUserDetails annotations do
    // See this answer: https://stackoverflow.com/a/56803892/10044594
    @PostConstruct
    public void setup() {
        createUsers(this.userRepository);
    }

    public static void createUsers(UserRepository userRepository) {
        researcher.setEmail(RESEARCHER);
        researcher.setRole(Role.RESEARCHER);

        partner.setEmail(PARTNER);
        partner.setRole(Role.PARTNER);

        collaborator.setEmail(COLLABORATOR);
        collaborator.setRole(Role.COLLABORATOR);

        for (User user : Arrays.asList(researcher, partner, collaborator)) {
            user.setFirstName("Test");
            user.setLastName("Test");
            user.setPassword(password);
            userRepository.save(user);
        }
    }

    @Test
    @WithUserDetails(RESEARCHER)
    public void getCurrentUser_researcher() {
        try {
            User user = this.userService.getCurrentUser();
            assertEquals(RESEARCHER, user.getEmail());
            assertEquals(Role.RESEARCHER, user.getRole());
        } catch (UnauthorizedException e) {
            fail("User should be logged in.");
        }
    }

    @Test
    @WithUserDetails(PARTNER)
    public void getCurrentUser_partner() {
        try {
            User user = this.userService.getCurrentUser();
            assertEquals(PARTNER, user.getEmail());
            assertEquals(Role.PARTNER, user.getRole());
        } catch (UnauthorizedException e) {
            fail("User should be logged in.");
        }
    }

    @Test
    @WithUserDetails(COLLABORATOR)
    public void getCurrentUser_collaborator() {
        try {
            User user = this.userService.getCurrentUser();
            assertEquals(COLLABORATOR, user.getEmail());
            assertEquals(Role.COLLABORATOR, user.getRole());
        } catch (UnauthorizedException e) {
            fail("User should be logged in.");
        }
    }
}
