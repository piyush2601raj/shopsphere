package com.shopsphere.cntrl;

import com.shopsphere.dto.OrderResponseDto;
import com.shopsphere.model.OrderStatus;
import com.shopsphere.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ======================================================
    // PLACE ORDER
    // ======================================================

    @PostMapping("/place/{userId}")
    public ResponseEntity<?> placeOrder(
            @PathVariable Long userId
    ) {

        OrderResponseDto order =
                orderService.placeOrder(userId);

        return buildResponse(
                "Order placed successfully",
                order
        );
    }

    // ======================================================
    // GET ALL ORDERS
    // ======================================================

    @GetMapping
    public ResponseEntity<?> getAllOrders() {

        List<OrderResponseDto> orders =
                orderService.getAllOrders();

        return buildResponse(
                "Orders fetched successfully",
                orders
        );
    }

    // ======================================================
    // GET ORDER BY ID
    // ======================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
            @PathVariable Long id
    ) {

        OrderResponseDto order =
                orderService.getOrderById(id);

        return buildResponse(
                "Order fetched successfully",
                order
        );
    }

    // ======================================================
    // GET ORDERS BY USER
    // ======================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrdersByUser(
            @PathVariable Long userId
    ) {

        List<OrderResponseDto> orders =
                orderService.getOrdersByUser(userId);

        return buildResponse(
                "User orders fetched successfully",
                orders
        );
    }

    // ======================================================
    // UPDATE ORDER STATUS
    // ======================================================

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status
    ) {

        OrderResponseDto updatedOrder =
                orderService.updateStatus(
                        orderId,
                        status
                );

        return buildResponse(
                "Order status updated successfully",
                updatedOrder
        );
    }

    // ======================================================
    // COMMON RESPONSE
    // ======================================================

    private ResponseEntity<Map<String, Object>> buildResponse(
            String message,
            Object data
    ) {

        Map<String, Object> res =
                new LinkedHashMap<>();

        res.put("status", 200);
        res.put("message", message);
        res.put("data", data);

        return ResponseEntity.ok(res);
    }
}