package com.shopsphere.service.impl;

import com.shopsphere.dto.ProductImportDto;
import com.shopsphere.model.Category;
import com.shopsphere.model.Product;
import com.shopsphere.model.SubCategory;
import com.shopsphere.repository.CategoryRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.SubCategoryRepository;
import com.shopsphere.service.ProductImportService;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductImportServiceImpl implements ProductImportService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SubCategoryRepository subCategoryRepository;


    // ================= CONSTRUCTOR =================

    public ProductImportServiceImpl(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            SubCategoryRepository subCategoryRepository
    ) {

        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.subCategoryRepository = subCategoryRepository;
    }


    // ================= BULK IMPORT PRODUCTS =================

    @Override
    public int importProducts(List<ProductImportDto> products) {

        List<Product> productList = new ArrayList<>();

        List<String> missingSubCategories = new ArrayList<>();


        // ================= LOOP ALL PRODUCTS =================

        for (ProductImportDto dto : products) {


            // ================= FIND CATEGORY =================

            Category category = categoryRepository
                    .findByName(dto.getCategoryName())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Category not found: "
                                            + dto.getCategoryName()
                            )
                    );


            // ================= FIND SUBCATEGORY =================

            SubCategory subCategory =
                    subCategoryRepository
                            .findByNameAndCategory_Id(
                                    dto.getSubCategoryName(),
                                    category.getId()
                            );


            // ================= CHECK MISSING SUBCATEGORY =================

            if (subCategory == null) {

                String missingSubCategory =
                        dto.getSubCategoryName()
                                + " inside category: "
                                + dto.getCategoryName();


                // Prevent duplicate names in error list

                if (!missingSubCategories.contains(missingSubCategory)) {

                    missingSubCategories.add(missingSubCategory);
                }


                // Skip current product

                continue;
            }


            // ================= CREATE PRODUCT =================

            Product product = new Product();


            // BASIC DETAILS

            product.setName(dto.getName());

            product.setBrand(dto.getBrand());

            product.setDescription(dto.getDescription());


            // PRICE DETAILS

            product.setPrice(dto.getPrice());

            product.setOriginalPrice(dto.getOriginalPrice());

            product.setDiscount(dto.getDiscount());


            // STOCK

            product.setStock(dto.getStock());


            // RATING & REVIEWS

            product.setRating(dto.getRating());

            product.setReviews(dto.getReviews());


            // SELLER DETAILS

            product.setSeller(dto.getSeller());

            product.setDelivery(dto.getDelivery());

            product.setEmi(dto.getEmi());

            product.setWarranty(dto.getWarranty());


            // IMAGE

            product.setImageUrl(dto.getImageUrl());


            // ================= RELATIONSHIPS =================

            product.setCategory(category);

            product.setSubCategory(subCategory);


            // ADD PRODUCT TO LIST

            productList.add(product);
        }


        // ================= CHECK ALL MISSING SUBCATEGORIES =================

        if (!missingSubCategories.isEmpty()) {

            throw new RuntimeException(

                    "Missing SubCategories: "
                            + missingSubCategories
            );
        }


        // ================= BULK SAVE TO POSTGRESQL =================

        List<Product> savedProducts =
                productRepository.saveAll(productList);


        // ================= RETURN IMPORTED COUNT =================

        return savedProducts.size();
    }
}