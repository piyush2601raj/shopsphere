package com.shopsphere.service.impl;

import com.shopsphere.model.OrderItem;
import com.shopsphere.repository.OrderItemRepository;
import com.shopsphere.service.OrderItemService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemServiceImpl implements OrderItemService {

    private final OrderItemRepository orderItemRepository;

    public OrderItemServiceImpl(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    // 📦 Get items by order
    @Override
    public List<OrderItem> getItemsByOrderId(Long orderId) {
        return orderItemRepository.findByOrder_Id(orderId);
    }

    // 👤 Get items by user
    @Override
    public List<OrderItem> getItemsByUserId(Long userId) {
        return orderItemRepository.findByOrder_User_Id(userId);
    }

    // 📦 Get items by product
    @Override
    public List<OrderItem> getItemsByProductId(Long productId) {
        return orderItemRepository.findByProduct_Id(productId);
    }
}