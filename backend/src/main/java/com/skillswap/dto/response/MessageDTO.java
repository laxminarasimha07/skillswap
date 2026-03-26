package com.skillswap.dto.response;

import com.skillswap.model.Message;
import java.time.LocalDateTime;

public class MessageDTO {
    private Long id;
    private Long senderId;
    private Long receiverId;
    private String message;
    private String fileUrl;
    private LocalDateTime timestamp;

    public MessageDTO(Message message) {
        this.id = message.getId();
        this.senderId = message.getSender().getId();
        this.receiverId = message.getReceiver().getId();
        this.message = message.getMessage();
        this.fileUrl = message.getFileUrl();
        this.timestamp = message.getTimestamp();
    }

    // Default constructor
    public MessageDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
