package com.restaurant.backend.service;

import org.springframework.stereotype.Service;

@Service
public class SmsService {

    public void sendSms(String to, String message) {
        // Simulation of SMS sending (Dummy Implementation)
        System.out.println("=================================================");
        System.out.println("DEBUG: SMS SENT (SIMULATION - TWILIO REMOVED)");
        System.out.println("TO: " + to);
        System.out.println("MESSAGE: " + message);
        System.out.println("=================================================");
    }
}
