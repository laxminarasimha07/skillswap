package com.skillswap.service;

import com.skillswap.dto.request.LoginRequest;
import com.skillswap.dto.request.RegisterRequest;
import com.skillswap.dto.response.AuthResponse;
import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import com.skillswap.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    public AuthResponse register(RegisterRequest registerRequest) {
        // Remove email domain restriction for now
        // if (!registerRequest.getEmail().endsWith("@anurag.edu.in")) {
        //     throw new IllegalArgumentException("Invalid email domain");
        // }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setBranch(registerRequest.getBranch());
        user.setYear(registerRequest.getYear());
        
        // Ensure skills lists are properly handled
        List<String> offeredSkills = registerRequest.getSkillsOffered() != null ? 
            registerRequest.getSkillsOffered() : List.of();
        List<String> wantedSkills = registerRequest.getSkillsWanted() != null ? 
            registerRequest.getSkillsWanted() : List.of();
            
        user.setSkillsOffered(offeredSkills);
        user.setSkillsWanted(wantedSkills);

        userRepository.save(user);

        final UserDetails userDetails = userDetailsService.loadUserByUsername(registerRequest.getEmail());
        final String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, new com.skillswap.dto.response.UserDTO(user));
    }

    public AuthResponse login(LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        final User user = userRepository.findByEmail(loginRequest.getEmail()).get();
        final String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, new com.skillswap.dto.response.UserDTO(user));
    }
}
