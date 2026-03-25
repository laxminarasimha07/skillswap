package com.skillswap.dto.response;

import com.skillswap.model.User;
import lombok.Data;

import java.util.List;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String about;
    private String branch;
    private String year;
    private List<String> skillsOffered;
    private List<String> skillsWanted;
    private Double rating;

    public UserDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.about = user.getAbout();
        this.branch = user.getBranch();
        this.year = user.getYear();
        this.skillsOffered = user.getSkillsOffered();
        this.skillsWanted = user.getSkillsWanted();
        this.rating = user.getRating();
    }
}
