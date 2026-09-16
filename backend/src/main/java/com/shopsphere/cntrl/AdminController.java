package com.shopsphere.cntrl;

import com.shopsphere.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // 🔐 LOGIN
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> req) {
        return adminService.login(req);
    }

    // 📊 DASHBOARD
    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        return adminService.getDashboard();
    }

    // 👤 USERS
    @GetMapping("/users")
    public List<Map<String, Object>> getUsers() {
        return adminService.getAllUsers();
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {
        return adminService.deleteUser(id);
    }

    // 📦 ORDERS
    @GetMapping("/orders")
    public List<Map<String, Object>> getOrders() {
        return adminService.getAllOrders();
    }

    @PutMapping("/orders/{id}/status")
    public String updateOrderStatus(@PathVariable Long id,
                                     @RequestParam String status) {
        return adminService.updateOrderStatus(id, status);
    }

    // 💳 PAYMENTS (RAZORPAY TRACKING)
    @GetMapping("/payments")
    public List<Map<String, Object>> payments() {
        return adminService.getAllPayments();
    }
}