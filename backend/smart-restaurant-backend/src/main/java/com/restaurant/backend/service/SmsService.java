package com.restaurant.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;

@Service
public class SmsService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String fromPhoneNumber;

    @PostConstruct
    public void init() {
        if (accountSid != null && !accountSid.isBlank() &&
                authToken != null && !authToken.isBlank()) {
            Twilio.init(accountSid, authToken);
        }
    }

    public void sendSms(String to, String message) {
        if (accountSid != null && !accountSid.isBlank() &&
                authToken != null && !authToken.isBlank() &&
                fromPhoneNumber != null && !fromPhoneNumber.isBlank()) {

            try {
                // Ensure proper formatting for international numbers if needed (e.g. +91)
                // For now assuming 'to' is passed correctly or adding + if missing
                String formattedTo = to.startsWith("+") ? to : "+91" + to; // Default to India if no code

                Message.creator(
                        new PhoneNumber(formattedTo),
                        new PhoneNumber(fromPhoneNumber),
                        message).create();

                System.out.println("Twilio SMS sent to " + to);
                return;
            } catch (Exception e) {
                System.err.println("Error sending Twilio SMS: " + e.getMessage());
                // Fallback to console
            }
        }

        // Simulation of SMS sending (Fallback)
        System.out.println("=================================================");
        System.out.println("DEBUG: SMS SENT (SIMULATION)");
        System.out.println("TO: " + to);
        System.out.println("MESSAGE: " + message);
        System.out.println("=================================================");
    }
}
