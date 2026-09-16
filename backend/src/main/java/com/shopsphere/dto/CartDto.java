package com.shopsphere.dto;

import java.util.ArrayList;
import java.util.List;

public class CartDto {

    private Long id;

    // ✅ Empty list by default
    private List<CartItemDto> items = new ArrayList<>();

    private double totalAmount;

    public CartDto() {
    }

    // ================= GETTERS =================

    public Long getId() {
        return id;
    }

    public List<CartItemDto> getItems() {
        return items;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    // ================= SETTERS =================

    public void setId(Long id) {
        this.id = id;
    }

    public void setItems(List<CartItemDto> items) {
        this.items = (items != null) ? items : new ArrayList<>();
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }
}