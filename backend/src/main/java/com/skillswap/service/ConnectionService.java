package com.skillswap.service;

import com.skillswap.model.Connection;
import com.skillswap.model.User;
import com.skillswap.repository.ConnectionRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ConnectionService {

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void sendRequest(Long senderId, Long receiverId) {
        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId).orElseThrow(() -> new RuntimeException("Receiver not found"));

        // Avoid duplicate rows between the same pair
        Optional<Connection> existingForward = connectionRepository.findBySenderAndReceiver(sender, receiver);

        // Check for existing reverse request
        Optional<Connection> reverseRequest = connectionRepository.findBySenderAndReceiver(receiver, sender);
        if (reverseRequest.isPresent() && reverseRequest.get().getStatus() == Connection.ConnectionStatus.PENDING) {
            // Reverse request is (receiver -> sender). Current user is `sender`, which is the receiver in that reverse record.
            acceptRequest(reverseRequest.get().getId(), senderId);
            return;
        }

        if (existingForward.isPresent()) {
            Connection existing = existingForward.get();
            switch (existing.getStatus()) {
                case ACCEPTED -> throw new RuntimeException("Already connected");
                case PENDING -> throw new RuntimeException("Request already sent");
                case BLOCKED -> throw new RuntimeException("User is blocked");
                case REJECTED -> {
                    existing.setStatus(Connection.ConnectionStatus.PENDING);
                    connectionRepository.save(existing);
                    return;
                }
                default -> throw new RuntimeException("Invalid connection state");
            }
        }

        Connection connection = new Connection();
        connection.setSender(sender);
        connection.setReceiver(receiver);
        connection.setStatus(Connection.ConnectionStatus.PENDING);
        connectionRepository.save(connection);
    }

    public void acceptRequest(Long connectionId, Long currentUserId) {
        Connection connection = connectionRepository.findById(connectionId).orElseThrow(() -> new RuntimeException("Connection not found"));
        if (!connection.getReceiver().getId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized");
        }
        connection.setStatus(Connection.ConnectionStatus.ACCEPTED);
        connectionRepository.save(connection);
    }

    public void rejectRequest(Long connectionId, Long currentUserId) {
        Connection connection = connectionRepository.findById(connectionId).orElseThrow(() -> new RuntimeException("Connection not found"));
        if (!connection.getReceiver().getId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized");
        }
        connection.setStatus(Connection.ConnectionStatus.REJECTED);
        connectionRepository.save(connection);
    }

    public void blockUser(Long blockerId, Long blockedId) {
        User blocker = userRepository.findById(blockerId).orElseThrow(() -> new RuntimeException("Blocker not found"));
        User blocked = userRepository.findById(blockedId).orElseThrow(() -> new RuntimeException("Blocked user not found"));

        Optional<Connection> existingConnection = connectionRepository.findBySenderAndReceiver(blocker, blocked);
        if (existingConnection.isPresent()) {
            existingConnection.get().setStatus(Connection.ConnectionStatus.BLOCKED);
            connectionRepository.save(existingConnection.get());
        } else {
            Connection newConnection = new Connection();
            newConnection.setSender(blocker);
            newConnection.setReceiver(blocked);
            newConnection.setStatus(Connection.ConnectionStatus.BLOCKED);
            connectionRepository.save(newConnection);
        }
    }

    public List<Connection> getConnectionsForUser(Long userId) {
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return connectionRepository.findAll().stream()
                .filter(conn -> conn.getSender().getId().equals(userId) || conn.getReceiver().getId().equals(userId))
                .toList();
    }
}

