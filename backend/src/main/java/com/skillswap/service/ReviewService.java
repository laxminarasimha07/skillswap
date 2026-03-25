package com.skillswap.service;

import com.skillswap.dto.request.ReviewRequest;
import com.skillswap.model.Review;
import com.skillswap.model.Session;
import com.skillswap.model.User;
import com.skillswap.repository.ReviewRepository;
import com.skillswap.repository.SessionRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Transactional
    public Review createReview(Long reviewerId, ReviewRequest request) {
        User reviewer = userRepository.findById(reviewerId).orElseThrow(() -> new RuntimeException("Reviewer not found"));
        User reviewed = userRepository.findById(request.getReviewedId()).orElseThrow(() -> new RuntimeException("Reviewed user not found"));
        Session session = sessionRepository.findById(request.getSessionId()).orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.getStatus() != Session.SessionStatus.COMPLETED) {
            throw new RuntimeException("Session not completed");
        }

        Review review = new Review();
        review.setReviewer(reviewer);
        review.setReviewed(reviewed);
        review.setSession(session);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review savedReview = reviewRepository.save(review);
        updateUserRating(reviewed.getId());
        return savedReview;
    }

    @Transactional
    public void deleteReview(Long reviewId, Long currentUserId) {
        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("Review not found"));
        if (!review.getReviewer().getId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized");
        }
        Long reviewedId = review.getReviewed().getId();
        reviewRepository.delete(review);
        updateUserRating(reviewedId);
    }

    private void updateUserRating(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Double averageRating = reviewRepository.getAverageRatingForUser(userId);
        user.setRating(averageRating);
        userRepository.save(user);
    }
}
