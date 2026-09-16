package com.shopsphere.cntrl;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.shopsphere.dto.ReviewDto;
import com.shopsphere.service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin("*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // ================= ADD REVIEW =================
    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody ReviewDto reviewDto) {

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("status", 200);
        res.put("message", "Review added successfully");
        res.put("data", reviewService.addReview(reviewDto));

        return ResponseEntity.ok(res);
    }

    // ================= GET REVIEWS BY PRODUCT =================
    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getReviews(@PathVariable Long productId) {

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("status", 200);
        res.put("message", "Product reviews fetched successfully");
        res.put("data", reviewService.getReviewsByProduct(productId));

        return ResponseEntity.ok(res);
    }

    // ================= GET ALL REVIEWS =================
    @GetMapping("/all")
    public ResponseEntity<?> getAllReviews() {

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("status", 200);
        res.put("message", "All reviews fetched successfully");
        res.put("data", reviewService.getAllReviews());

        return ResponseEntity.ok(res);
    }

    // ================= DELETE REVIEW =================
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) {

        reviewService.deleteReview(reviewId);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("status", 200);
        res.put("message", "Review deleted successfully");
        res.put("data", null);

        return ResponseEntity.ok(res);
    }
}