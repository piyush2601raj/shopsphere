package com.shopsphere.cntrl;

import com.shopsphere.service.ProductImageUpdateService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/products/images")
public class ProductImageUpdateController {

    private final ProductImageUpdateService
            productImageUpdateService;

    public ProductImageUpdateController(
            ProductImageUpdateService productImageUpdateService) {

        this.productImageUpdateService =
                productImageUpdateService;
    }


    // =====================================================
    // TEST 5 PRODUCTS
    // =====================================================

    @PutMapping("/test")
    public ResponseEntity<Map<String, Object>>
    testProductImages() {

        int count =
                productImageUpdateService
                        .updateTestProductImages();

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put("status", 200);

        response.put(
                "message",
                "Test product images updated successfully"
        );

        response.put(
                "updatedCount",
                count
        );

        return ResponseEntity.ok(response);
    }


    // =====================================================
    // UPDATE ALL PRODUCTS
    // =====================================================

    @PutMapping("/update-all")
    public ResponseEntity<Map<String, Object>>
    updateAllProductImages() {

        int count =
                productImageUpdateService
                        .updateAllProductImages();

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put("status", 200);

        response.put(
                "message",
                "Missing product images updated successfully"
        );

        response.put(
                "updatedCount",
                count
        );

        return ResponseEntity.ok(response);
    }
}