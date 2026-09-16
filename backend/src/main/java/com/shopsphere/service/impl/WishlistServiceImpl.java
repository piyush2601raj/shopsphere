package com.shopsphere.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopsphere.dto.WishlistDto;
import com.shopsphere.dto.WishlistResponseDto;
import com.shopsphere.model.Product;
import com.shopsphere.model.User;
import com.shopsphere.model.Wishlist;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.repository.WishlistRepository;
import com.shopsphere.service.WishlistService;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // ================= ADD TO WISHLIST =================
    @Override
    public WishlistResponseDto addToWishlist(WishlistDto dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product Not Found"));

        // ✅ Duplicate Check
        if (wishlistRepository.existsByUser_IdAndProduct_Id(
                dto.getUserId(),
                dto.getProductId())) {

            throw new RuntimeException("Product already exists in wishlist");
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);

        Wishlist saved = wishlistRepository.save(wishlist);

        WishlistResponseDto res = new WishlistResponseDto();
        res.setWishlistId(saved.getId());
        res.setUserId(user.getId());
        res.setProductId(product.getId());
        res.setProductName(product.getName());

        return res;
    }

    // ================= GET USER WISHLIST =================
    @Override
    public List<WishlistResponseDto> getWishlistByUser(Long userId) {

        return wishlistRepository.findByUserId(userId)
                .stream()
                .map(w -> {

                    WishlistResponseDto dto = new WishlistResponseDto();

                    dto.setWishlistId(w.getId());
                    dto.setUserId(w.getUser().getId());
                    dto.setProductId(w.getProduct().getId());
                    dto.setProductName(w.getProduct().getName());

                    return dto;
                })
                .toList();
    }

    // ================= GET ALL WISHLIST =================
    @Override
    public List<WishlistResponseDto> getAllWishlist() {

        return wishlistRepository.findAll()
                .stream()
                .map(w -> {

                    WishlistResponseDto dto = new WishlistResponseDto();

                    dto.setWishlistId(w.getId());
                    dto.setUserId(w.getUser().getId());
                    dto.setProductId(w.getProduct().getId());
                    dto.setProductName(w.getProduct().getName());

                    return dto;
                })
                .toList();
    }

    // ================= DELETE =================
    @Override
    public void removeFromWishlist(Long wishlistId) {

        if (!wishlistRepository.existsById(wishlistId)) {
            throw new RuntimeException("Wishlist Item Not Found");
        }

        wishlistRepository.deleteById(wishlistId);
    }
}