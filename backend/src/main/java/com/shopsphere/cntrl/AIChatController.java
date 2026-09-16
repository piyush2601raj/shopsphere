package com.shopsphere.cntrl;

import com.shopsphere.dto.AIChatResponse;
import com.shopsphere.dto.OrderResponseDto;
import com.shopsphere.model.KnowledgeDocument;
import com.shopsphere.model.Product;
import com.shopsphere.service.GroqService;
import com.shopsphere.service.KnowledgeService;
import com.shopsphere.service.OrderService;
import com.shopsphere.service.ProductService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIChatController {

    private final GroqService groqService;
    private final ProductService productService;
    private final KnowledgeService knowledgeService;
    private final OrderService orderService;

    public AIChatController(
            GroqService groqService,
            ProductService productService,
            KnowledgeService knowledgeService,
            OrderService orderService
    ) {
        this.groqService = groqService;
        this.productService = productService;
        this.knowledgeService = knowledgeService;
        this.orderService = orderService;
    }

    // ======================================================
    // AI CHAT
    // ======================================================

    @GetMapping("/chat")
    public ResponseEntity<AIChatResponse> chat(
            @RequestParam String message,
            @RequestParam(required = false) Long userId
    ) {

        // ==================================================
        // GET PRODUCTS
        // ==================================================

        List<Product> products =
                productService.searchProducts(message);

        if (products == null) {
            products = List.of();
        }

        // ==================================================
        // DEBUG PRODUCT DATA
        // ==================================================

        System.out.println("=================================");
        System.out.println("AI USER QUERY = " + message);
        System.out.println("AI PRODUCT COUNT = " + products.size());

        products.stream()
                .limit(20)
                .forEach(product ->
                        System.out.println(
                                "AI PRODUCT = "
                                        + product.getName()
                                        + " | ID = "
                                        + product.getId()
                                        + " | BRAND = "
                                        + product.getBrand()
                                        + " | PRICE = ₹"
                                        + product.getPrice()
                                        + " | STOCK = "
                                        + product.getStock()
                        )
                );

        System.out.println("=================================");

        // ==================================================
        // CREATE PRODUCT CONTEXT
        // ==================================================

        StringBuilder productContext =
                new StringBuilder();

        if (products.isEmpty()) {

            productContext.append(
                    "No matching ShopSphere products were found."
            );

        } else {

            products.stream()
                    .limit(10)
                    .forEach(product -> {

                        productContext
                                .append("Product ID: ")
                                .append(product.getId())
                                .append("\n");

                        productContext
                                .append("Product Name: ")
                                .append(safe(product.getName()))
                                .append("\n");

                        productContext
                                .append("Brand: ")
                                .append(safe(product.getBrand()))
                                .append("\n");

                        productContext
                                .append("Price: ₹")
                                .append(product.getPrice())
                                .append("\n");

                        productContext
                                .append("Original Price: ₹")
                                .append(product.getOriginalPrice())
                                .append("\n");

                        productContext
                                .append("Discount: ")
                                .append(product.getDiscount())
                                .append("%")
                                .append("\n");

                        productContext
                                .append("Stock: ")
                                .append(product.getStock())
                                .append("\n");

                        productContext
                                .append("Rating: ")
                                .append(product.getRating())
                                .append("\n");

                        productContext
                                .append("Reviews: ")
                                .append(product.getReviews())
                                .append("\n");

                        productContext
                                .append("Seller: ")
                                .append(safe(product.getSeller()))
                                .append("\n");

                        productContext
                                .append("Delivery: ")
                                .append(safe(product.getDelivery()))
                                .append("\n");

                        productContext
                                .append("EMI: ")
                                .append(safe(product.getEmi()))
                                .append("\n");

                        productContext
                                .append("Warranty: ")
                                .append(safe(product.getWarranty()))
                                .append("\n");

                        productContext
                                .append("Image URL: ")
                                .append(safe(product.getImageUrl()))
                                .append("\n");

                        productContext
                                .append("Description: ")
                                .append(safe(product.getDescription()))
                                .append("\n");

                        if (product.getCategory() != null) {

                            productContext
                                    .append("Category: ")
                                    .append(
                                            safe(
                                                    product.getCategory().getName()
                                            )
                                    )
                                    .append("\n");
                        }

                        if (product.getSubCategory() != null) {

                            productContext
                                    .append("Subcategory: ")
                                    .append(
                                            safe(
                                                    product.getSubCategory().getName()
                                            )
                                    )
                                    .append("\n");
                        }

                        productContext
                                .append("--------------------")
                                .append("\n");
                    });
        }

        // ==================================================
        // GET KNOWLEDGE
        // ==================================================

        List<KnowledgeDocument> knowledgeDocuments =
                knowledgeService.searchKnowledge(message);

        // ==================================================
        // CREATE KNOWLEDGE CONTEXT
        // ==================================================

        StringBuilder knowledgeContext =
                new StringBuilder();

        if (
                knowledgeDocuments == null
                        || knowledgeDocuments.isEmpty()
        ) {

            knowledgeContext.append(
                    "No matching ShopSphere knowledge was found."
            );

        } else {

            knowledgeDocuments.stream()
                    .limit(10)
                    .forEach(document -> {

                        knowledgeContext
                                .append("Type: ")
                                .append(safe(document.getType()))
                                .append("\n");

                        knowledgeContext
                                .append("Title: ")
                                .append(safe(document.getTitle()))
                                .append("\n");

                        knowledgeContext
                                .append("Content: ")
                                .append(safe(document.getContent()))
                                .append("\n");

                        knowledgeContext
                                .append("--------------------")
                                .append("\n");
                    });
        }

        // ==================================================
        // ORDER CONTEXT
        // ==================================================

        StringBuilder orderContext =
                new StringBuilder();

        if (userId == null) {

            orderContext.append(
                    "No user ID was provided. " +
                    "Do not provide user-specific order information."
            );

            // ==================================================
            // DEBUG: USER ID MISSING
            // ==================================================

            System.out.println(
                    "========== AI ORDER DEBUG =========="
            );

            System.out.println(
                    "AI USER ID = NULL"
            );

            System.out.println(
                    "ORDER CONTEXT = NO USER ID"
            );

            System.out.println(
                    "===================================="
            );

        } else {

            try {

                // ==================================================
                // GET USER ORDERS
                // ==================================================

                List<OrderResponseDto> orders =
                        orderService.getOrdersByUser(userId);

                // ==================================================
                // DEBUG ORDER DATA
                // ==================================================

                System.out.println(
                        "========== AI ORDER DEBUG =========="
                );

                System.out.println(
                        "AI USER ID = " + userId
                );

                System.out.println(
                        "AI ORDER COUNT = "
                                + (orders == null
                                ? 0
                                : orders.size())
                );

                if (orders != null && !orders.isEmpty()) {

                    orders.forEach(order -> {

                        System.out.println(
                                "AI ORDER ID = "
                                        + order.getOrderId()
                                        + " | USER ID = "
                                        + order.getUserId()
                                        + " | STATUS = "
                                        + order.getStatus()
                                        + " | TOTAL = ₹"
                                        + order.getTotalAmount()
                        );

                    });

                } else {

                    System.out.println(
                            "AI ORDER = NO ORDERS FOUND"
                    );
                }

                System.out.println(
                        "===================================="
                );

                // ==================================================
                // CREATE ORDER CONTEXT
                // ==================================================

                if (orders == null || orders.isEmpty()) {

                    orderContext.append(
                            "No orders were found for this user."
                    );

                } else {

                    orders.forEach(order -> {

                        orderContext
                                .append("Order ID: ")
                                .append(order.getOrderId())
                                .append("\n");

                        orderContext
                                .append("User ID: ")
                                .append(order.getUserId())
                                .append("\n");

                        orderContext
                                .append("Total Amount: ₹")
                                .append(order.getTotalAmount())
                                .append("\n");

                        orderContext
                                .append("Status: ")
                                .append(safe(order.getStatus()))
                                .append("\n");

                        if (order.getItems() != null) {

                            orderContext
                                    .append("Items:\n");

                            order.getItems()
                                    .forEach(item -> {

                                        orderContext
                                                .append("- Product ID: ")
                                                .append(item.getProductId())
                                                .append("\n");

                                        orderContext
                                                .append("  Product Name: ")
                                                .append(
                                                        safe(
                                                                item.getProductName()
                                                        )
                                                )
                                                .append("\n");

                                        orderContext
                                                .append("  Quantity: ")
                                                .append(item.getQuantity())
                                                .append("\n");

                                        orderContext
                                                .append("  Price: ₹")
                                                .append(item.getPrice())
                                                .append("\n");
                                    });
                        }

                        orderContext
                                .append("--------------------")
                                .append("\n");
                    });
                }

            } catch (Exception e) {

                System.out.println(
                        "ORDER CONTEXT ERROR = "
                                + e.getMessage()
                );

                e.printStackTrace();

                orderContext.append(
                        "Order information could not be retrieved."
                );
            }
        }

        // ==================================================
        // DEBUG FINAL ORDER CONTEXT
        // ==================================================

        System.out.println(
                "========== FINAL ORDER CONTEXT =========="
        );

        System.out.println(
                orderContext
        );

        System.out.println(
                "=========================================="
        );

        // ==================================================
        // SEND EVERYTHING TO GROQ
        // ==================================================

        String response =
                groqService.chat(
                        message,
                        productContext.toString(),
                        knowledgeContext.toString(),
                        orderContext.toString()
                );

        // ==================================================
        // PRODUCT IDS
        // ==================================================

        List<Long> productIds =
                products.stream()
                        .limit(10)
                        .map(Product::getId)
                        .filter(Objects::nonNull)
                        .toList();

        // ==================================================
        // DEBUG PRODUCT IDS
        // ==================================================

        System.out.println(
                "AI PRODUCT IDS = "
                        + productIds
        );

        // ==================================================
        // CREATE RESPONSE
        // ==================================================

        AIChatResponse chatResponse =
                new AIChatResponse(
                        response,
                        productIds
                );

        return ResponseEntity.ok(
                chatResponse
        );
    }

    // ======================================================
    // SAFE STRING
    // ======================================================

    private String safe(String value) {

        return value == null
                ? "Not available"
                : value;
    }
}