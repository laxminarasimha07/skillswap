package com.skillswap.dto.response;

import com.skillswap.model.Session;
import lombok.Data;

import java.time.LocalDateTime;

@Data
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
}
