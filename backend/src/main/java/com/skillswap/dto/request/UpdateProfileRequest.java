package com.skillswap.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class UpdateProfileRequest {
    private String name;
    private String about;
    private String branch;
    private String year;
    private List<String> skillsOffered;
    private List<String> skillsWanted;
}
