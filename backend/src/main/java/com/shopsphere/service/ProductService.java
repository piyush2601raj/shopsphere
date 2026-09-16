package com.shopsphere.service;

import com.shopsphere.model.Product;

import java.util.List;

public interface ProductService {

    Product addProduct(Product product);

    List<Product> addAllProducts(List<Product> products);

    List<Product> getAllProducts();

    List<Product> getProductsByCategory(String name);

    Product getProductById(Long id);

    List<Product> searchProducts(String query);

    void deleteProduct(Long id);
}