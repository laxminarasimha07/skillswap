package com.skillswap.controller;

import com.skillswap.dto.request.ReviewRequest;
import com.skillswap.dto.response.ReviewDTO;
import com.skillswap.model.Review;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

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
    public ResponseEntity<ReviewDTO> createReview(@RequestBody ReviewRequest request) {
        Long reviewerId = getCurrentUserId();
        Review review = reviewService.createReview(reviewerId, request);
        return ResponseEntity.ok(new ReviewDTO(review));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        Long currentUserId = getCurrentUserId();
        reviewService.deleteReview(id, currentUserId);
        return ResponseEntity.ok().build();
    }
}
