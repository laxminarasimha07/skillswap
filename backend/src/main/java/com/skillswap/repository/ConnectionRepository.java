package com.skillswap.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skillswap.model.Connection;
import com.skillswap.model.User;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    Optional<Connection> findBySenderAndReceiver(User sender, User receiver);

    @Query("SELECT c.receiver FROM Connection c WHERE c.sender = :user AND c.status = 'ACCEPTED'")
    List<User> findAcceptedReceiversByUser(@Param("user") User user);

    @Query("SELECT c.sender FROM Connection c WHERE c.receiver = :user AND c.status = 'ACCEPTED'")
    List<User> findAcceptedSendersByUser(@Param("user") User user);

    @Query("SELECT c.receiver FROM Connection c WHERE c.sender = :user AND (c.status = 'PENDING' OR c.status = 'BLOCKED')")
    List<User> findPendingOrBlockedReceiversByUser(@Param("user") User user);
    
    @Query("SELECT c.sender FROM Connection c WHERE c.receiver = :user AND c.status = 'PENDING'")
    List<User> findPendingSendersByUser(@Param("user") User user);

    @Query("SELECT COUNT(c) FROM Connection c WHERE c.sender = :user OR c.receiver = :user")
    long countByUser(@Param("user") User user);
}
