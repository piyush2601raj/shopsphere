package com.shopsphere.service;

import com.shopsphere.model.CartItem;

public interface CartItemService {
    
    // CartItem ki quantity update karne ke liye
    CartItem updateCartItem(Long cartItemId, int quantity);

    // CartItem ko cart se remove karne ke liye
    void removeCartItem(Long cartItemId);
}
