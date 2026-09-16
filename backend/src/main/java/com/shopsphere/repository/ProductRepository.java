package com.shopsphere.repository;

import com.shopsphere.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory_Name(String name);

    List<Product> findBySubCategory_Id(Long id);

    List<Product> findBySubCategory_Name(String name);

    List<Product> findByPriceLessThanEqual(double price);

    List<Product> findByBrandIgnoreCase(String brand);

    List<Product> findByBrandIgnoreCaseAndPriceLessThanEqual(
            String brand,
            double price
    );

    List<Product> findBySubCategory_NameIgnoreCaseAndPriceLessThanEqual(
            String subCategoryName,
            double price
    );

    List<Product> findByCategory_NameIgnoreCaseAndPriceLessThanEqual(
            String categoryName,
            double price
    );

    List<Product> findByPriceBetween(
            double minPrice,
            double maxPrice
    );

    List<Product> findByRatingGreaterThanEqual(
            double rating
    );

}