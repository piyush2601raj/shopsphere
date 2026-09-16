package com.shopsphere.cntrl;

import com.shopsphere.dto.CartDto;
import com.shopsphere.model.User;
import com.shopsphere.repository.CartRepository;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.service.CartService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/cart")
@CrossOrigin("*")
public class CartController {

    private final CartRepository cartRepo;
    private final UserRepository userRepo;
    private final CartService cartService;

    public CartController(
            CartRepository cartRepo,
            UserRepository userRepo,
            CartService cartService) {

        this.cartRepo = cartRepo;
        this.userRepo = userRepo;
        this.cartService = cartService;
    }

    // ================= GET CART =================
    @GetMapping("/{userId}")
    public ResponseEntity<CartDto> getCart(@PathVariable Long userId) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var cart = cartRepo.findCartWithItems(userId)
                .orElseGet(() -> {
                    var newCart = new com.shopsphere.model.Cart();
                    newCart.setUser(user);
                    newCart.setItems(new ArrayList<>());
                    return cartRepo.save(newCart);
                });

        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    // ================= ADD TO CART =================
    @PostMapping("/add")
    public ResponseEntity<CartDto> addToCart(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam int quantity) {

        return ResponseEntity.ok(
                cartService.addToCart(userId, productId, quantity)
        );
    }

    // ================= REMOVE ITEM =================
    @DeleteMapping("/remove")
    public ResponseEntity<CartDto> removeItem(
            @RequestParam Long userId,
            @RequestParam Long productId) {

        return ResponseEntity.ok(
                cartService.removeItem(userId, productId)
        );
    }
}