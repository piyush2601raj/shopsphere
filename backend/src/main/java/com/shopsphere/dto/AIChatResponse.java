package com.shopsphere.dto;

import java.util.List;

public class AIChatResponse {

    private String message;

    private List<Long> productIds;

    public AIChatResponse() {
    }

    public AIChatResponse(String message, List<Long> productIds) {
        this.message = message;
        this.productIds = productIds;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<Long> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<Long> productIds) {
        this.productIds = productIds;
    }
}