package com.shopsphere.service;

import com.shopsphere.model.Product;
import com.shopsphere.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductRagService {

    private final ProductRepository productRepository;

    public ProductRagService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public String retrieveProducts(String query) {

        List<Product> products = productRepository.findAll();

        String q = query.toLowerCase().trim();

        List<Product> matchedProducts = products.stream()
                .filter(product -> matches(product, q))
                .limit(10)
                .collect(Collectors.toList());

        if (matchedProducts.isEmpty()) {
            return "No matching ShopSphere products were found.";
        }

        return buildContext(matchedProducts);
    }

    private boolean matches(Product product, String query) {

        String name = safe(product.getName());
        String brand = safe(product.getBrand());
        String description = safe(product.getDescription());

        String category = product.getCategory() != null
                ? safe(product.getCategory().getName())
                : "";

        String subCategory = product.getSubCategory() != null
                ? safe(product.getSubCategory().getName())
                : "";

        return name.contains(query)
                || brand.contains(query)
                || description.contains(query)
                || category.contains(query)
                || subCategory.contains(query)
                || query.contains(name)
                || query.contains(brand)
                || query.contains(category)
                || query.contains(subCategory);
    }

    private String safe(String value) {
        return value == null ? "" : value.toLowerCase();
    }

    private String buildContext(List<Product> products) {

        StringBuilder context = new StringBuilder();

        context.append("SHOPSPHERE PRODUCT DATA:\n\n");

        for (Product product : products) {

            context.append("Product ID: ")
                    .append(product.getId())
                    .append("\n");

            context.append("Name: ")
                    .append(product.getName())
                    .append("\n");

            context.append("Brand: ")
                    .append(product.getBrand())
                    .append("\n");

            context.append("Price: ₹")
                    .append(product.getPrice())
                    .append("\n");

            context.append("Original Price: ₹")
                    .append(product.getOriginalPrice())
                    .append("\n");

            context.append("Discount: ")
                    .append(product.getDiscount())
                    .append("%\n");

            context.append("Stock: ")
                    .append(product.getStock())
                    .append("\n");

            context.append("Rating: ")
                    .append(product.getRating())
                    .append("\n");

            context.append("Reviews: ")
                    .append(product.getReviews())
                    .append("\n");

            context.append("Seller: ")
                    .append(product.getSeller())
                    .append("\n");

            context.append("Delivery: ")
                    .append(product.getDelivery())
                    .append("\n");

            context.append("EMI: ")
                    .append(product.getEmi())
                    .append("\n");

            context.append("Warranty: ")
                    .append(product.getWarranty())
                    .append("\n");

            if (product.getCategory() != null) {
                context.append("Category: ")
                        .append(product.getCategory().getName())
                        .append("\n");
            }

            if (product.getSubCategory() != null) {
                context.append("Subcategory: ")
                        .append(product.getSubCategory().getName())
                        .append("\n");
            }

            context.append("Description: ")
                    .append(product.getDescription())
                    .append("\n");

            context.append("--------------------------------\n");
        }

        return context.toString();
    }
}