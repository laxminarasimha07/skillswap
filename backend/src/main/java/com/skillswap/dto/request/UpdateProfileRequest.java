package com.skillswap.dto.request;

import java.util.List;

public class UpdateProfileRequest {
    private String name;
    private String about;
    private String branch;
    private String year;
    private List<String> skillsOffered;
    private List<String> skillsWanted;

    // No-arg constructor
    public UpdateProfileRequest() {}

    // Getters and Setters
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
}
