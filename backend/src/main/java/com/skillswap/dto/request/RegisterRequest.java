package com.skillswap.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class RegisterRequest {

    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;

    @NotBlank
    private String branch;

    @NotBlank
    private String year;

    private List<String> skillsOffered = List.of();

    private List<String> skillsWanted = List.of();

    // No-arg constructor
    public RegisterRequest() {}

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public List<String> getSkillsOffered() { 
        return skillsOffered != null ? skillsOffered : List.of(); 
    }
    public void setSkillsOffered(List<String> skillsOffered) { 
        this.skillsOffered = skillsOffered; 
    }

    public List<String> getSkillsWanted() { 
        return skillsWanted != null ? skillsWanted : List.of(); 
    }
    public void setSkillsWanted(List<String> skillsWanted) { 
        this.skillsWanted = skillsWanted; 
    }
}
