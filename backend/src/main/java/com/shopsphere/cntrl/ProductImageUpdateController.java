package com.shopsphere.cntrl;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopsphere.service.ProductImageUpdateService;

@RestController
@RequestMapping("/products/images")
public class ProductImageUpdateController {

    private final ProductImageUpdateService productImageUpdateService;

    public ProductImageUpdateController(
            ProductImageUpdateService productImageUpdateService) {

        this.productImageUpdateService =
                productImageUpdateService;
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