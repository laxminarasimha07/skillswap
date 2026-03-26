package com.skillswap.dto.request;

import java.time.LocalDateTime;
import java.util.List;

public class SessionProposeRequest {

    private Long user2Id;
    private List<LocalDateTime> proposedSlots;

    // No-arg constructor
    public SessionProposeRequest() {}

    // Getters and Setters
    public Long getUser2Id() { return user2Id; }
    public void setUser2Id(Long user2Id) { this.user2Id = user2Id; }

    public List<LocalDateTime> getProposedSlots() { return proposedSlots; }
    public void setProposedSlots(List<LocalDateTime> proposedSlots) { this.proposedSlots = proposedSlots; }
}
