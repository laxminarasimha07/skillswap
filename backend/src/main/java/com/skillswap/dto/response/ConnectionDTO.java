package com.skillswap.dto.response;

import com.skillswap.model.Connection;
import lombok.Data;

@Data
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
}
