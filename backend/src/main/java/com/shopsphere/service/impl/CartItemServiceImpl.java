package com.shopsphere.service.impl;

import com.shopsphere.model.CartItem;
import com.shopsphere.repository.CartItemRepository;
import com.shopsphere.service.CartItemService; // Sirf tab rakhein agar package alag hai
import org.springframework.stereotype.Service;

@Service
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepo;

    // Constructor Injection
    public CartItemServiceImpl(CartItemRepository cartItemRepo) {
        this.cartItemRepo = cartItemRepo;
    }

    @Override
    public CartItem updateCartItem(Long cartItemId, int quantity) {
        CartItem item = cartItemRepo.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        item.setQuantity(quantity);
        return cartItemRepo.save(item);
    }

    @Override
    public void removeCartItem(Long cartItemId) {
        cartItemRepo.deleteById(cartItemId);
    }
}