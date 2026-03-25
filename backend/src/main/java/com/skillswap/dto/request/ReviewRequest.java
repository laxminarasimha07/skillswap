package com.skillswap.dto.request;

import lombok.Data;

@Data
public class ReviewRequest {

    private Long reviewedId;
    private Long sessionId;
    private int rating;
    private String comment;
}
