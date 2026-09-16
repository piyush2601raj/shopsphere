package com.shopsphere.service.impl;

import com.shopsphere.dto.OrderItemDto;
import com.shopsphere.dto.OrderResponseDto;
import com.shopsphere.model.*;
import com.shopsphere.repository.*;
import com.shopsphere.service.OrderService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final CartRepository cartRepo;

    public OrderServiceImpl(
            OrderRepository orderRepo,
            UserRepository userRepo,
            CartRepository cartRepo) {

        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
        this.cartRepo = cartRepo;
    }

    // =========================
    // PLACE ORDER
    // =========================

    @Override
    @Transactional
    public OrderResponseDto placeOrder(Long userId) {

        User user = userRepo.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found with ID: " + userId));

        Cart cart = cartRepo.findCartWithItems(userId)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found for user ID: " + userId));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();

        order.setUser(user);

        // New order starts as PENDING
        order.setStatus(OrderStatus.PENDING);

        double total = 0.0;

        for (CartItem cartItem : cart.getItems()) {

            if (cartItem.getProduct() == null) {
                continue;
            }

            Product product = cartItem.getProduct();

            int quantity = cartItem.getQuantity();

            if (quantity <= 0) {
                continue;
            }

            OrderItem orderItem = new OrderItem();

            orderItem.setProduct(product);
            orderItem.setQuantity(quantity);
            orderItem.setPrice(product.getPrice());

            order.addItem(orderItem);

            total += product.getPrice() * quantity;
        }

        if (order.getItems().isEmpty()) {
            throw new RuntimeException("No valid products found in cart");
        }

        order.setTotalAmount(total);

        // DATABASE GENERATES THE REAL ORDER ID
        Order savedOrder = orderRepo.save(order);

        return mapToDto(savedOrder);
    }

    // =========================
    // GET ALL ORDERS
    // =========================

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getAllOrders() {

        List<OrderResponseDto> list = new ArrayList<>();

        for (Order order : orderRepo.findAll()) {
            list.add(mapToDto(order));
        }

        return list;
    }

    // =========================
    // GET ORDERS BY USER
    // =========================

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByUser(Long userId) {

        userRepo.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found with ID: " + userId));

        List<OrderResponseDto> list = new ArrayList<>();

        for (Order order : orderRepo.findByUser_Id(userId)) {
            list.add(mapToDto(order));
        }

        return list;
    }

    // =========================
    // GET ORDER BY ID
    // =========================

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDto getOrderById(Long orderId) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found with ID: " + orderId));

        return mapToDto(order);
    }

    // =========================
    // UPDATE STATUS
    // =========================

    @Override
    @Transactional
    public OrderResponseDto updateStatus(
            Long orderId,
            OrderStatus status) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found with ID: " + orderId));

        order.setStatus(status);

        Order saved = orderRepo.save(order);

        return mapToDto(saved);
    }

    // =========================
    // UPDATE PAYMENT DETAILS
    // =========================

    @Override
    @Transactional
    public void updatePaymentDetails(
            Long orderId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String paymentStatus) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found with ID: " + orderId));

        order.setRazorpayOrderId(razorpayOrderId);
        order.setRazorpayPaymentId(razorpayPaymentId);
        order.setPaymentStatus(paymentStatus);

        if ("SUCCESS".equalsIgnoreCase(paymentStatus)) {
            order.setStatus(OrderStatus.CONFIRMED);
        }

        orderRepo.save(order);
    }

    // =========================
    // DTO MAPPER
    // =========================

    private OrderResponseDto mapToDto(Order order) {

        List<OrderItemDto> items = new ArrayList<>();

        if (order.getItems() != null) {

            for (OrderItem item : order.getItems()) {

                if (item.getProduct() == null) {
                    continue;
                }

                items.add(
                        new OrderItemDto(
                                item.getProduct().getId(),
                                item.getProduct().getName(),
                                item.getQuantity(),
                                item.getPrice()
                        )
                );
            }
        }

        return new OrderResponseDto(
                order.getId(),
                order.getUser().getId(),
                order.getTotalAmount(),
                order.getStatus() != null
                        ? order.getStatus().name()
                        : "UNKNOWN",
                items
        );
    }
}