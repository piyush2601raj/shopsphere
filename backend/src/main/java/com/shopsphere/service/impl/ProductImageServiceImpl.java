package com.shopsphere.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopsphere.dto.ProductImageDto;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.model.Product;
import com.shopsphere.model.ProductImage;
import com.shopsphere.repository.ProductImageRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.service.ProductImageService;

@Service
public class ProductImageServiceImpl implements ProductImageService {

    @Autowired
    private ProductImageRepository imageRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public ProductImage addImage(ProductImageDto dto) {

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product Not Found"));

        ProductImage image = new ProductImage();

        image.setImageUrl(dto.getImageUrl());
        image.setProduct(product);

        return imageRepository.save(image);
    }

    @Override
    public List<ProductImage> getImagesByProduct(Long productId) {

        return imageRepository.findByProductId(productId);
    }

    @Override
    public void deleteImage(Long imageId) {

        imageRepository.deleteById(imageId);
    }
}