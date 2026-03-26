package com.skillswap.dto.response;

public class SuggestionDTO {

    private UserDTO user;
    private int score;

    // Constructor
    public SuggestionDTO(UserDTO user, int score) {
        this.user = user;
        this.score = score;
    }

    // Default constructor
    public SuggestionDTO() {}

    // Getters and Setters
    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
}
