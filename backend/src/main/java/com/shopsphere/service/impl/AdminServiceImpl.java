package com.shopsphere.service.impl;

import com.shopsphere.service.AdminService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AdminServiceImpl implements AdminService {

    @Override
    public Map<String, Object> login(Map<String, String> req) {

        Map<String, Object> res = new HashMap<>();
        res.put("status", "success");
        res.put("message", "Admin logged in");
        res.put("token", "dummy-jwt-token");
        return res;
    }

    @Override
    public Map<String, Object> getDashboard() {

        Map<String, Object> res = new HashMap<>();
        res.put("totalUsers", 100);
        res.put("totalOrders", 45);
        res.put("totalRevenue", 250000);
        res.put("pendingOrders", 5);
        return res;
    }

    @Override
    public List<Map<String, Object>> getAllUsers() {

        List<Map<String, Object>> users = new ArrayList<>();

        Map<String, Object> u1 = new HashMap<>();
        u1.put("id", 1);
        u1.put("name", "Piyush");
        u1.put("email", "piyush@gmail.com");

        users.add(u1);

        return users;
    }

    @Override
    public String deleteUser(Long id) {
        return "User deleted with id: " + id;
    }

    @Override
    public List<Map<String, Object>> getAllOrders() {

        List<Map<String, Object>> orders = new ArrayList<>();

        Map<String, Object> o1 = new HashMap<>();
        o1.put("id", 101);
        o1.put("amount", 50000);
        o1.put("status", "CREATED");

        orders.add(o1);

        return orders;
    }

    @Override
    public String updateOrderStatus(Long id, String status) {
        return "Order " + id + " updated to " + status;
    }

    @Override
    public List<Map<String, Object>> getAllPayments() {

        List<Map<String, Object>> payments = new ArrayList<>();

        Map<String, Object> p1 = new HashMap<>();
        p1.put("paymentId", "pay_123");
        p1.put("status", "SUCCESS");
        p1.put("amount", 50000);

        payments.add(p1);

        return payments;
    }
}