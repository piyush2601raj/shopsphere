package com.shopsphere.cntrl;

import com.shopsphere.dto.UserDto;
import com.shopsphere.model.User;
import com.shopsphere.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(
            UserService userService
    ) {
        this.userService = userService;
    }

    // ================= REGISTER =================

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(
            @RequestBody User user
    ) {

        UserDto savedUser =
                userService.registerUser(user);

        return ResponseEntity
                .status(201)
                .body(savedUser);
    }


    // ================= LOGIN =================

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(
            @RequestBody Map<String, String> request
    ) {

        String email =
                request.get("email");

        String password =
                request.get("password");

        UserDto loggedInUser =
                userService.loginUser(
                        email,
                        password
                );

        return ResponseEntity.ok(
                loggedInUser
        );
    }


    // ================= RESET PASSWORD =================

    @PostMapping("/reset-password/{userId}")
    public ResponseEntity<String> resetPassword(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request
    ) {

        String newPassword =
                request.get("newPassword");

        userService.resetPassword(
                userId,
                newPassword
        );

        return ResponseEntity.ok(
                "Password reset successfully"
        );
    }


    // ================= GET ALL USERS =================

    @GetMapping("/all")
    public ResponseEntity<List<UserDto>>
    getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }


    // ================= GET BY ID =================

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }

}