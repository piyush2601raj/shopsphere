package com.shopsphere.service.impl;

import com.shopsphere.model.Product;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.service.ProductService;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // ======================================================
    // ADD SINGLE PRODUCT
    // ======================================================

    @Override
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // ======================================================
    // ADD MULTIPLE PRODUCTS
    // ======================================================

    @Override
    public List<Product> addAllProducts(List<Product> products) {
        return productRepository.saveAll(products);
    }

    // ======================================================
    // GET ALL PRODUCTS
    // ======================================================

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // ======================================================
    // GET PRODUCTS BY CATEGORY
    // ======================================================

    @Override
    public List<Product> getProductsByCategory(String name) {
        return productRepository.findByCategory_Name(name);
    }

    // ======================================================
    // GET PRODUCT BY ID
    // ======================================================

    @Override
    public Product getProductById(Long id) {
        return productRepository
                .findById(id)
                .orElse(null);
    }

    // ======================================================
    // SMART PRODUCT SEARCH
    // ======================================================

    @Override
    public List<Product> searchProducts(String query) {

        // ==================================================
        // 1. EMPTY QUERY
        // ==================================================

        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }

        // ==================================================
        // 2. NORMALIZE QUERY
        // ==================================================

        String searchText =
                query
                        .trim()
                        .toLowerCase(Locale.ROOT);

        // ==================================================
        // 3. GET ALL PRODUCTS
        // ==================================================

        List<Product> products =
                productRepository.findAll();

        // ==================================================
        // 4. CHECK COMPARISON QUERY
        // ==================================================

        boolean comparisonQuery =
                isComparisonQuery(searchText);

        System.out.println("=================================");
        System.out.println(
                "SMART SEARCH QUERY = " + query
        );
        System.out.println(
                "COMPARISON QUERY = " + comparisonQuery
        );
        System.out.println("=================================");

        // ==================================================
        // 5. COMPARISON SEARCH
        // ==================================================

        if (comparisonQuery) {

            List<Product> comparisonResults =
                    searchComparisonProducts(
                            searchText,
                            products
                    );

            System.out.println("=================================");

            System.out.println(
                    "COMPARISON RESULT COUNT = "
                            + comparisonResults.size()
            );

            comparisonResults.forEach(product ->
                    System.out.println(
                            "COMPARISON RESULT = "
                                    + product.getName()
                                    + " | ID = "
                                    + product.getId()
                                    + " | BRAND = "
                                    + product.getBrand()
                                    + " | PRICE = ₹"
                                    + product.getPrice()
                                    + " | RATING = "
                                    + product.getRating()
                    )
            );

            System.out.println("=================================");

            return comparisonResults;
        }

        // ==================================================
        // 6. EXTRACT MAXIMUM PRICE
        // ==================================================

        Double maxPrice = null;

        Pattern pricePattern =
                Pattern.compile(
                        "(?:under|below|less than|upto|up to)"
                                + "\\s*(?:₹|rs\\.?|inr)?"
                                + "\\s*([\\d,]+)",
                        Pattern.CASE_INSENSITIVE
                );

        Matcher priceMatcher =
                pricePattern.matcher(searchText);

        if (priceMatcher.find()) {

            String priceValue =
                    priceMatcher
                            .group(1)
                            .replace(",", "");

            try {

                maxPrice =
                        Double.parseDouble(priceValue);

            } catch (NumberFormatException ignored) {

                maxPrice = null;
            }
        }

        // ==================================================
        // 7. REMOVE PRICE CONDITION
        // ==================================================

        String keywordText =
                searchText.replaceAll(
                        "(?:under|below|less than|upto|up to)"
                                + "\\s*(?:₹|rs\\.?|inr)?"
                                + "\\s*[\\d,]+",
                        ""
                ).trim();

        // ==================================================
        // 8. SPLIT QUERY
        // ==================================================

        String[] words =
                keywordText.split("\\s+");

        // ==================================================
        // 9. IGNORED WORDS
        // ==================================================

        Set<String> ignoredWords =
                Set.of(
                        "show",
                        "me",
                        "find",
                        "best",
                        "products",
                        "product",
                        "please",
                        "give",
                        "some",
                        "the",
                        "compare",
                        "comparison",
                        "between",
                        "and",
                        "or",
                        "vs",
                        "versus",
                        "tell",
                        "about",
                        "what",
                        "which",
                        "are",
                        "is",
                        "for",
                        "with",
                        "can",
                        "could",
                        "would",
                        "should",
                        "under",
                        "below",
                        "less",
                        "than",
                        "upto",
                        "up",
                        "to",
                        "i",
                        "want",
                        "need",
                        "looking",
                        "look",
                        "get",

                        // Search intent
                        "deals",
                        "deal",
                        "options",
                        "option",
                        "recommend",
                        "recommendation",
                        "recommendations"
                );

        // ==================================================
        // 10. CREATE SEARCH WORDS
        // ==================================================

        List<String> searchWords =
                Arrays.stream(words)
                        .map(word ->
                                word.replaceAll(
                                        "[^a-zA-Z0-9]",
                                        ""
                                )
                        )
                        .map(String::trim)
                        .filter(word ->
                                !word.isEmpty()
                        )
                        .filter(word ->
                                word.length() > 1
                        )
                        .filter(word ->
                                !ignoredWords.contains(word)
                        )
                        .collect(Collectors.toList());

        final Double finalMaxPrice =
                maxPrice;

        // ==================================================
        // 11. PRODUCT TYPE DETECTION
        // ==================================================

        boolean laptopQuery =
                searchWords.contains("laptop")
                        || searchWords.contains("laptops");

        boolean mobileQuery =
                searchWords.contains("mobile")
                        || searchWords.contains("mobiles")
                        || searchWords.contains("phone")
                        || searchWords.contains("phones");

        boolean monitorQuery =
                searchWords.contains("monitor")
                        || searchWords.contains("monitors");

        boolean keyboardQuery =
                searchWords.contains("keyboard")
                        || searchWords.contains("keyboards");

        boolean mouseQuery =
                searchWords.contains("mouse")
                        || searchWords.contains("mice");

        boolean tabletQuery =
                searchWords.contains("tablet")
                        || searchWords.contains("tablets");

        boolean headphoneQuery =
                searchWords.contains("headphone")
                        || searchWords.contains("headphones");

        boolean gamingQuery =
                searchWords.contains("gaming")
                        || searchWords.contains("gamer")
                        || searchWords.contains("game");

        // ==================================================
        // 12. PRICE / RANKING INTENT
        // ==================================================

        boolean cheapestQuery =
                searchText.matches(".*\\bcheapest\\b.*")
                        || searchText.matches(".*\\blowest price\\b.*")
                        || searchText.matches(".*\\blow price\\b.*")
                        || searchText.matches(".*\\bbudget\\b.*");

        boolean expensiveQuery =
                searchText.matches(".*\\bmost expensive\\b.*")
                        || searchText.matches(".*\\bhighest price\\b.*")
                        || searchText.matches(".*\\bexpensive\\b.*");

        /*
         * IMPORTANT:
         *
         * Do NOT use:
         *
         * searchText.contains("top")
         *
         * because "laptop" contains "top".
         *
         * We use word boundaries.
         */

        boolean bestQuery =
                searchText.matches(".*\\bbest\\b.*")
                        || searchText.matches(".*\\btop\\b.*")
                        || searchText.matches(".*\\bhighest rated\\b.*")
                        || searchText.matches(".*\\btop rated\\b.*");

        // ==================================================
        // 13. DETECT BRAND
        // ==================================================

        String requestedBrand = null;

        Set<String> supportedBrands =
                Set.of(
                        "dell",
                        "lenovo",
                        "hp",
                        "asus",
                        "acer",
                        "apple",
                        "msi",
                        "samsung",
                        "oneplus",
                        "xiaomi",
                        "redmi",
                        "realme",
                        "vivo",
                        "oppo",
                        "google",
                        "nothing",
                        "motorola",
                        "iqoo"
                );

        for (String word : searchWords) {

            if (supportedBrands.contains(word)) {

                requestedBrand = word;
                break;
            }
        }

        final String finalRequestedBrand =
                requestedBrand;

        // ==================================================
        // 14. DEBUG SEARCH INFORMATION
        // ==================================================

        System.out.println("=================================");

        System.out.println(
                "SEARCH WORDS = "
                        + searchWords
        );

        System.out.println(
                "MAX PRICE = "
                        + finalMaxPrice
        );

        System.out.println(
                "LAPTOP QUERY = "
                        + laptopQuery
        );

        System.out.println(
                "MOBILE QUERY = "
                        + mobileQuery
        );

        System.out.println(
                "MONITOR QUERY = "
                        + monitorQuery
        );

        System.out.println(
                "KEYBOARD QUERY = "
                        + keyboardQuery
        );

        System.out.println(
                "MOUSE QUERY = "
                        + mouseQuery
        );

        System.out.println(
                "TABLET QUERY = "
                        + tabletQuery
        );

        System.out.println(
                "HEADPHONE QUERY = "
                        + headphoneQuery
        );

        System.out.println(
                "GAMING QUERY = "
                        + gamingQuery
        );

        System.out.println(
                "CHEAPEST QUERY = "
                        + cheapestQuery
        );

        System.out.println(
                "EXPENSIVE QUERY = "
                        + expensiveQuery
        );

        System.out.println(
                "BEST QUERY = "
                        + bestQuery
        );

        System.out.println(
                "REQUESTED BRAND = "
                        + finalRequestedBrand
        );

        System.out.println("=================================");

        // ==================================================
        // 15. FILTER PRODUCTS
        // ==================================================

        List<Product> filteredResults =
                products.stream()
                        .filter(product -> {

                            // ======================================
                            // PRICE FILTER
                            // ======================================

                            if (finalMaxPrice != null
                                    && product.getPrice()
                                    > finalMaxPrice) {

                                return false;
                            }

                            // ======================================
                            // PRODUCT FIELDS
                            // ======================================

                            String name =
                                    safe(product.getName());

                            String brand =
                                    safe(product.getBrand());

                            String description =
                                    safe(product.getDescription());

                            String category = "";

                            if (product.getCategory() != null) {

                                category =
                                        safe(
                                                product
                                                        .getCategory()
                                                        .getName()
                                        );
                            }

                            String subCategory = "";

                            if (product.getSubCategory() != null) {

                                subCategory =
                                        safe(
                                                product
                                                        .getSubCategory()
                                                        .getName()
                                        );
                            }

                            // ======================================
                            // BRAND FILTER
                            // ======================================

                            if (finalRequestedBrand != null
                                    && !brand.equals(
                                            finalRequestedBrand
                                    )) {

                                return false;
                            }

                            // ======================================
                            // LAPTOP SEARCH
                            // ======================================

                            if (laptopQuery) {

                                // ----------------------------------
                                // EXCLUDE LAPTOP BAGS
                                // ----------------------------------

                                boolean isBag =
                                        name.contains("backpack")
                                                || name.contains("laptop bag")
                                                || name.contains("laptop backpack")
                                                || name.contains("bag");

                                boolean isBagCategory =
                                        category.contains("backpack")
                                                || category.contains("bag");

                                boolean isBagSubCategory =
                                        subCategory.contains("backpack")
                                                || subCategory.contains("bag");

                                if (isBag
                                        || isBagCategory
                                        || isBagSubCategory) {

                                    return false;
                                }

                                // ----------------------------------
                                // ACTUAL LAPTOP
                                // ----------------------------------

                                boolean isLaptop =
                                        name.contains("laptop")
                                                || subCategory.contains("laptop")
                                                || category.contains("laptop");

                                if (!isLaptop) {
                                    return false;
                                }

                                // ----------------------------------
                                // GAMING LAPTOP
                                // ----------------------------------

                                if (gamingQuery) {

                                    boolean gamingProduct =
                                            name.contains("gaming")
                                                    || subCategory.contains("gaming")
                                                    || category.contains("gaming")
                                                    || description.contains("gaming")
                                                    || description.contains("rtx")
                                                    || description.contains("gtx");

                                    if (!gamingProduct) {
                                        return false;
                                    }
                                }

                                return true;
                            }

                            // ======================================
                            // MOBILE SEARCH
                            // ======================================

                            if (mobileQuery) {

                                /*
                                 * Mobile subcategory ID = 94
                                 */

                                boolean isMobile =
                                        product.getSubCategory() != null
                                                && product
                                                .getSubCategory()
                                                .getId() != null
                                                && product
                                                .getSubCategory()
                                                .getId()
                                                .equals(94L);

                                if (!isMobile) {
                                    return false;
                                }

                                // ----------------------------------
                                // ACCESSORY PROTECTION
                                // ----------------------------------

                                boolean isAccessory =
                                        name.contains("cover")
                                                || name.contains("case")
                                                || name.contains("charger")
                                                || name.contains("cable")
                                                || name.contains("holder")
                                                || name.contains("screen protector")
                                                || name.contains("tempered glass");

                                if (isAccessory) {
                                    return false;
                                }

                                return true;
                            }

                            // ======================================
                            // MONITOR SEARCH
                            // ======================================

                            if (monitorQuery) {

                                boolean isMonitor =
                                        name.contains("monitor")
                                                || subCategory.contains("monitor");

                                return isMonitor;
                            }

                            // ======================================
                            // KEYBOARD SEARCH
                            // ======================================

                            if (keyboardQuery) {

                                boolean isKeyboard =
                                        name.contains("keyboard")
                                                || subCategory.contains("keyboard");

                                return isKeyboard;
                            }

                            // ======================================
                            // MOUSE SEARCH
                            // ======================================

                            if (mouseQuery) {

                                boolean isMouse =
                                        name.contains("mouse")
                                                || subCategory.contains("mouse");

                                return isMouse;
                            }

                            // ======================================
                            // TABLET SEARCH
                            // ======================================

                            if (tabletQuery) {

                                boolean isTablet =
                                        name.contains("tablet")
                                                || subCategory.contains("tablet");

                                return isTablet;
                            }

                            // ======================================
                            // HEADPHONE SEARCH
                            // ======================================

                            if (headphoneQuery) {

                                boolean isHeadphone =
                                        name.contains("headphone")
                                                || subCategory.contains("headphone")
                                                || category.contains("headphone");

                                return isHeadphone;
                            }

                            // ======================================
                            // GAMING SEARCH
                            // ======================================

                            if (gamingQuery) {

                                boolean gamingProduct =
                                        name.contains("gaming")
                                                || subCategory.contains("gaming")
                                                || category.contains("gaming")
                                                || description.contains("gaming")
                                                || description.contains("rtx")
                                                || description.contains("gtx");

                                return gamingProduct;
                            }

                            // ======================================
                            // GENERAL SEARCH
                            // ======================================

                            if (searchWords.isEmpty()) {
                                return true;
                            }

                            String searchableText =
                                    name + " "
                                            + brand + " "
                                            + description + " "
                                            + category + " "
                                            + subCategory;

                            return searchWords.stream()
                                    .allMatch(
                                            searchableText::contains
                                    );

                        })
                        .collect(Collectors.toList());

        // ==================================================
        // 16. REMOVE DUPLICATES
        // ==================================================

        Map<String, Product> uniqueProductMap =
                filteredResults.stream()
                        .collect(
                                Collectors.toMap(
                                        product -> {

                                            String productName =
                                                    safe(
                                                            product.getName()
                                                    );

                                            String productBrand =
                                                    safe(
                                                            product.getBrand()
                                                    );

                                            String productPrice =
                                                    String.valueOf(
                                                            product.getPrice()
                                                    );

                                            return productName
                                                    + "|"
                                                    + productBrand
                                                    + "|"
                                                    + productPrice;
                                        },

                                        product -> product,

                                        // Keep first duplicate
                                        (first, second) -> first,

                                        LinkedHashMap::new
                                )
                        );

        // ==================================================
        // 17. RANKING
        // ==================================================

        List<Product> results =
                uniqueProductMap
                        .values()
                        .stream()
                        .sorted(

                                // ----------------------------------
                                // CHEAPEST
                                // ----------------------------------

                                cheapestQuery
                                        ? Comparator.comparingDouble(
                                                Product::getPrice
                                        )

                                        // ----------------------------------
                                        // MOST EXPENSIVE
                                        // ----------------------------------

                                        : expensiveQuery
                                        ? Comparator.comparingDouble(
                                                Product::getPrice
                                        ).reversed()

                                        // ----------------------------------
                                        // BEST / TOP RATED
                                        // ----------------------------------

                                        : bestQuery
                                        ? Comparator.comparingDouble(
                                                Product::getRating
                                        ).reversed()

                                        // ----------------------------------
                                        // DEFAULT
                                        // ----------------------------------

                                        : Comparator.comparing(
                                                Product::getId
                                        )
                        )

                        // Maximum 20 unique products
                        .limit(20)

                        .collect(Collectors.toList());

        // ==================================================
        // 18. DEBUG FINAL RESULTS
        // ==================================================

        System.out.println("=================================");

        System.out.println(
                "FILTERED RESULT COUNT = "
                        + filteredResults.size()
        );

        System.out.println(
                "FINAL UNIQUE RESULT COUNT = "
                        + results.size()
        );

        System.out.println(
                "DUPLICATES REMOVED = "
                        + (
                        filteredResults.size()
                                - results.size()
                )
        );

        results.forEach(product -> {

            String categoryName =
                    product.getCategory() != null
                            ? product.getCategory().getName()
                            : "NULL";

            String subCategoryName =
                    product.getSubCategory() != null
                            ? product.getSubCategory().getName()
                            : "NULL";

            Long subCategoryId =
                    product.getSubCategory() != null
                            ? product.getSubCategory().getId()
                            : null;

            System.out.println(
                    "RESULT = "
                            + product.getName()
                            + " | ID = "
                            + product.getId()
                            + " | BRAND = "
                            + product.getBrand()
                            + " | PRICE = ₹"
                            + product.getPrice()
                            + " | RATING = "
                            + product.getRating()
                            + " | CATEGORY = "
                            + categoryName
                            + " | SUBCATEGORY ID = "
                            + subCategoryId
                            + " | SUBCATEGORY = "
                            + subCategoryName
            );
        });

        System.out.println("=================================");

        return results;
    }

    // ======================================================
    // COMPARISON QUERY DETECTION
    // ======================================================

    private boolean isComparisonQuery(String searchText) {

        if (searchText == null || searchText.isBlank()) {
            return false;
        }

        return searchText.matches(".*\\bcompare\\b.*")
                || searchText.matches(".*\\bcomparison\\b.*")
                || searchText.matches(".*\\bvs\\b.*")
                || searchText.matches(".*\\bversus\\b.*")
                || searchText.matches(".*\\bbetween\\b.*\\band\\b.*")
                || searchText.matches(".*\\bor\\b.*")
                || (
                        searchText.contains("better")
                                && searchText.contains(" or ")
                );
    }

    // ======================================================
    // COMPARISON PRODUCT SEARCH
    // ======================================================

    private List<Product> searchComparisonProducts(
            String searchText,
            List<Product> products
    ) {

        Double maxPrice = null;

        Pattern pricePattern =
                Pattern.compile(
                        "(?:under|below|less than|upto|up to)"
                                + "\\s*(?:₹|rs\\.?|inr)?"
                                + "\\s*([\\d,]+)",
                        Pattern.CASE_INSENSITIVE
                );

        Matcher priceMatcher =
                pricePattern.matcher(searchText);

        if (priceMatcher.find()) {

            try {

                maxPrice =
                        Double.parseDouble(
                                priceMatcher
                                        .group(1)
                                        .replace(",", "")
                        );

            } catch (NumberFormatException ignored) {

                maxPrice = null;
            }
        }

        // ==================================================
        // REMOVE "COMPARE"
        // ==================================================

        String comparisonText =
                searchText
                        .replaceFirst(
                                "^\\s*(?:compare|comparison)\\s+",
                                ""
                        )
                        .trim();

        // ==================================================
        // REMOVE PRICE CONDITION
        // ==================================================

        comparisonText =
                comparisonText.replaceAll(
                        "(?:under|below|less than|upto|up to)"
                                + "\\s*(?:₹|rs\\.?|inr)?"
                                + "\\s*[\\d,]+",
                        ""
                )
                .trim();

        // ==================================================
        // REMOVE "BETWEEN"
        // ==================================================

        comparisonText =
                comparisonText.replaceFirst(
                        "^\\s*between\\s+",
                        ""
                )
                .trim();

        // ==================================================
        // DETECT PRODUCT TYPE FROM COMPLETE QUERY
        // ==================================================

        String comparisonType =
                detectComparisonTypeFromQuery(
                        comparisonText
                );

        System.out.println("=================================");

        System.out.println(
                "COMPARISON FULL QUERY = "
                        + comparisonText
        );

        System.out.println(
                "DETECTED PRODUCT TYPE = "
                        + comparisonType
        );

        System.out.println(
                "COMPARISON MAX PRICE = "
                        + maxPrice
        );

        System.out.println("=================================");

        // ==================================================
        // SPLIT TWO PRODUCT SEARCHES
        // ==================================================

        String[] productParts =
                comparisonText.split(
                        "\\s+(?:and|or|vs|versus|with)\\s+",
                        2
                );

        if (productParts.length < 2) {

            System.out.println(
                    "COMPARISON COULD NOT SPLIT QUERY = "
                            + comparisonText
            );

            return List.of();
        }

        String firstProductQuery =
                cleanComparisonPart(
                        productParts[0]
                );

        String secondProductQuery =
                cleanComparisonPart(
                        productParts[1]
                );

        System.out.println(
                "COMPARISON PART 1 = "
                        + firstProductQuery
        );

        System.out.println(
                "COMPARISON PART 2 = "
                        + secondProductQuery
        );

        // ==================================================
        // SEARCH FIRST PRODUCT
        // ==================================================

        List<Product> firstProducts =
                findProductsForComparison(
                        firstProductQuery,
                        products,
                        maxPrice,
                        comparisonType
                );

        // ==================================================
        // FALLBACK TYPE DETECTION
        // ==================================================

        if ("unknown".equals(comparisonType)) {

            comparisonType =
                    detectComparisonProductType(
                            firstProducts
                    );

            System.out.println(
                    "FALLBACK COMPARISON TYPE = "
                            + comparisonType
            );
        }

        // ==================================================
        // SEARCH SECOND PRODUCT
        // ==================================================

        List<Product> secondProducts =
                findProductsForComparison(
                        secondProductQuery,
                        products,
                        maxPrice,
                        comparisonType
                );

        // ==================================================
        // COMBINE BOTH RESULTS
        // ==================================================

        List<Product> combinedResults =
                java.util.stream.Stream
                        .concat(
                                firstProducts.stream(),
                                secondProducts.stream()
                        )
                        .collect(Collectors.toList());

        // ==================================================
        // REMOVE DUPLICATES
        // ==================================================

        Map<String, Product> uniqueMap =
                combinedResults.stream()
                        .collect(
                                Collectors.toMap(
                                        product -> {

                                            String name =
                                                    safe(
                                                            product.getName()
                                                    );

                                            String brand =
                                                    safe(
                                                            product.getBrand()
                                                    );

                                            String price =
                                                    String.valueOf(
                                                            product.getPrice()
                                                    );

                                            return name
                                                    + "|"
                                                    + brand
                                                    + "|"
                                                    + price;
                                        },

                                        product -> product,

                                        (first, second) -> first,

                                        LinkedHashMap::new
                                )
                        );

        // ==================================================
        // DEBUG COMPARISON RESULTS
        // ==================================================

        System.out.println("=================================");

        System.out.println(
                "FIRST SIDE COUNT = "
                        + firstProducts.size()
        );

        System.out.println(
                "SECOND SIDE COUNT = "
                        + secondProducts.size()
        );

        System.out.println(
                "COMBINED COUNT = "
                        + uniqueMap.size()
        );

        uniqueMap.values().forEach(product ->
                System.out.println(
                        "FINAL COMPARISON = "
                                + product.getName()
                                + " | ID = "
                                + product.getId()
                                + " | BRAND = "
                                + product.getBrand()
                                + " | PRICE = ₹"
                                + product.getPrice()
                                + " | TYPE = "
                                + getProductType(product)
                )
        );

        System.out.println("=================================");

        return uniqueMap
                .values()
                .stream()
                .limit(20)
                .collect(Collectors.toList());
    }

    // ======================================================
    // DETECT PRODUCT TYPE FROM COMPLETE COMPARISON QUERY
    // ======================================================

    private String detectComparisonTypeFromQuery(
            String comparisonText
    ) {

        if (comparisonText == null
                || comparisonText.isBlank()) {

            return "unknown";
        }

        String text =
                comparisonText.toLowerCase(Locale.ROOT);

        // ==================================================
        // LAPTOP
        // ==================================================

        if (text.matches(".*\\blaptops?\\b.*")) {
            return "laptop";
        }

        // ==================================================
        // MOBILE
        // ==================================================

        if (text.matches(
                ".*\\b(?:mobile|mobiles|phone|phones)\\b.*"
        )) {
            return "mobile";
        }

        // ==================================================
        // MONITOR
        // ==================================================

        if (text.matches(
                ".*\\bmonitors?\\b.*"
        )) {
            return "monitor";
        }

        // ==================================================
        // KEYBOARD
        // ==================================================

        if (text.matches(
                ".*\\bkeyboards?\\b.*"
        )) {
            return "keyboard";
        }

        // ==================================================
        // MOUSE
        // ==================================================

        if (text.matches(
                ".*\\bmouse\\b.*"
        )
                || text.matches(
                        ".*\\bmice\\b.*"
                )) {

            return "mouse";
        }

        // ==================================================
        // TABLET
        // ==================================================

        if (text.matches(
                ".*\\btablets?\\b.*"
        )) {
            return "tablet";
        }

        // ==================================================
        // HEADPHONE
        // ==================================================

        if (text.matches(
                ".*\\bheadphones?\\b.*"
        )) {
            return "headphone";
        }

        // ==================================================
        // GAMING
        // ==================================================

        if (text.matches(
                ".*\\bgaming\\b.*"
        )) {
            return "gaming";
        }

        return "unknown";
    }
    // ======================================================
    // FIND PRODUCTS FOR COMPARISON
    // ======================================================

    private List<Product> findProductsForComparison(
            String searchQuery,
            List<Product> products,
            Double maxPrice,
            String requiredProductType
    ) {

        if (searchQuery == null
                || searchQuery.isBlank()) {

            return List.of();
        }

        String query =
                searchQuery
                        .trim()
                        .toLowerCase(Locale.ROOT);

        // ==================================================
        // REMOVE COMMON WORDS
        // ==================================================

        query =
                query.replaceAll(
                        "\\b(the|best|product|products|laptop|laptops|mobile|mobiles|phone|phones|monitor|monitors|keyboard|keyboards|mouse|mice|tablet|tablets|headphone|headphones|gaming)\\b",
                        " "
                )
                .replaceAll("\\s+", " ")
                .trim();

        // ==================================================
        // QUERY WORDS
        // ==================================================

        List<String> queryWords =
                Arrays.stream(query.split("\\s+"))
                        .map(word ->
                                word.replaceAll(
                                        "[^a-zA-Z0-9]",
                                        ""
                                )
                        )
                        .filter(word ->
                                !word.isBlank()
                        )
                        .collect(Collectors.toList());

        // ==================================================
        // FIND MATCHING PRODUCTS
        // ==================================================

        List<Product> matchedProducts =
                products.stream()
                        .filter(product -> {

                            // ==================================
                            // PRICE FILTER
                            // ==================================

                            if (maxPrice != null
                                    && product.getPrice()
                                    > maxPrice) {

                                return false;
                            }

                            // ==================================
                            // PRODUCT TYPE FILTER
                            // ==================================

                            if (requiredProductType != null
                                    && !requiredProductType.equals(
                                            "unknown"
                                    )) {

                                String currentType =
                                        getProductType(product);

                                if (!requiredProductType.equals(
                                        currentType
                                )) {

                                    return false;
                                }
                            }

                            // ==================================
                            // PRODUCT INFORMATION
                            // ==================================

                            String name =
                                    safe(
                                            product.getName()
                                    );

                            String brand =
                                    safe(
                                            product.getBrand()
                                    );

                            String description =
                                    safe(
                                            product.getDescription()
                                    );

                            String category = "";

                            if (product.getCategory() != null) {

                                category =
                                        safe(
                                                product
                                                        .getCategory()
                                                        .getName()
                                        );
                            }

                            String subCategory = "";

                            if (product.getSubCategory() != null) {

                                subCategory =
                                        safe(
                                                product
                                                        .getSubCategory()
                                                        .getName()
                                        );
                            }

                            String searchableText =
                                    name + " "
                                            + brand + " "
                                            + description + " "
                                            + category + " "
                                            + subCategory;

                            // ==================================
                            // MATCH QUERY
                            // ==================================

                            if (queryWords.isEmpty()) {
                                return true;
                            }

                            return queryWords.stream()
                                    .allMatch(
                                            searchableText::contains
                                    );
                        })
                        .collect(Collectors.toList());

        // ==================================================
        // FALLBACK:
        // BRAND-BASED MATCH
        // ==================================================

        if (matchedProducts.isEmpty()) {

            matchedProducts =
                    products.stream()
                            .filter(product -> {

                                // ------------------------------
                                // PRICE
                                // ------------------------------

                                if (maxPrice != null
                                        && product.getPrice()
                                        > maxPrice) {

                                    return false;
                                }

                                // ------------------------------
                                // TYPE
                                // ------------------------------

                                if (requiredProductType != null
                                        && !requiredProductType.equals(
                                                "unknown"
                                        )) {

                                    String currentType =
                                            getProductType(product);

                                    if (!requiredProductType.equals(
                                            currentType
                                    )) {

                                        return false;
                                    }
                                }

                                // ------------------------------
                                // BRAND
                                // ------------------------------

                                String brand =
                                        safe(
                                                product.getBrand()
                                        );

                                String name =
                                        safe(
                                                product.getName()
                                        );

                                return queryWords.stream()
                                        .anyMatch(word ->
                                                brand.contains(word)
                                                        || name.contains(word)
                                        );
                            })
                            .collect(Collectors.toList());
        }

        // ==================================================
        // SORT
        // ==================================================

        matchedProducts =
                matchedProducts.stream()
                        .sorted(
                                Comparator
                                        .comparingDouble(
                                                Product::getRating
                                        )
                                        .reversed()
                        )
                        .limit(10)
                        .collect(Collectors.toList());

        // ==================================================
        // DEBUG
        // ==================================================

        System.out.println("---------------------------------");

        System.out.println(
                "COMPARISON SEARCH QUERY = "
                        + searchQuery
        );

        System.out.println(
                "REQUIRED TYPE = "
                        + requiredProductType
        );

        System.out.println(
                "MATCHED PRODUCTS = "
                        + matchedProducts.size()
        );

        matchedProducts.forEach(product ->
                System.out.println(
                        product.getName()
                                + " | "
                                + product.getBrand()
                                + " | ₹"
                                + product.getPrice()
                                + " | TYPE="
                                + getProductType(product)
                )
        );

        System.out.println("---------------------------------");

        return matchedProducts;
    }

    // ======================================================
    // DETECT PRODUCT TYPE FROM PRODUCTS
    // ======================================================

    private String detectComparisonProductType(
            List<Product> products
    ) {

        if (products == null
                || products.isEmpty()) {

            return "unknown";
        }

        for (Product product : products) {

            String type =
                    getProductType(product);

            if (!"unknown".equals(type)) {
                return type;
            }
        }

        return "unknown";
    }

    // ======================================================
    // GET PRODUCT TYPE
    // ======================================================

    private String getProductType(Product product) {

        if (product == null) {
            return "unknown";
        }

        String name =
                safe(product.getName());

        String description =
                safe(product.getDescription());

        String category = "";

        if (product.getCategory() != null) {

            category =
                    safe(
                            product
                                    .getCategory()
                                    .getName()
                    );
        }

        String subCategory = "";

        if (product.getSubCategory() != null) {

            subCategory =
                    safe(
                            product
                                    .getSubCategory()
                                    .getName()
                    );
        }

        String text =
                name + " "
                        + description + " "
                        + category + " "
                        + subCategory;

        // ==================================================
        // LAPTOP
        // ==================================================

        if (text.matches(".*\\blaptops?\\b.*")) {

            return "laptop";
        }

        // ==================================================
        // MOBILE
        // ==================================================

        if (text.matches(
                ".*\\b(?:mobile|mobiles|phone|phones)\\b.*"
        )) {

            return "mobile";
        }

        // ==================================================
        // MONITOR
        // ==================================================

        if (text.matches(
                ".*\\bmonitors?\\b.*"
        )) {

            return "monitor";
        }

        // ==================================================
        // KEYBOARD
        // ==================================================

        if (text.matches(
                ".*\\bkeyboards?\\b.*"
        )) {

            return "keyboard";
        }

        // ==================================================
        // MOUSE
        // ==================================================

        if (text.matches(
                ".*\\bmouse\\b.*"
        )
                || text.matches(
                        ".*\\bmice\\b.*"
                )) {

            return "mouse";
        }

        // ==================================================
        // TABLET
        // ==================================================

        if (text.matches(
                ".*\\btablets?\\b.*"
        )) {

            return "tablet";
        }

        // ==================================================
        // HEADPHONE
        // ==================================================

        if (text.matches(
                ".*\\bheadphones?\\b.*"
        )) {

            return "headphone";
        }

        // ==================================================
        // GAMING
        // ==================================================

        if (text.matches(
                ".*\\bgaming\\b.*"
        )) {

            return "gaming";
        }

        return "unknown";
    }

    // ======================================================
    // CLEAN COMPARISON PART
    // ======================================================

    private String cleanComparisonPart(
            String text
    ) {

        if (text == null) {
            return "";
        }

        String cleaned =
                text
                        .toLowerCase(Locale.ROOT)
                        .trim();

        // ----------------------------------------------
        // REMOVE COMMON STARTING WORDS
        // ----------------------------------------------

        cleaned =
                cleaned.replaceFirst(
                        "^\\s*(?:a|an|the)\\s+",
                        ""
                );

        // ----------------------------------------------
        // REMOVE "IS BETTER"
        // ----------------------------------------------

        cleaned =
                cleaned.replaceAll(
                        "\\s+is\\s+better\\s*$",
                        ""
                );

        // ----------------------------------------------
        // REMOVE QUESTION WORDS
        // ----------------------------------------------

        cleaned =
                cleaned.replaceFirst(
                        "^\\s*(?:which|what)\\s+",
                        ""
                );

        // ----------------------------------------------
        // REMOVE TRAILING QUESTION MARK
        // ----------------------------------------------

        cleaned =
                cleaned.replaceAll(
                        "[?!.]+$",
                        ""
                );

        return cleaned.trim();
    }

    // ======================================================
    // SAFE STRING
    // ======================================================

    private String safe(String value) {

        if (value == null) {
            return "";
        }

        return value
                .toLowerCase(Locale.ROOT)
                .trim();
    }

    // ======================================================
    // DELETE PRODUCT
    // ======================================================

    @Override
    public void deleteProduct(Long id) {

        if (id == null) {
            return;
        }

        if (productRepository.existsById(id)) {

            productRepository.deleteById(id);
        }
    }
}