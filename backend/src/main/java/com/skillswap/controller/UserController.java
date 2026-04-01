package com.skillswap.controller;

import com.skillswap.dto.request.UpdateProfileRequest;
import com.skillswap.dto.response.UserDTO;
import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMyProfile() {
        User user = getCurrentUser();
        return ResponseEntity.ok(new UserDTO(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateMyProfile(@RequestBody UpdateProfileRequest request) {
        User user = getCurrentUser();

        if (request.getName() != null) user.setName(request.getName());
        if (request.getAbout() != null) user.setAbout(request.getAbout());
        if (request.getBranch() != null) user.setBranch(request.getBranch());
        if (request.getYear() != null) user.setYear(request.getYear());
        if (request.getSkillsOffered() != null) user.setSkillsOffered(request.getSkillsOffered());
        if (request.getSkillsWanted() != null) user.setSkillsWanted(request.getSkillsWanted());

        userRepository.save(user);
        return ResponseEntity.ok(new UserDTO(user));
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request) {
        User user = getCurrentUser();
        if (request.containsKey("password") && !request.get("password").trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.get("password")));
            userRepository.save(user);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().body("Password cannot be empty");
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(new UserDTO(user));
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userRepository.findAll().stream().map(UserDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
}