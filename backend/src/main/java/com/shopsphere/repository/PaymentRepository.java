package com.shopsphere.repository;

import com.shopsphere.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // User payment history
    List<Payment> findByOrder_User_Id(Long userId);

    // Check existing payment for an order
    boolean existsByOrder_Id(Long orderId);

    // Get payments by status
    List<Payment> findByStatus(String status);

    // Find payment using Razorpay order ID
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
}