package com.skillswap.dto.response;

public class AuthResponse {

    private String token;
    private UserDTO user;

    // No-arg constructor
    public AuthResponse() {}

    // Explicit constructor for reliability
    public AuthResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }
}
