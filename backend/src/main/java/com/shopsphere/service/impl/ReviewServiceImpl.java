package com.shopsphere.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopsphere.dto.ReviewDto;
import com.shopsphere.dto.ReviewResponseDto;
import com.shopsphere.model.Product;
import com.shopsphere.model.Review;
import com.shopsphere.model.User;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.ReviewRepository;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.service.ReviewService;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // ================= ADD REVIEW =================
    @Override
    public ReviewResponseDto addReview(ReviewDto reviewDto) {

        User user = userRepository.findById(reviewDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        Product product = productRepository.findById(reviewDto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product Not Found"));

        Review review = new Review();

        review.setUser(user);
        review.setProduct(product);
        review.setRating(reviewDto.getRating());
        review.setComment(reviewDto.getComment());

        Review saved = reviewRepository.save(review);

        ReviewResponseDto dto = new ReviewResponseDto();

        dto.setId(saved.getId());
        dto.setUserId(user.getId());
        dto.setProductId(product.getId());
        dto.setRating(saved.getRating());
        dto.setComment(saved.getComment());
        dto.setCreatedAt(saved.getCreatedAt());

        return dto;
    }

    // ================= GET REVIEWS BY PRODUCT =================
    @Override
    public List<ReviewResponseDto> getReviewsByProduct(Long productId) {

        List<Review> reviews = reviewRepository.findByProductId(productId);

        return reviews.stream().map(review -> {

            ReviewResponseDto dto = new ReviewResponseDto();

            dto.setId(review.getId());
            dto.setUserId(review.getUser().getId());
            dto.setProductId(review.getProduct().getId());
            dto.setRating(review.getRating());
            dto.setComment(review.getComment());
            dto.setCreatedAt(review.getCreatedAt());

            return dto;

        }).toList();
    }

    // ================= GET ALL REVIEWS (/all API) =================
    @Override
    public List<ReviewResponseDto> getAllReviews() {

        List<Review> reviews = reviewRepository.findAll();

        return reviews.stream().map(review -> {

            ReviewResponseDto dto = new ReviewResponseDto();

            dto.setId(review.getId());
            dto.setUserId(review.getUser().getId());
            dto.setProductId(review.getProduct().getId());
            dto.setRating(review.getRating());
            dto.setComment(review.getComment());
            dto.setCreatedAt(review.getCreatedAt());

            return dto;

        }).toList();
    }

    // ================= DELETE REVIEW =================
    @Override
    public void deleteReview(Long reviewId) {

        if (!reviewRepository.existsById(reviewId)) {
            throw new RuntimeException("Review not found");
        }

        reviewRepository.deleteById(reviewId);
    }
}