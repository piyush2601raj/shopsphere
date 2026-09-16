package com.shopsphere.cntrl;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.shopsphere.dto.WishlistDto;
import com.shopsphere.dto.WishlistResponseDto;
import com.shopsphere.service.WishlistService;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin("*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // ================= ADD TO WISHLIST =================
    @PostMapping("/add")
    public ResponseEntity<?> addToWishlist(@RequestBody WishlistDto wishlistDto) {

        WishlistResponseDto data = wishlistService.addToWishlist(wishlistDto);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("status", 200);
        res.put("message", "Added to wishlist successfully");
        res.put("data", data);

        return ResponseEntity.ok(res);
    }

    // ================= GET USER WISHLIST =================
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getWishlist(@PathVariable Long userId) {

        List<WishlistResponseDto> data = wishlistService.getWishlistByUser(userId);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("status", 200);
        res.put("message", "Wishlist fetched successfully");
        res.put("data", data);

        return ResponseEntity.ok(res);
    }

    // ================= GET ALL WISHLIST (IMPORTANT FIX) =================
    @GetMapping
    public ResponseEntity<?> getAllWishlist() {

        List<WishlistResponseDto> data = wishlistService.getAllWishlist();

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("status", 200);
        res.put("message", "All wishlist fetched successfully");
        res.put("data", data);

        return ResponseEntity.ok(res);
    }

    // ================= REMOVE FROM WISHLIST =================
    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<?> removeWishlist(@PathVariable Long wishlistId) {

        wishlistService.removeFromWishlist(wishlistId);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("status", 200);
        res.put("message", "Wishlist item removed successfully");
        res.put("data", null);

        return ResponseEntity.ok(res);
    }
}