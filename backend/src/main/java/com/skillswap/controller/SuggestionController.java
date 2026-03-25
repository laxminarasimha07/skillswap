package com.skillswap.controller;

import com.skillswap.dto.response.SuggestionDTO;
import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.SuggestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/suggestions")
public class SuggestionController {

    @Autowired
    private SuggestionService suggestionService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<SuggestionDTO>> getSuggestions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUsername).get();

        return ResponseEntity.ok(suggestionService.getSuggestions(currentUser));
    }
}
