package com.shopsphere.cntrl;

import com.shopsphere.dto.ProductDto;
import com.shopsphere.dto.ProductImportDto;
import com.shopsphere.model.Category;
import com.shopsphere.model.Product;
import com.shopsphere.model.SubCategory;
import com.shopsphere.repository.CategoryRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.SubCategoryRepository;
import com.shopsphere.service.ProductImportService;
import com.shopsphere.service.ProductService;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;

    private final SubCategoryRepository subCategoryRepository;

    private final ProductImportService productImportService;

    private final ProductService productService;


    // ================= CONSTRUCTOR =================

    public ProductController(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            SubCategoryRepository subCategoryRepository,
            ProductImportService productImportService,
            ProductService productService
    ) {

        this.productRepository = productRepository;

        this.categoryRepository = categoryRepository;

        this.subCategoryRepository = subCategoryRepository;

        this.productImportService = productImportService;

        this.productService = productService;
    }


    // ================= PRODUCT -> DTO =================

    private ProductDto convertToDto(Product product) {

        ProductDto dto = new ProductDto();

        dto.setId(product.getId());

        dto.setName(product.getName());

        dto.setBrand(product.getBrand());

        dto.setDescription(product.getDescription());

        dto.setPrice(product.getPrice());

        dto.setOriginalPrice(product.getOriginalPrice());

        dto.setDiscount(product.getDiscount());

        dto.setStock(product.getStock());

        dto.setRating(product.getRating());

        dto.setReviews(product.getReviews());

        dto.setSeller(product.getSeller());

        dto.setDelivery(product.getDelivery());

        dto.setEmi(product.getEmi());

        dto.setWarranty(product.getWarranty());

        dto.setImageUrl(product.getImageUrl());


        // ================= CATEGORY =================

        if (product.getCategory() != null) {

            dto.setCategoryId(
                    product.getCategory().getId()
            );

            dto.setCategoryName(
                    product.getCategory().getName()
            );
        }


        // ================= SUBCATEGORY =================

        if (product.getSubCategory() != null) {

            dto.setSubCategoryId(
                    product.getSubCategory().getId()
            );

            dto.setSubCategoryName(
                    product.getSubCategory().getName()
            );
        }

        return dto;
    }


    // ================= PRODUCT LIST -> DTO LIST =================

    private List<ProductDto> convertToDtoList(
            List<Product> products
    ) {

        List<ProductDto> dtoList = new ArrayList<>();

        for (Product product : products) {

            dtoList.add(
                    convertToDto(product)
            );
        }

        return dtoList;
    }


    // ================= GET ALL PRODUCTS =================

    @GetMapping("/all")
    public Map<String, Object> getAllProducts() {

        Map<String, Object> response =
                new LinkedHashMap<>();

        List<Product> products =
                productRepository.findAll();

        List<ProductDto> dtoList =
                convertToDtoList(products);

        response.put("status", 200);

        response.put(
                "message",
                "All products fetched successfully"
        );

        response.put(
                "data",
                dtoList
        );

        return response;
    }


    // ================= GET PRODUCT BY ID =================

    @GetMapping("/{id}")
    public Map<String, Object> getProductById(
            @PathVariable Long id
    ) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        Optional<Product> optionalProduct =
                productRepository.findById(id);

        if (optionalProduct.isEmpty()) {

            response.put("status", 404);

            response.put(
                    "message",
                    "Product not found"
            );

            return response;
        }

        ProductDto dto =
                convertToDto(
                        optionalProduct.get()
                );

        response.put("status", 200);

        response.put(
                "message",
                "Product found successfully"
        );

        response.put(
                "data",
                dto
        );

        return response;
    }


    // ================= CREATE PRODUCT =================

    @PostMapping("/save")
    public Map<String, Object> saveProduct(
            @RequestBody Product product
    ) {

        Map<String, Object> response =
                new LinkedHashMap<>();


        // ================= CATEGORY =================

        if (
                product.getCategory() != null
                        &&
                        product.getCategory().getId() != null
        ) {

            Category category =
                    categoryRepository
                            .findById(
                                    product
                                            .getCategory()
                                            .getId()
                            )
                            .orElse(null);

            if (category == null) {

                response.put("status", 404);

                response.put(
                        "message",
                        "Category not found"
                );

                return response;
            }

            product.setCategory(category);
        }


        // ================= SUBCATEGORY =================

        if (
                product.getSubCategory() != null
                        &&
                        product.getSubCategory().getId() != null
        ) {

            SubCategory subCategory =
                    subCategoryRepository
                            .findById(
                                    product
                                            .getSubCategory()
                                            .getId()
                            )
                            .orElse(null);

            if (subCategory == null) {

                response.put("status", 404);

                response.put(
                        "message",
                        "SubCategory not found"
                );

                return response;
            }

            product.setSubCategory(subCategory);
        }


        Product savedProduct =
                productRepository.save(product);


        response.put("status", 201);

        response.put(
                "message",
                "Product created successfully"
        );

        response.put(
                "data",
                convertToDto(savedProduct)
        );

        return response;
    }


    // ================= UPDATE PRODUCT =================

    @PutMapping("/update/{id}")
    public Map<String, Object> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product
    ) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        Optional<Product> optionalProduct =
                productRepository.findById(id);

        if (optionalProduct.isEmpty()) {

            response.put("status", 404);

            response.put(
                    "message",
                    "Product not found"
            );

            return response;
        }


        // ================= CATEGORY =================

        if (
                product.getCategory() != null
                        &&
                        product.getCategory().getId() != null
        ) {

            Category category =
                    categoryRepository
                            .findById(
                                    product
                                            .getCategory()
                                            .getId()
                            )
                            .orElse(null);

            if (category == null) {

                response.put("status", 404);

                response.put(
                        "message",
                        "Category not found"
                );

                return response;
            }

            product.setCategory(category);
        }


        // ================= SUBCATEGORY =================

        if (
                product.getSubCategory() != null
                        &&
                        product.getSubCategory().getId() != null
        ) {

            SubCategory subCategory =
                    subCategoryRepository
                            .findById(
                                    product
                                            .getSubCategory()
                                            .getId()
                            )
                            .orElse(null);

            if (subCategory == null) {

                response.put("status", 404);

                response.put(
                        "message",
                        "SubCategory not found"
                );

                return response;
            }

            product.setSubCategory(subCategory);
        }


        product.setId(id);

        Product updatedProduct =
                productRepository.save(product);


        response.put("status", 200);

        response.put(
                "message",
                "Product updated successfully"
        );

        response.put(
                "data",
                convertToDto(updatedProduct)
        );

        return response;
    }


    // ================= DELETE PRODUCT =================

    @DeleteMapping("/delete/{id}")
    public Map<String, Object> deleteProduct(
            @PathVariable Long id
    ) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        if (!productRepository.existsById(id)) {

            response.put("status", 404);

            response.put(
                    "message",
                    "Product not found"
            );

            return response;
        }


        productRepository.deleteById(id);


        response.put("status", 200);

        response.put(
                "message",
                "Product deleted successfully"
        );

        return response;
    }


    // ================= SMART PRODUCT SEARCH =================

    @GetMapping("/search")
    public Map<String, Object> searchProducts(
            @RequestParam String query
    ) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        List<Product> products =
                productService.searchProducts(query);

        response.put("status", 200);

        response.put(
                "message",
                "Products searched successfully"
        );

        response.put(
                "query",
                query
        );

        response.put(
                "data",
                convertToDtoList(products)
        );

        return response;
    }


    // ================= GET PRODUCTS BY CATEGORY =================

    @GetMapping("/category/{name}")
    public Map<String, Object> getByCategory(
            @PathVariable String name
    ) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        List<Product> products =
                productRepository
                        .findByCategory_Name(name);


        response.put("status", 200);

        response.put(
                "message",
                "Category products fetched successfully"
        );

        response.put(
                "data",
                convertToDtoList(products)
        );

        return response;
    }


    // ================= GET PRODUCTS BY SUBCATEGORY =================

    @GetMapping("/subcategory/{name}")
    public Map<String, Object> getProductsBySubCategory(
            @PathVariable String name
    ) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        List<Product> products =
                productRepository
                        .findBySubCategory_Name(name);


        response.put("status", 200);

        response.put(
                "message",
                "SubCategory products fetched successfully"
        );

        response.put(
                "data",
                convertToDtoList(products)
        );

        return response;
    }


    // ================= BULK IMPORT PRODUCTS =================

    @PostMapping("/bulk-import")
    public Map<String, Object> bulkImportProducts(
            @RequestBody List<ProductImportDto> products
    ) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        int importedCount =
                productImportService
                        .importProducts(products);


        response.put("status", 201);

        response.put(
                "message",
                "Products imported successfully"
        );

        response.put(
                "importedCount",
                importedCount
        );

        return response;
    }

}