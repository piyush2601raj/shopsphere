package com.shopsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "wishlist")
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore   // ✅ FIX LOOP
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore   // ✅ FIX LOOP
    private Product product;

    public Wishlist() {}

    public Wishlist(Long id, User user, Product product) {
        this.id = id;
        this.user = user;
        this.product = product;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public Product getProduct() { return product; }

    public void setProduct(Product product) { this.product = product; }
}