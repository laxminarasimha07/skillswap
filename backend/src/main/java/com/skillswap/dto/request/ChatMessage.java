package com.skillswap.dto.request;

public class ChatMessage {

    private Long receiverId;
    private String message;
    private String fileUrl;

    // No-arg constructor
    public ChatMessage() {}

    // Getters and Setters
    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
}
