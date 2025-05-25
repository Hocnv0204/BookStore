package com.bookstore.backend.repository;

import com.bookstore.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username) ;
    boolean existsByUsername(String username) ;
    boolean existsByEmail(String email) ;
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<User> findByFullNameContainingIgnoreCase(@Param("keyword") String keyword, Pageable pageable);
}
