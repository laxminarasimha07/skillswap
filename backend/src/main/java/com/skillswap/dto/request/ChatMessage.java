package com.skillswap.dto.request;

import lombok.Data;

@Data
public class ChatMessage {

    private Long receiverId;
    private String message;
    private String fileUrl;
}
