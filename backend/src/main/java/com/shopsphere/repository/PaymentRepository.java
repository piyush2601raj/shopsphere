package com.shopsphere.repository;

import com.shopsphere.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // ✅ 1. USER PAYMENT HISTORY
    List<Payment> findByOrder_User_Id(Long userId);

    // ✅ 2. CHECK DUPLICATE PAYMENT (important)
    boolean existsByOrder_Id(Long orderId);

    // ✅ 3. GET PAYMENTS BY STATUS (admin use)
    List<Payment> findByStatus(String status);
}