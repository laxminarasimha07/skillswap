package com.skillswap.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String branch;

    @Column(nullable = false)
    private String year;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> skillsOffered;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> skillsWanted;

    @Column(nullable = false)
    private Double rating = 0.0;

    @Column(length = 100)
    private String about;

    @Column(columnDefinition = "TEXT")
    private String googleRefreshToken;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // No-arg constructor for JPA
    public User() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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
        return skillsOffered != null ? skillsOffered : new ArrayList<>(); 
    }
    public void setSkillsOffered(List<String> skillsOffered) { 
        this.skillsOffered = skillsOffered; 
    }

    public List<String> getSkillsWanted() { 
        return skillsWanted != null ? skillsWanted : new ArrayList<>(); 
    }
    public void setSkillsWanted(List<String> skillsWanted) { 
        this.skillsWanted = skillsWanted; 
    }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getAbout() { return about; }
    public void setAbout(String about) { this.about = about; }

    public String getGoogleRefreshToken() { return googleRefreshToken; }
    public void setGoogleRefreshToken(String googleRefreshToken) { 
        this.googleRefreshToken = googleRefreshToken; 
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { 
        this.createdAt = createdAt; 
    }
}
