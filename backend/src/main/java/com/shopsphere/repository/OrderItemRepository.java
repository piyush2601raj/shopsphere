package com.shopsphere.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shopsphere.model.OrderItem;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // 📦 Get all items of a specific order
    List<OrderItem> findByOrder_Id(Long orderId);

    // 👤 Get all items by user (through order)
    List<OrderItem> findByOrder_User_Id(Long userId);

    // 📦 Get items by product (analytics / reports)
    List<OrderItem> findByProduct_Id(Long productId);
}