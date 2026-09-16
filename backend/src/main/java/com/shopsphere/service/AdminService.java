package com.shopsphere.service;

import java.util.Map;
import java.util.List;

public interface AdminService {

    Map<String, Object> login(Map<String, String> req);

    Map<String, Object> getDashboard();

    List<Map<String, Object>> getAllUsers();

    String deleteUser(Long id);

    List<Map<String, Object>> getAllOrders();

    String updateOrderStatus(Long id, String status);

    List<Map<String, Object>> getAllPayments();
}