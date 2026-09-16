package com.shopsphere.service.impl;

import com.shopsphere.dto.PaymentResponseDto;
import com.shopsphere.model.*;
import com.shopsphere.repository.OrderRepository;
import com.shopsphere.repository.PaymentRepository;
import com.shopsphere.service.PaymentService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepo;
    private final OrderRepository orderRepo;

    public PaymentServiceImpl(PaymentRepository paymentRepo,
                              OrderRepository orderRepo) {
        this.paymentRepo = paymentRepo;
        this.orderRepo = orderRepo;
    }

    // =========================
    // CREATE PAYMENT
    // =========================
    @Override
    public PaymentResponseDto createPayment(Long orderId, String method) {

        if (paymentRepo.existsByOrder_Id(orderId)) {
            throw new RuntimeException("Payment already exists for this order");
        }

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setMethod(method);

        // 🔥 FIX: always start with PENDING
        payment.setStatus(PaymentStatus.PENDING);
        payment.setTransactionId("TXN" + System.currentTimeMillis());

        Payment saved = paymentRepo.save(payment);

        return mapToDTO(saved);
    }

    // =========================
    // UPDATE PAYMENT STATUS
    // =========================
    @Override
    public PaymentResponseDto updatePaymentStatus(Long id, String status) {

        Payment payment = paymentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));

        PaymentStatus newStatus = PaymentStatus.valueOf(status.toUpperCase());

        payment.setStatus(newStatus);

        Payment updated = paymentRepo.save(payment);

        return mapToDTO(updated);
    }

    // =========================
    // GET ALL PAYMENTS
    // =========================
    @Override
    public List<PaymentResponseDto> getAllPayments() {

        return paymentRepo.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =========================
    // GET PAYMENT BY ID
    // =========================
    @Override
    public PaymentResponseDto getPaymentById(Long id) {

        Payment payment = paymentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));

        return mapToDTO(payment);
    }

    // =========================
    // GET BY USER
    // =========================
    @Override
    public List<PaymentResponseDto> getPaymentsByUser(Long userId) {

        return paymentRepo.findByOrder_User_Id(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =========================
    // REFUND
    // =========================
    @Override
    public String refundPayment(Long paymentId) {

        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new RuntimeException("Refund allowed only for SUCCESS payments");
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        paymentRepo.save(payment);

        return "Refund successful";
    }

    // =========================
    // REVENUE
    // =========================
    @Override
    public double getTotalRevenue() {

        return paymentRepo.findAll()
                .stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                .mapToDouble(Payment::getAmount)
                .sum();
    }

    @Override
    public long getTotalPayments() {
        return paymentRepo.count();
    }

    // =========================
    // DTO MAPPER
    // =========================
    private PaymentResponseDto mapToDTO(Payment payment) {

        Long orderId = (payment.getOrder() != null)
                ? payment.getOrder().getId()
                : null;

        PaymentResponseDto dto = new PaymentResponseDto();
        dto.setPaymentId(payment.getId());
        dto.setStatus(payment.getStatus().name());
        dto.setAmount(payment.getAmount());
        dto.setOrderId(orderId);

        return dto;
    }
}