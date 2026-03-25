package com.skillswap.dto.response;

import com.skillswap.model.Message;
import lombok.Data;

import java.time.LocalDateTime;

@Data
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
}
