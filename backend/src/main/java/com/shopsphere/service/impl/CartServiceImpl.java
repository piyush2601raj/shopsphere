package com.shopsphere.service.impl;

import com.shopsphere.dto.CartDto;
import com.shopsphere.dto.CartItemDto;
import com.shopsphere.model.*;
import com.shopsphere.repository.*;
import com.shopsphere.service.CartService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    public CartServiceImpl(
            CartRepository cartRepository,
            UserRepository userRepository,
            ProductRepository productRepository) {

        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // ================= ADD TO CART =================

    @Override
    public CartDto addToCart(Long userId, Long productId, int quantity) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        if (cart.getItems() == null) {
            cart.setItems(new ArrayList<>());
        }

        CartItem existing = null;

        for (CartItem item : cart.getItems()) {

            if (item.getProduct().getId().equals(productId)) {
                existing = item;
                break;
            }
        }

        if (existing != null) {

            existing.setQuantity(existing.getQuantity() + quantity);

        } else {

            CartItem newItem = new CartItem();

            newItem.setProduct(product);
            newItem.setQuantity(quantity);

            // IMPORTANT:
            // Cart.addItem() automatically sets cart relationship
            cart.addItem(newItem);
        }

        cart.recalculateTotal();

        return mapToDto(cartRepository.save(cart));
    }

    // ================= GET CART =================

    @Override
    public CartDto getCartByUserId(Long userId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        return mapToDto(cart);
    }

    // ================= REMOVE ITEM =================

    @Override
    public CartDto removeItem(Long userId, Long productId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().removeIf(
                i -> i.getProduct().getId().equals(productId)
        );

        cart.recalculateTotal();

        return mapToDto(cartRepository.save(cart));
    }

    // ================= DTO MAPPER =================

    private CartDto mapToDto(Cart cart) {

        CartDto dto = new CartDto();

        dto.setId(cart.getId());

        List<CartItemDto> list = new ArrayList<>();

        double total = 0;

        if (cart.getItems() != null) {

            for (CartItem ci : cart.getItems()) {

                Product p = ci.getProduct();

                double itemTotal =
                        p.getPrice() * ci.getQuantity();

                total += itemTotal;

                CartItemDto d = new CartItemDto();

                d.setProductId(p.getId());
                d.setProductName(p.getName());
                d.setPrice(p.getPrice());
                d.setQuantity(ci.getQuantity());
                d.setTotalPrice(itemTotal);

                list.add(d);
            }
        }

        dto.setItems(list);

        dto.setTotalAmount(total);

        return dto;
    }
}