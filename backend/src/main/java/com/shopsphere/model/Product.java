package com.shopsphere.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= BASIC DETAILS =================

    @Column(nullable = false)
    private String name;

    private String brand;

    @Column(length = 2000)
    private String description;

    // ================= PRICE DETAILS =================

    @Column(nullable = false)
    private double price;

    private double originalPrice;

    private int discount;

    // ================= STOCK =================

    private int stock;

    // ================= PRODUCT INFORMATION =================

    private double rating;

    private int reviews;

    private String seller;

    private String delivery;

    private String emi;

    private String warranty;

    // ================= IMAGE =================

    @Column(length = 2000)
    private String imageUrl;

    // ================= CATEGORY =================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties("products")
    private Category category;

    // ================= SUB CATEGORY =================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subcategory_id")
    @JsonIgnoreProperties("products")
    private SubCategory subCategory;

    // ================= CONSTRUCTOR =================

    public Product() {
    }

    // ================= GETTERS =================

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getBrand() {
        return brand;
    }

    public String getDescription() {
        return description;
    }

    public double getPrice() {
        return price;
    }

    public double getOriginalPrice() {
        return originalPrice;
    }

    public int getDiscount() {
        return discount;
    }

    public int getStock() {
        return stock;
    }

    public double getRating() {
        return rating;
    }

    public int getReviews() {
        return reviews;
    }

    public String getSeller() {
        return seller;
    }

    public String getDelivery() {
        return delivery;
    }

    public String getEmi() {
        return emi;
    }

    public String getWarranty() {
        return warranty;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Category getCategory() {
        return category;
    }

    public SubCategory getSubCategory() {
        return subCategory;
    }

    // ================= SETTERS =================

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setOriginalPrice(double originalPrice) {
        this.originalPrice = originalPrice;
    }

    public void setDiscount(int discount) {
        this.discount = discount;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public void setReviews(int reviews) {
        this.reviews = reviews;
    }

    public void setSeller(String seller) {
        this.seller = seller;
    }

    public void setDelivery(String delivery) {
        this.delivery = delivery;
    }

    public void setEmi(String emi) {
        this.emi = emi;
    }

    public void setWarranty(String warranty) {
        this.warranty = warranty;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setSubCategory(SubCategory subCategory) {
        this.subCategory = subCategory;
    }
}