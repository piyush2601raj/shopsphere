package com.shopsphere.cntrl;

import com.shopsphere.service.RazorpayService;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import com.razorpay.RazorpayException;

@RestController
@RequestMapping("/payments")
public class RazorpayController {

    private final RazorpayService service;

    public RazorpayController(RazorpayService service) {
        this.service = service;
    }

    // 💳 CREATE ORDER (POST - REAL API)
    @PostMapping("/create-order")
    public Map<String, Object> createOrder(@RequestBody Map<String, Object> req) throws Exception {

        double amount = Double.parseDouble(req.get("amount").toString());

        JSONObject order = service.createOrder(amount);
    
        return order.toMap();
    }
    // 🧪 TEST API (BROWSER ME JSON DEKHNE KE LIYE)
    @GetMapping("/test-order")
    public Map<String, Object> testOrder() throws RazorpayException{

    	JSONObject order = service.createOrder(500);

    	return order.toMap();
    }

    // 🔐 VERIFY PAYMENT
    @PostMapping("/verify")
    public Map<String, Object> verify(@RequestBody Map<String, String> req) {

        boolean result = service.verifyPayment(
                req.get("orderId"),
                req.get("paymentId"),
                req.get("signature")
        );

        return Map.of(
                "status", result ? "SUCCESS" : "FAILED",
                "message", result ? "Payment verified successfully" : "Invalid signature"
        );
    }
}