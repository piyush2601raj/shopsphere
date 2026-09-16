package com.shopsphere.service;

import com.shopsphere.dto.UserDto;
import com.shopsphere.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    UserDto registerUser(User user);

    List<UserDto> getAllUsers();

    UserDto getUserById(Long id);

    User updateUser(Long id, User user);

    void deleteUser(Long id);

    Optional<User> getUserByEmail(String email);

    // LOGIN
    UserDto loginUser(String email, String password);

    // RESET PASSWORD
    void resetPassword(Long userId, String newPassword);
}