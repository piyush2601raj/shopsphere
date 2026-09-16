package com.shopsphere.repository;

import com.shopsphere.model.Cart;
import com.shopsphere.model.CartItem;
import com.shopsphere.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // ✅ Find CartItem by cart and product
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);

}