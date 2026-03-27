package com.skillswap.controller;

import com.skillswap.dto.request.SessionProposeRequest;
import com.skillswap.dto.response.SessionDTO;
import com.skillswap.model.Session;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private UserRepository userRepository;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current user not found"))
                .getId();
    }

    @PostMapping
    public ResponseEntity<SessionDTO> proposeSession(@RequestBody SessionProposeRequest request) {
        Long user1Id = getCurrentUserId();
        Session session = sessionService.proposeSession(user1Id, request);
        return ResponseEntity.ok(new SessionDTO(session));
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<SessionDTO> confirmSession(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        Session session = sessionService.confirmSession(id, userId);
        return ResponseEntity.ok(new SessionDTO(session));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<SessionDTO> cancelSession(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        Session session = sessionService.cancelSession(id, userId);
        return ResponseEntity.ok(new SessionDTO(session));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<SessionDTO> completeSession(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        Session session = sessionService.completeSession(id, userId);
        return ResponseEntity.ok(new SessionDTO(session));
    }

    @GetMapping
    public ResponseEntity<List<SessionDTO>> getMySessions() {
        Long userId = getCurrentUserId();
        List<SessionDTO> mySessions = sessionService.getSessionsForUser(userId).stream()
                .map(SessionDTO::new)
                .toList();
        return ResponseEntity.ok(mySessions);
    }
}
