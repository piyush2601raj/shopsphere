package com.shopsphere.dto;

public class CategoryDto {

    private Long id;
    private String name;
    private String description;
    private Long productCount;

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Long getProductCount() { return productCount; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setProductCount(Long productCount) { this.productCount = productCount; }
}