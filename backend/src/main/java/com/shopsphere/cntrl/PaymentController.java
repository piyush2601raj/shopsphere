package com.shopsphere.cntrl;

import com.shopsphere.dto.PaymentResponseDto;
import com.shopsphere.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    // 💳 CREATE PAYMENT
    @PostMapping("/create/{orderId}")
    public ResponseEntity<Map<String, Object>> createPayment(
            @PathVariable Long orderId,
            @RequestParam String method) {

        PaymentResponseDto payment = service.createPayment(orderId, method);
        return buildResponse("Payment created successfully", payment);
    }

    // 🔄 UPDATE STATUS
    @PutMapping("/status/{paymentId}")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long paymentId,
            @RequestParam String status) {

        PaymentResponseDto payment = service.updatePaymentStatus(paymentId, status);
        return buildResponse("Payment status updated successfully", payment);
    }

    // 📄 GET ALL
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPayments() {
        return buildResponse("All payments fetched successfully",
                service.getAllPayments());
    }

    // 🔍 GET BY ID
    @GetMapping("/{paymentId}")
    public ResponseEntity<Map<String, Object>> getPaymentById(
            @PathVariable Long paymentId) {

        return buildResponse("Payment fetched successfully",
                service.getPaymentById(paymentId));
    }

    // 👤 USER HISTORY
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getPaymentsByUser(
            @PathVariable Long userId) {

        return buildResponse("User payment history fetched successfully",
                service.getPaymentsByUser(userId));
    }

    // 🔁 REFUND PAYMENT
    @PostMapping("/refund/{paymentId}")
    public ResponseEntity<Map<String, Object>> refundPayment(
            @PathVariable Long paymentId) {

        return buildResponse(
                service.refundPayment(paymentId),
                null
        );
    }

    // 📊 ADMIN STATS
    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Object>> getStats() {

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalRevenue", service.getTotalRevenue());
        stats.put("totalPayments", service.getTotalPayments());

        return buildResponse("Admin stats fetched successfully", stats);
    }

    // 🔥 COMMON RESPONSE
    private ResponseEntity<Map<String, Object>> buildResponse(String message, Object data) {
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("status", 200);
        res.put("message", message);
        res.put("data", data);
        return ResponseEntity.ok(res);
    }
}