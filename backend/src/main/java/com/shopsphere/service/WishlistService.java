package com.shopsphere.service;

import java.util.List;

import com.shopsphere.dto.WishlistDto;
import com.shopsphere.dto.WishlistResponseDto;

public interface WishlistService {

    WishlistResponseDto addToWishlist(WishlistDto wishlistDto);

    List<WishlistResponseDto> getWishlistByUser(Long userId);

    List<WishlistResponseDto> getAllWishlist(); // ← YE HONA CHAHIYE

    void removeFromWishlist(Long wishlistId);
}