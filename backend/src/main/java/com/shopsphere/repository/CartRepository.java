package com.shopsphere.repository;

import com.shopsphere.model.Cart;
import com.shopsphere.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUser(User user);

    Optional<Cart> findByUserId(Long userId);

    @Query("SELECT c FROM Cart c " +
           "LEFT JOIN FETCH c.items ci " +
           "LEFT JOIN FETCH ci.product " +
           "WHERE c.user.id = :userId")
    Optional<Cart> findCartWithItems(@Param("userId") Long userId);
}