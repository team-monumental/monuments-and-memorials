package com.monumental.services;

import com.monumental.config.AppConfig;
import com.monumental.models.User;
import com.monumental.models.VerificationToken;
import com.monumental.models.suggestions.BulkCreateMonumentSuggestion;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.models.suggestions.UpdateMonumentSuggestion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class EmailService {

    private final String suggestionApprovedEmailThankYou = "Thank you so much for your valuable work toward " +
            "documenting our nation's monuments + memorials!";

    private final String suggestionRejectedContact = "Please contact the Monuments + Memorial administrator if you " +
            "have any questions: contact@monuments.us.org.";

    @Autowired
    @Qualifier("resourceBundleMessageSource")
    private MessageSource messages;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private AppConfig appConfig;

    @Value("${OUTBOUND_EMAIL_ADDRESS:noreply@monuments.us.org}")
    private String outboundEmailAddress;

    @Value("${spring.mail.username:#{null}}")
    private String springMailUsername;

    /**
     * Sends an email to the specified address using the stored email template name
     * TODO: Replace with HTML email templates with proper templating where user data can be filled in automatically
     *
     * @param recipientAddress - The email address to send to
     * @param templateName     - The email template name
     */
    public void sendEmail(String recipientAddress, String templateName) {
        this.sendEmail(recipientAddress, templateName, "");
    }

    /**
     * Sends an email to the specified address using the stored email template name, adding the extraMessage onto the
     * end of the email template
     * TODO: This is a lazy way of not having to write email templating yet. Replace this with true templating
     *
     * @param recipientAddress - The email address to send to
     * @param templateName     - The email template name
     * @param extraMessage     - The extra content to add to the end of the template
     */
    public void sendEmail(String recipientAddress, String templateName, String extraMessage) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setFrom(this.outboundEmailAddress);
        email.setSubject(this.messages.getMessage(templateName + ".subject", null, Locale.getDefault()));
        email.setText(this.messages.getMessage(templateName + ".body", null, Locale.getDefault()) + extraMessage);

        if (this.springMailUsername == null || this.springMailUsername.equals("")) {
            System.out.println("WARNING: You have not provided mail credentials, so the following email will NOT be sent: " + email);
        } else {
            this.mailSender.send(email);
            System.out.println("Sent email " + templateName + " to " + recipientAddress);
        }
    }

    /**
     * Sent when a user requests to change their email address, and includes a link with a verification token
     * to verify that they own the new email address
     */
    public void sendEmailChangeVerificationEmail(User user, VerificationToken token) {
        this.sendEmail(
                user.getEmail(),
                "email-change.begin",
                "\n\n" + this.appConfig.publicUrl + "/account/update/confirm?token=" + token.getToken()
        );
    }

    /**
     * Sent upon signup and includes a link with a verification token to verify that the user owns the specified
     * email address
     */
    public void sendSignupVerificationEmail(User user, VerificationToken token) {
        this.sendEmail(
                user.getEmail(),
                "registration.success",
                "\n\n" + this.appConfig.publicUrl + "/signup/confirm?token=" + token.getToken()
        );
    }

    /**
     * Sent when a user requests to change their password, and includes a link with a verification token
     * to verify that they own their email address still
     */
    public void sendPasswordResetEmail(User user, VerificationToken token) {
        this.sendEmail(
                user.getEmail(),
                "password-reset.begin",
                "\n\n" + this.appConfig.publicUrl + "/password-reset/confirm?token=" + token.getToken()
        );
    }

    /**
     * Sent when a user successfully changes their password
     */
    public void sendPasswordResetCompleteEmail(User user) {
        this.sendEmail(user.getEmail(), "password-reset.success");
    }

    /**
     * Sent when a user has one of their CreateMonumentSuggestions approved
     */
    public void sendCreateSuggestionApprovalEmail(CreateMonumentSuggestion suggestion) {
        String extraMessage = suggestion.getTitle() + ". " + this.suggestionApprovedEmailThankYou;
        this.sendEmail(suggestion.getCreatedBy().getEmail(), "create-suggestion.approval", extraMessage);
    }

    /**
     * Sent when a user has one of their CreateMonumentSuggestions rejected
     */
    public void sendCreateSuggestionRejectionEmail(CreateMonumentSuggestion suggestion) {
        String extraMessage = suggestion.getTitle() + ". " + this.suggestionRejectedContact;
        this.sendEmail(suggestion.getCreatedBy().getEmail(), "create-suggestion.rejection", extraMessage);
    }

    /**
     * Sent when a user has one of their UpdateMonumentSuggestions approved
     */
    public void sendUpdateSuggestionApprovalEmail(UpdateMonumentSuggestion suggestion) {
        String extraMessage = suggestion.getMonument().getTitle() + ". " + this.suggestionApprovedEmailThankYou;
        this.sendEmail(suggestion.getCreatedBy().getEmail(), "update-suggestion.approval", extraMessage);
    }

    /**
     * Sent when a user has one of their UpdateMonumentSuggestions rejected
     */
    public void sendUpdateSuggestionRejectionEmail(UpdateMonumentSuggestion suggestion) {
        String extraMessage = suggestion.getMonument().getTitle() + ". " + this.suggestionRejectedContact;
        this.sendEmail(suggestion.getCreatedBy().getEmail(), "update-suggestion.rejection", extraMessage);
    }

    /**
     * Sent when a user has one of their BulkCreateMonumentSuggestions approved
     */
    public void sendBulkCreateSuggestionApprovalEmail(BulkCreateMonumentSuggestion suggestion) {
        if (suggestion.getCreatedBy() != null) {
            String extraMessage = suggestion.getFileName() + ". " + this.suggestionApprovedEmailThankYou;
            this.sendEmail(suggestion.getCreatedBy().getEmail(), "bulk-create-suggestion.approval", extraMessage);
        }
    }

    /**
     * Sent when a user has one of their BulkCreateMonumentSuggestions rejected
     */
    public void sendBulkCreateSuggestionRejectionEmail(BulkCreateMonumentSuggestion suggestion) {
        if (suggestion.getCreatedBy() != null) {
            String extraMessage = suggestion.getFileName() + ". " + this.suggestionRejectedContact;
            this.sendEmail(suggestion.getCreatedBy().getEmail(), "bulk-create-suggestion.rejection", extraMessage);
        }
    }
}
