package com.shopsphere.service.impl;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.shopsphere.service.RazorpayService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.razorpay.RazorpayException;

@Service
public class RazorpayServiceImpl implements RazorpayService {

    private final RazorpayClient razorpayClient;
    private final String keySecret;

    public RazorpayServiceImpl(RazorpayClient razorpayClient,
                               @Value("${razorpay.key_secret}") String keySecret) {
        this.razorpayClient = razorpayClient;
        this.keySecret = keySecret;
    }

    // CREATE ORDER
    @Override
    
    public JSONObject createOrder(double amount) throws RazorpayException {

        JSONObject orderReq = new JSONObject();

        // Convert rupees → paise (Razorpay requirement)
        int amountInPaise = (int) Math.round(amount * 100);

        orderReq.put("amount", amountInPaise);
        orderReq.put("currency", "INR");
        orderReq.put("payment_capture", 1);
        orderReq.put("receipt","ORDER_"+System.currentTimeMillis());

        Order order = razorpayClient.orders.create(orderReq);

        return order.toJson();
    }

    // VERIFY PAYMENT
    @Override
    public boolean verifyPayment(String orderId, String paymentId, String signature) {

        try {
            String payload = orderId + "|" + paymentId;

            // Razorpay signature verification
            return Utils.verifySignature(payload, signature, keySecret);

        } catch (Exception e) {
            System.out.println("Payment verification failed: " + e.getMessage());
            return false;
        }
    }
}