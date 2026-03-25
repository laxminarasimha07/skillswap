package com.skillswap.dto.request;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class SessionProposeRequest {

    private Long user2Id;
    private List<LocalDateTime> proposedSlots;
}
