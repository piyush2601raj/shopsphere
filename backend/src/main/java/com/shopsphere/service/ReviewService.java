package com.shopsphere.service;

import java.util.List;

import com.shopsphere.dto.ReviewDto;
import com.shopsphere.dto.ReviewResponseDto;

public interface ReviewService {

    ReviewResponseDto addReview(ReviewDto reviewDto);

    List<ReviewResponseDto> getReviewsByProduct(Long productId);

    void deleteReview(Long reviewId);
    List<ReviewResponseDto> getAllReviews();
}