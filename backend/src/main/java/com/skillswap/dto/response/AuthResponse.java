package com.skillswap.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthResponse {

    private String token;
    private UserDTO user;

    // Explicit constructor for reliability
    public AuthResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }
}
