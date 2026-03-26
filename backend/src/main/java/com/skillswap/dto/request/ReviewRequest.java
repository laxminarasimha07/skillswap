package com.skillswap.dto.request;

public class ReviewRequest {

    private Long reviewedId;
    private Long sessionId;
    private int rating;
    private String comment;

    // No-arg constructor
    public ReviewRequest() {}

    // Getters and Setters
    public Long getReviewedId() { return reviewedId; }
    public void setReviewedId(Long reviewedId) { this.reviewedId = reviewedId; }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
