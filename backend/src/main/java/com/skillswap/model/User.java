package com.skillswap.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Data
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
    @Column(columnDefinition = "json")
    private List<String> skillsOffered;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "json")
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
    
    // Ensure lists are never null
    public List<String> getSkillsOffered() {
        return skillsOffered != null ? skillsOffered : List.of();
    }
    
    public List<String> getSkillsWanted() {
        return skillsWanted != null ? skillsWanted : List.of();
    }
}
