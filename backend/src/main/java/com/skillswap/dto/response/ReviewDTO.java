package com.skillswap.dto.response;

import com.skillswap.model.Review;
import lombok.Data;

@Data
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
}
