package com.skillswap.controller;

import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    @Autowired
    private ConnectionService connectionService;

    @Autowired
    private UserRepository userRepository;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        return currentUser.getId();
    }

    @PostMapping("/request")
    public ResponseEntity<?> sendRequest(@RequestParam Long receiverId) {
        Long senderId = getCurrentUserId();
        connectionService.sendRequest(senderId, receiverId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptRequest(@PathVariable Long id) {
        Long currentUserId = getCurrentUserId();
        connectionService.acceptRequest(id, currentUserId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id) {
        Long currentUserId = getCurrentUserId();
        connectionService.rejectRequest(id, currentUserId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/block")
    public ResponseEntity<?> blockUser(@RequestParam Long blockedId) {
        Long blockerId = getCurrentUserId();
        connectionService.blockUser(blockerId, blockedId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<com.skillswap.dto.response.ConnectionDTO>> getConnections() {
        Long currentUserId = getCurrentUserId();
        List<com.skillswap.model.Connection> connections = connectionService.getConnectionsForUser(currentUserId);
        List<com.skillswap.dto.response.ConnectionDTO> dtos = connections.stream()
                .map(com.skillswap.dto.response.ConnectionDTO::new)
                .toList();
        return ResponseEntity.ok(dtos);
    }
}
