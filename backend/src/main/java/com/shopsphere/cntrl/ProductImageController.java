package com.shopsphere.cntrl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.shopsphere.dto.ProductImageDto;
import com.shopsphere.model.ProductImage;
import com.shopsphere.service.ProductImageService;

@RestController
@RequestMapping("/api/product-images")
@CrossOrigin("*")
public class ProductImageController {

    @Autowired
    private ProductImageService imageService;

    @PostMapping
    public ProductImage addImage(
            @RequestBody ProductImageDto dto) {

        return imageService.addImage(dto);
    }

    @GetMapping("/{productId}")
    public List<ProductImage> getImages(
            @PathVariable Long productId) {

        return imageService
                .getImagesByProduct(productId);
    }

    @DeleteMapping("/{imageId}")
    public String deleteImage(
            @PathVariable Long imageId) {

        imageService.deleteImage(imageId);

        return "Image Deleted Successfully";
    }
}