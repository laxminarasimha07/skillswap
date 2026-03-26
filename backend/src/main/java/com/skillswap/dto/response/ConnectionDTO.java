package com.skillswap.dto.response;

import com.skillswap.model.Connection;

public class ConnectionDTO {
    private Long id;
    private Long senderId;
    private Long receiverId;
    private String status;

    public ConnectionDTO(Connection connection) {
        this.id = connection.getId();
        this.senderId = connection.getSender().getId();
        this.receiverId = connection.getReceiver().getId();
        this.status = connection.getStatus().name();
    }

    // Default constructor
    public ConnectionDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
