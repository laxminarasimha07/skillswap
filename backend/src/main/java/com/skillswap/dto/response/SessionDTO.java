package com.skillswap.dto.response;

import com.skillswap.model.Session;
import java.time.LocalDateTime;

public class SessionDTO {
    private Long id;
    private UserDTO user1;
    private UserDTO user2;
    private Long user1Id;
    private Long user2Id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String meetLink;
    private String status;

    public SessionDTO(Session session) {
        this.id = session.getId();
        this.user1 = new UserDTO(session.getUser1());
        this.user2 = new UserDTO(session.getUser2());
        this.user1Id = session.getUser1().getId();
        this.user2Id = session.getUser2().getId();
        this.startTime = session.getStartTime();
        this.endTime = session.getEndTime();
        this.meetLink = session.getMeetLink();
        this.status = session.getStatus().toString();
    }

    // Default constructor
    public SessionDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserDTO getUser1() { return user1; }
    public void setUser1(UserDTO user1) { this.user1 = user1; }

    public UserDTO getUser2() { return user2; }
    public void setUser2(UserDTO user2) { this.user2 = user2; }

    public Long getUser1Id() { return user1Id; }
    public void setUser1Id(Long user1Id) { this.user1Id = user1Id; }

    public Long getUser2Id() { return user2Id; }
    public void setUser2Id(Long user2Id) { this.user2Id = user2Id; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public String getMeetLink() { return meetLink; }
    public void setMeetLink(String meetLink) { this.meetLink = meetLink; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
