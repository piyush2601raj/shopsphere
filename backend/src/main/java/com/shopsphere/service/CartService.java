package com.shopsphere.service;

import com.shopsphere.dto.CartDto;

public interface CartService {

    CartDto addToCart(Long userId, Long productId, int quantity);

    CartDto getCartByUserId(Long userId);

    CartDto removeItem(Long userId, Long productId);
}