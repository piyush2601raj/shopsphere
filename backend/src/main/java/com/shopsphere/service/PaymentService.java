package com.shopsphere.service;

import com.shopsphere.dto.PaymentResponseDto;

import java.util.List;

public interface PaymentService {

    PaymentResponseDto createPayment(Long orderId, String method);

    PaymentResponseDto updatePaymentStatus(Long paymentId, String status);

    List<PaymentResponseDto> getAllPayments();

    PaymentResponseDto getPaymentById(Long paymentId);

    // 🔥 ADD THESE
    List<PaymentResponseDto> getPaymentsByUser(Long userId);

    String refundPayment(Long paymentId);

    double getTotalRevenue();

    long getTotalPayments();
}