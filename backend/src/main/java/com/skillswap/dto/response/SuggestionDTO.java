package com.skillswap.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SuggestionDTO {

    private UserDTO user;
    private int score;
}
