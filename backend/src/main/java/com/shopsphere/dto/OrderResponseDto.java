package com.shopsphere.dto;

import java.util.List;

public class OrderResponseDto {

    private Long orderId;
    private Long userId;
    private double totalAmount;
    private String status;
    private List<OrderItemDto> items;

    public OrderResponseDto(Long orderId, Long userId, double totalAmount,
                            String status, List<OrderItemDto> items) {
        this.orderId = orderId;
        this.userId = userId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.items = items;
    }

    public Long getOrderId() { return orderId; }
    public Long getUserId() { return userId; }
    public double getTotalAmount() { return totalAmount; }
    public String getStatus() { return status; }
    public List<OrderItemDto> getItems() { return items; }
}