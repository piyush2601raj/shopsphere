package com.shopsphere.config;

import com.razorpay.RazorpayClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RazorpayConfig {

    @Value("${razorpay.key_id}")
    private String keyId;

    @Value("${razorpay.key_secret}")
    private String keySecret;

    @Bean
    public RazorpayClient razorpayClient() throws Exception {

        // Validate Razorpay credentials configuration
        if (keyId == null || keyId.isBlank()) {
            throw new IllegalStateException(
                "Razorpay Key ID is missing. Check RAZORPAY_KEY_ID in Railway."
            );
        }

        if (keySecret == null || keySecret.isBlank()) {
            throw new IllegalStateException(
                "Razorpay Secret is missing. Check RAZORPAY_KEY_SECRET in Railway."
            );
        }

        // Safe diagnostic logging: never print the actual secret
        String keyIdPrefix =
            keyId.substring(0, Math.min(12, keyId.length()));

        System.out.println(
            "[Razorpay Config] Key ID prefix: " + keyIdPrefix
        );

        System.out.println(
            "[Razorpay Config] Secret configured: true"
        );

        // Initialize Razorpay client
        return new RazorpayClient(keyId, keySecret);
    }
}