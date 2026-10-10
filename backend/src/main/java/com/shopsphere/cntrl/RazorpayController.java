package com.shopsphere.cntrl;

import com.shopsphere.service.RazorpayService;

import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.razorpay.RazorpayException;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/payments")
public class RazorpayController {

    private final RazorpayService service;

    public RazorpayController(RazorpayService service) {
        this.service = service;
    }

    // ==========================================
    // CREATE RAZORPAY ORDER
    // ==========================================
    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(
            @RequestBody Map<String, Object> req) throws Exception {

        if (req == null || req.get("amount") == null) {
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("status", "FAILED");
            response.put("message", "Amount is required");

            return ResponseEntity.badRequest().body(response);
        }

        double amount;

        try {
            amount = Double.parseDouble(
                    req.get("amount").toString()
            );
        } catch (NumberFormatException e) {
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("status", "FAILED");
            response.put("message", "Invalid amount");

            return ResponseEntity.badRequest().body(response);
        }

        if (!Double.isFinite(amount) || amount <= 0) {
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("status", "FAILED");
            response.put("message", "Amount must be greater than zero");

            return ResponseEntity.badRequest().body(response);
        }

        JSONObject order = service.createOrder(amount);

        return ResponseEntity.ok(order.toMap());
    }

    // ==========================================
    // TEST ORDER
    // ==========================================
    @GetMapping("/test-order")
    public ResponseEntity<Map<String, Object>> testOrder()
            throws RazorpayException {

        JSONObject order = service.createOrder(500);

        return ResponseEntity.ok(order.toMap());
    }

    // ==========================================
    // VERIFY RAZORPAY PAYMENT SIGNATURE
    // ==========================================
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verify(
            @RequestBody Map<String, String> req) {

        Map<String, Object> response = new LinkedHashMap<>();

        if (req == null
                || isBlank(req.get("orderId"))
                || isBlank(req.get("paymentId"))
                || isBlank(req.get("signature"))) {

            response.put("status", "FAILED");
            response.put("message", "Missing payment verification details");

            return ResponseEntity.badRequest().body(response);
        }

        try {
            boolean verified = service.verifyPayment(
                    req.get("orderId"),
                    req.get("paymentId"),
                    req.get("signature")
            );

            if (!verified) {
                response.put("status", "FAILED");
                response.put("message", "Invalid payment signature");

                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(response);
            }

            /*
             * Razorpay signature verified successfully.
             *
             * IMPORTANT:
             * This confirms the signature only.
             * Your current RazorpayService interface does not expose
             * a method to update the associated database Payment record.
             *
             * Therefore, do not claim that the database Payment and Order
             * statuses have been updated here.
             */

            response.put("status", "SUCCESS");
            response.put("message", "Payment signature verified successfully");
            response.put("razorpayOrderId", req.get("orderId"));
            response.put("razorpayPaymentId", req.get("paymentId"));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "FAILED");
            response.put("message", "Payment verification failed");

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }
    }

    // ==========================================
    // VALIDATE EMPTY VALUES
    // ==========================================
    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}