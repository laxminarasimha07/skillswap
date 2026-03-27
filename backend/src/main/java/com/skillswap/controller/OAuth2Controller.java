package com.skillswap.controller;

import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.GoogleCalendarService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/api/oauth2")
public class OAuth2Controller {

    @Autowired
    private GoogleCalendarService googleCalendarService;

    @Autowired
    private UserRepository userRepository;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${app.frontendUrl:http://localhost:5173}")
    private String frontendUrl;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    private SecretKey key() {
        byte[] keyBytes = jwtSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            keyBytes = java.util.Arrays.copyOf(keyBytes, 32);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private String createStateToken(Long userId) {
        return Jwts.builder()
                .subject(userId.toString())
                .claim("typ", "oauth")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 10 * 60 * 1000))
                .signWith(key())
                .compact();
    }

    private Long parseStateToken(String state) {
        var claims = Jwts.parser().verifyWith(key()).build().parseSignedClaims(state).getPayload();
        if (!"oauth".equals(claims.get("typ", String.class))) throw new RuntimeException("Invalid state");
        return Long.parseLong(claims.getSubject());
    }

    @GetMapping("/authorize-url")
    public ResponseEntity<?> authorizeUrl() {
        Long userId = getCurrentUserId();
        String state = createStateToken(userId);
        String url = googleCalendarService.buildAuthorizationUrl(state);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @GetMapping("/callback")
    public ResponseEntity<?> callback(@RequestParam String code, @RequestParam String state) {
        Long userId = parseStateToken(state);
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        var tokens = googleCalendarService.exchangeCodeForTokens(code);
        // refresh_token is often only returned on first consent. Keep existing if absent.
        if (tokens.refreshToken() != null && !tokens.refreshToken().isBlank()) {
            user.setGoogleRefreshToken(tokens.refreshToken());
            userRepository.save(user);
        }

        return ResponseEntity.status(302)
                .header(HttpHeaders.LOCATION, frontendUrl + "/sessions")
                .build();
    }
}

