package com.shopsphere.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Owning side (User → Cart)
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    // Cart items
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    // 🔥 FIX: DB COLUMN MAPPING
    @Column(name = "total_amount", nullable = false)
    private Double totalAmount = 0.0;

    // ================= GETTERS =================
    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    // ================= SETTERS =================
    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setItems(List<CartItem> items) {
        this.items.clear();
        if (items != null) {
            for (CartItem item : items) {
                addItem(item);
            }
        }
    }

    // ================= HELPERS =================
    public void addItem(CartItem item) {
        item.setCart(this);
        this.items.add(item);

        // optional safety: update total automatically
        recalculateTotal();
    }

    public void removeItem(CartItem item) {
        item.setCart(null);
        this.items.remove(item);

        // optional safety: update total automatically
        recalculateTotal();
    }

    // 🔥 AUTO TOTAL CALCULATION
    public void recalculateTotal() {
        double total = 0.0;

        if (items != null) {
            for (CartItem ci : items) {
                if (ci.getProduct() != null) {
                    total += ci.getProduct().getPrice() * ci.getQuantity();
                }
            }
        }

        this.totalAmount = total;
    }
}