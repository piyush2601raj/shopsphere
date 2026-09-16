package com.shopsphere.service;

import com.shopsphere.model.OrderItem;
import java.util.List;

public interface OrderItemService {

    // 📦 Get items by order
    List<OrderItem> getItemsByOrderId(Long orderId);

    // 👤 Get items by user
    List<OrderItem> getItemsByUserId(Long userId);

    // 📦 Get items by product
    List<OrderItem> getItemsByProductId(Long productId);
}