package com.shopsphere.service;

import com.shopsphere.dto.OrderResponseDto;
import com.shopsphere.model.OrderStatus;

import java.util.List;

public interface OrderService {

    // =========================
    // PLACE ORDER
    // =========================
    OrderResponseDto placeOrder(Long userId);

    // =========================
    // GET ALL ORDERS
    // =========================
    List<OrderResponseDto> getAllOrders();

    // =========================
    // GET ORDER BY ID
    // =========================
    OrderResponseDto getOrderById(Long orderId);

    // =========================
    // UPDATE ORDER STATUS
    // =========================
    OrderResponseDto updateStatus(Long orderId, OrderStatus status);

    // =========================
    // UPDATE PAYMENT DETAILS
    // =========================
    void updatePaymentDetails(
            Long orderId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String paymentStatus
    );

    // =========================
    // GET ORDERS BY USER
    // =========================
    List<OrderResponseDto> getOrdersByUser(Long userId);
}