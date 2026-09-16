package com.shopsphere.cntrl;

import com.shopsphere.model.OrderItem;
import com.shopsphere.service.OrderItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/order-items")
public class OrderItemController {

    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    // 📦 Get items by orderId
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Map<String, Object>> getByOrder(@PathVariable Long orderId) {

        List<OrderItem> items = orderItemService.getItemsByOrderId(orderId);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("status", 200);
        res.put("message", "Order items fetched");
        res.put("data", items);

        return ResponseEntity.ok(res);
    }

    // 👤 Get items by userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getByUser(@PathVariable Long userId) {

        List<OrderItem> items = orderItemService.getItemsByUserId(userId);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("status", 200);
        res.put("message", "User order items fetched");
        res.put("data", items);

        return ResponseEntity.ok(res);
    }

    // 📦 Get items by productId
    @GetMapping("/product/{productId}")
    public ResponseEntity<Map<String, Object>> getByProduct(@PathVariable Long productId) {

        List<OrderItem> items = orderItemService.getItemsByProductId(productId);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("status", 200);
        res.put("message", "Product order items fetched");
        res.put("data", items);

        return ResponseEntity.ok(res);
    }
}