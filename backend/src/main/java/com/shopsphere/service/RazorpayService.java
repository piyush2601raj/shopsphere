package com.shopsphere.service;

import com.razorpay.RazorpayException;
import org.json.JSONObject;

public interface RazorpayService {

    JSONObject createOrder(double amount) throws RazorpayException;

    boolean verifyPayment(String orderId,
                          String paymentId,
                          String signature);
}