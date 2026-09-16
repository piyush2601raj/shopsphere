package com.shopsphere.service;

import java.util.List;

import com.shopsphere.dto.ProductImageDto;
import com.shopsphere.model.ProductImage;

public interface ProductImageService {

    ProductImage addImage(ProductImageDto dto);

    List<ProductImage> getImagesByProduct(Long productId);

    void deleteImage(Long imageId);
}