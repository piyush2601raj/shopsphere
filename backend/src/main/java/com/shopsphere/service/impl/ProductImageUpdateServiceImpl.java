package com.shopsphere.service.impl;

import com.shopsphere.model.Product;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.service.ProductImageUpdateService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductImageUpdateServiceImpl
        implements ProductImageUpdateService {

    private final ProductRepository productRepository;

    public ProductImageUpdateServiceImpl(
            ProductRepository productRepository) {

        this.productRepository = productRepository;
    }


    // =====================================================
    // UPDATE ALL PRODUCTS
    // =====================================================

    @Override
    public int updateAllProductImages() {

        List<Product> products =
                productRepository.findAll();

        int updatedCount = 0;


        for (Product product : products) {

            String imageUrl =
                    generateProductImageUrl(product);


            if (imageUrl != null) {

                product.setImageUrl(imageUrl);

                updatedCount++;


                System.out.println(
                        "IMAGE UPDATED: "
                                + product.getId()
                                + " | "
                                + product.getName()
                                + " | "
                                + imageUrl
                );
            }
        }


        productRepository.saveAll(products);


        System.out.println(
                "TOTAL IMAGES UPDATED: "
                        + updatedCount
        );


        return updatedCount;
    }


    // =====================================================
    // TEST ONLY 5 PRODUCTS
    // =====================================================

    @Override
    public int updateTestProductImages() {

        List<Product> products =
                productRepository.findAll()
                        .stream()
                        .limit(5)
                        .toList();


        int updatedCount = 0;


        for (Product product : products) {

            String imageUrl =
                    generateProductImageUrl(product);


            if (imageUrl != null) {

                product.setImageUrl(imageUrl);

                updatedCount++;


                System.out.println(
                        "TEST IMAGE UPDATED: "
                                + product.getId()
                                + " | "
                                + product.getName()
                                + " | "
                                + imageUrl
                );
            }
        }


        productRepository.saveAll(products);


        return updatedCount;
    }


    // =====================================================
    // GENERATE PRODUCT IMAGE URL
    // =====================================================

    private String generateProductImageUrl(
            Product product) {


        if (product == null) {

            return "/Products/fallback.jpg";
        }


        String productName =

                product.getName() != null

                        ? product
                        .getName()
                        .toLowerCase()

                        : "";


        String brand =

                product.getBrand() != null

                        ? product
                        .getBrand()
                        .toLowerCase()

                        : "";


        // =================================================
        // FASHION - WATCHES
        // =================================================


        if (productName.contains("titan")
                || brand.contains("titan")) {

            return "/Products/fashion/titan.png";
        }


        if (productName.contains("fastrack")
                || brand.contains("fastrack")) {

            return "/Products/fashion/fastrack.png";
        }


        if (productName.contains("casio")
                || brand.contains("casio")) {

            return "/Products/fashion/casio.png";
        }


        if (productName.contains("timex")
                || brand.contains("timex")) {

            return "/Products/fashion/timex.png";
        }


        if (productName.contains("sonata")
                || brand.contains("sonata")) {

            return "/Products/fashion/sonata.png";
        }


        if (productName.contains("noise")
                || brand.contains("noise")) {

            return "/Products/fashion/noise.png";
        }


        // =================================================
        // ELECTRONICS - LAPTOP
        // =================================================


        if (productName.contains("dell")) {

            return "/Products/laptop.png";
        }


        if (productName.contains("lenovo")) {

            return "/Products/laptop.png";
        }


        if (productName.contains("hp ")) {

            return "/Products/laptop.png";
        }


        if (productName.contains("asus")) {

            return "/Products/laptop.png";
        }


        if (productName.contains("acer")) {

            return "/Products/laptop.png";
        }


        // =================================================
        // HOME APPLIANCES
        // =================================================


        if (productName.contains("refrigerator")) {

            return "/Products/refrigerator.png";
        }


        if (productName.contains("washing machine")) {

            return "/Products/washingmachine.png";
        }


        if (productName.contains("air conditioner")
                || productName.contains(" ac ")) {

            return "/Products/airconditioner.png";
        }


        if (productName.contains("television")
                || productName.contains("smart tv")) {

            return "/Products/television.png";
        }


        if (productName.contains("microwave")) {

            return "/Products/microwave.png";
        }


        if (productName.contains("water purifier")) {

            return "/Products/waterpurifier.png";
        }


        if (productName.contains("vacuum cleaner")) {

            return "/Products/vacuumcleaner.png";
        }


        if (productName.contains("geyser")) {

            return "/Products/geyser.png";
        }


        // =================================================
        // SUBCATEGORY FALLBACK
        // =================================================


        if (product.getSubCategory() != null
                && product
                .getSubCategory()
                .getName() != null) {


            String subCategory =

                    product
                    .getSubCategory()
                    .getName()
                    .toLowerCase();


            if (subCategory.equals("laptop")) {

                return "/Products/laptop.png";
            }


            if (subCategory.equals("mobile")) {

                return "/Products/mobile.png";
            }


            if (subCategory.equals("monitor")) {

                return "/Products/monitor.png";
            }


            if (subCategory.equals("mouse")) {

                return "/Products/mouse.png";
            }


            if (subCategory.equals("keyboard")) {

                return "/Products/keyboard.png";
            }


            if (subCategory.equals("tablet")) {

                return "/Products/tablet.png";
            }


            if (subCategory.equals("smart watch")) {

                return "/Products/smartwatch.png";
            }


            if (subCategory.equals("headphones")) {

                return "/Products/headphones.png";
            }


            if (subCategory.equals("t-shirts")) {

                return "/Products/tshirt.png";
            }


            if (subCategory.equals("shirts")) {

                return "/Products/shirt.png";
            }


            if (subCategory.equals("jeans")) {

                return "/Products/jeans.png";
            }


            if (subCategory.equals("shoes")) {

                return "/Products/shoes.png";
            }


            if (subCategory.equals("dresses")) {

                return "/Products/dress.png";
            }


            if (subCategory.equals("handbags")) {

                return "/Products/handbag.png";
            }


            if (subCategory.equals("hoodies")) {

                return "/Products/hoodie.png";
            }


            if (subCategory.equals("jackets")) {

                return "/Products/jacket.png";
            }


            if (subCategory.equals("watches")) {

                return "/Products/watches.png";
            }


            if (subCategory.equals("sunglasses")) {

                return "/Products/sunglasses.png";
            }


            if (subCategory.equals("wallets")) {

                return "/Products/wallets.png";
            }


            if (subCategory.equals("belts")) {

                return "/Products/belts.png";
            }


            if (subCategory.equals("caps")) {

                return "/Products/caps.png";
            }


            if (subCategory.equals("perfumes")) {

                return "/Products/perfumes.png";
            }


            if (subCategory.equals("jewellery")) {

                return "/Products/jewellery.png";
            }


            if (subCategory.equals("refrigerators")) {

                return "/Products/refrigerator.png";
            }


            if (subCategory.equals("washing machines")) {

                return "/Products/washingmachine.png";
            }


            if (subCategory.equals("air conditioners")) {

                return "/Products/airconditioner.png";
            }


            if (subCategory.equals("televisions")) {

                return "/Products/television.png";
            }


            if (subCategory.equals("microwave ovens")) {

                return "/Products/microwave.png";
            }


            if (subCategory.equals("water purifiers")) {

                return "/Products/waterpurifier.png";
            }


            if (subCategory.equals("vacuum cleaners")) {

                return "/Products/vacuumcleaner.png";
            }


            if (subCategory.equals("geysers")) {

                return "/Products/geyser.png";
            }
        }


        // =================================================
        // FINAL FALLBACK
        // =================================================


        return "/Products/fallback.jpg";
    }
}