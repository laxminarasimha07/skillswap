package com.skillswap.dto.response;

import java.util.List;

import com.skillswap.model.User;

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

    // Default constructor
    public UserDTO() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAbout() { return about; }
    public void setAbout(String about) { this.about = about; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public List<String> getSkillsOffered() { return skillsOffered; }
    public void setSkillsOffered(List<String> skillsOffered) { this.skillsOffered = skillsOffered; }

    public List<String> getSkillsWanted() { return skillsWanted; }
    public void setSkillsWanted(List<String> skillsWanted) { this.skillsWanted = skillsWanted; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
}
