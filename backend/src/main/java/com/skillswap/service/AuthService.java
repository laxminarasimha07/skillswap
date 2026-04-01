package com.skillswap.service;

import com.skillswap.dto.request.LoginRequest;
import com.skillswap.dto.request.RegisterRequest;
import com.skillswap.dto.response.AuthResponse;
import com.skillswap.dto.response.UserDTO;
import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import com.skillswap.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

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
        log.info("REGISTER: step 1 - checking if email exists: {}", registerRequest.getEmail());

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            log.warn("REGISTER: email already registered: {}", registerRequest.getEmail());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is already registered");
        }

        log.info("REGISTER: step 2 - email is new, building user object");
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());

        log.info("REGISTER: step 3 - encoding password");
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        log.info("REGISTER: step 4 - setting branch/year/skills");
        user.setBranch(registerRequest.getBranch());
        user.setYear(registerRequest.getYear());
        user.setSkillsOffered(registerRequest.getSkillsOffered());
        user.setSkillsWanted(registerRequest.getSkillsWanted());

        log.info("REGISTER: step 5 - saving user to DB. skillsOffered={}", registerRequest.getSkillsOffered());
        userRepository.save(user);

        log.info("REGISTER: step 6 - user saved, loading UserDetails");
        final UserDetails userDetails = userDetailsService.loadUserByUsername(registerRequest.getEmail());

        log.info("REGISTER: step 7 - generating JWT token");
        final String token = jwtUtil.generateToken(userDetails);

        log.info("REGISTER: step 8 - building response");
        return new AuthResponse(token, new UserDTO(user));
    }

    public AuthResponse login(LoginRequest loginRequest) {
        log.info("LOGIN: authenticating user: {}", loginRequest.getEmail());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        log.info("LOGIN: authentication passed, loading UserDetails");
        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());

        final User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You don't have an account please register first"));

        log.info("LOGIN: generating token for {}", loginRequest.getEmail());
        final String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, new UserDTO(user));
    }
}

