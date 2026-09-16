package com.shopsphere.model;

public enum OrderStatus {

    PENDING,     // Order created but not confirmed yet
    CONFIRMED,   // Order confirmed
    SHIPPED,     // Dispatched from warehouse
    DELIVERED,   // Delivered to user
    CANCELLED    // Order cancelled

}