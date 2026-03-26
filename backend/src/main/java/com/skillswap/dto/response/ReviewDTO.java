package com.skillswap.dto.response;

import com.skillswap.model.Review;

public class ReviewDTO {
    private Long id;
    private Long reviewerId;
    private Long reviewedId;
    private int rating;
    private String comment;

    public ReviewDTO(Review review) {
        this.id = review.getId();
        this.reviewerId = review.getReviewer().getId();
        this.reviewedId = review.getReviewed().getId();
        this.rating = review.getRating();
        this.comment = review.getComment();
    }

    // Default constructor
    public ReviewDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getReviewerId() { return reviewerId; }
    public void setReviewerId(Long reviewerId) { this.reviewerId = reviewerId; }

    public Long getReviewedId() { return reviewedId; }
    public void setReviewedId(Long reviewedId) { this.reviewedId = reviewedId; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
