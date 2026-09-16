package com.shopsphere.service.impl;

import com.shopsphere.dto.CartDto;
import com.shopsphere.dto.CartItemDto;
import com.shopsphere.dto.UserDto;
import com.shopsphere.model.*;
import com.shopsphere.repository.CartRepository;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
            CartRepository cartRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================
    // REGISTER USER
    // =========================

    @Override
    public UserDto registerUser(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        user.setEmail(user.getEmail().trim().toLowerCase());

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }

        User savedUser = userRepository.save(user);

        // Create cart for new user
        if (cartRepository.findByUserId(savedUser.getId()).isEmpty()) {

            Cart cart = new Cart();

            cart.setUser(savedUser);
            cart.setItems(new ArrayList<>());

            cartRepository.save(cart);
        }

        return mapToDto(savedUser);
    }

    // =========================
    // GET ALL USERS
    // =========================

    @Override
    public List<UserDto> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // =========================
    // GET USER BY ID
    // =========================

    @Override
    public UserDto getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );

        return mapToDto(user);
    }

    // =========================
    // UPDATE USER
    // =========================

    @Override
    public User updateUser(Long id, User user) {

        User existing = userRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );

        existing.setName(user.getName());
        existing.setEmail(user.getEmail());

        return userRepository.save(existing);
    }

    // =========================
    // DELETE USER
    // =========================

    @Override
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );

        cartRepository.findByUserId(id)
                .ifPresent(cartRepository::delete);

        userRepository.delete(user);
    }

    // =========================
    // GET USER BY EMAIL
    // =========================

    @Override
    public Optional<User> getUserByEmail(String email) {

        return userRepository.findByEmail(email);
    }

    // =========================
    // LOGIN USER
    // =========================

    @Override
    public UserDto loginUser(String email, String password) {

        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (password == null || password.isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        String normalizedEmail =
                email.trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(
                        () -> new RuntimeException(
                                "No account found with this email"
                        )
                );

        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new RuntimeException("Incorrect password");
        }

        /*
         * IMPORTANT:
         * Login ke time cart/product data load nahi karenge.
         * Sirf basic user information return karenge.
         *
         * Isse /users/login ke time cart/product relation
         * ki wajah se 500 error hone ka chance avoid hota hai.
         */

        return mapUserBasicToDto(user);
    }

    // =========================
    // RESET PASSWORD
    // =========================

    @Override
    public void resetPassword(Long userId, String newPassword) {

        User user = userRepository.findById(userId)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );

        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new RuntimeException("New password is required");
        }

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);
    }

    // =========================
    // BASIC USER DTO
    // =========================

    private UserDto mapUserBasicToDto(User user) {

        UserDto dto = new UserDto();

        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());

        dto.setRole(
                user.getRole() != null
                        ? user.getRole().name()
                        : "USER"
        );

        return dto;
    }

    // =========================
    // COMPLETE USER DTO
    // =========================

    private UserDto mapToDto(User user) {

        UserDto dto = new UserDto();

        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());

        dto.setRole(
                user.getRole() != null
                        ? user.getRole().name()
                        : "USER"
        );

        // Get user's cart
        cartRepository.findByUserId(user.getId())
                .ifPresent(cart -> {

                    CartDto cartDto = new CartDto();

                    cartDto.setId(cart.getId());

                    List<CartItemDto> items =
                            new ArrayList<>();

                    double total = 0;

                    if (cart.getItems() != null) {

                        for (CartItem ci : cart.getItems()) {

                            if (ci.getProduct() == null) {
                                continue;
                            }

                            Product product =
                                    ci.getProduct();

                            double itemTotal =
                                    product.getPrice()
                                            * ci.getQuantity();

                            total += itemTotal;

                            CartItemDto itemDto =
                                    new CartItemDto();

                            itemDto.setProductId(
                                    product.getId()
                            );

                            itemDto.setProductName(
                                    product.getName()
                            );

                            itemDto.setPrice(
                                    product.getPrice()
                            );

                            itemDto.setQuantity(
                                    ci.getQuantity()
                            );

                            itemDto.setTotalPrice(
                                    itemTotal
                            );

                            items.add(itemDto);
                        }
                    }

                    cartDto.setItems(items);
                    cartDto.setTotalAmount(total);

                    dto.setCart(cartDto);
                });

        return dto;
    }
}