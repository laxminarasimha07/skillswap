package com.skillswap.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillswap.model.Session;
import com.skillswap.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class GoogleCalendarService {

    @Value("${google.clientId}")
    private String clientId;

    @Value("${google.clientSecret}")
    private String clientSecret;

    @Value("${google.redirectUri}")
    private String redirectUri;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String buildAuthorizationUrl(String state) {
        // offline + consent => refresh_token on first approval
        return "https://accounts.google.com/o/oauth2/v2/auth"
                + "?client_id=" + url(clientId)
                + "&redirect_uri=" + url(redirectUri)
                + "&response_type=code"
                + "&scope=" + url("https://www.googleapis.com/auth/calendar.events")
                + "&access_type=offline"
                + "&prompt=consent"
                + "&state=" + url(state);
    }

    public TokenResponse exchangeCodeForTokens(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String body = "code=" + url(code)
                + "&client_id=" + url(clientId)
                + "&client_secret=" + url(clientSecret)
                + "&redirect_uri=" + url(redirectUri)
                + "&grant_type=authorization_code";

        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> resp = restTemplate.exchange(
                "https://oauth2.googleapis.com/token",
                HttpMethod.POST,
                entity,
                String.class
        );

        try {
            JsonNode node = objectMapper.readTree(resp.getBody());
            return new TokenResponse(
                    node.path("access_token").asText(null),
                    node.path("refresh_token").asText(null),
                    node.path("expires_in").asLong(0)
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Google token response");
        }
    }

    public String refreshAccessToken(String refreshToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String body = "client_id=" + url(clientId)
                + "&client_secret=" + url(clientSecret)
                + "&refresh_token=" + url(refreshToken)
                + "&grant_type=refresh_token";

        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> resp = restTemplate.exchange(
                "https://oauth2.googleapis.com/token",
                HttpMethod.POST,
                entity,
                String.class
        );

        try {
            JsonNode node = objectMapper.readTree(resp.getBody());
            return node.path("access_token").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Google refresh response");
        }
    }

    public CreateEventResult createMeetEvent(User owner, Session session) {
        if (owner.getGoogleRefreshToken() == null || owner.getGoogleRefreshToken().isBlank()) {
            throw new RuntimeException("Google Calendar not connected");
        }

        String accessToken = refreshAccessToken(owner.getGoogleRefreshToken());

        Map<String, Object> event = new HashMap<>();
        event.put("summary", "SkillSwap Session");
        event.put("description", "SkillSwap session between " + owner.getName() + " and " + session.getUser2().getName());

        Map<String, Object> start = new HashMap<>();
        start.put("dateTime", session.getStartTime().atZone(ZoneId.systemDefault()).toOffsetDateTime().toString());
        Map<String, Object> end = new HashMap<>();
        end.put("dateTime", session.getEndTime().atZone(ZoneId.systemDefault()).toOffsetDateTime().toString());
        event.put("start", start);
        event.put("end", end);

        Map<String, Object> conferenceData = new HashMap<>();
        Map<String, Object> createRequest = new HashMap<>();
        createRequest.put("requestId", UUID.randomUUID().toString());
        Map<String, Object> conferenceSolutionKey = new HashMap<>();
        conferenceSolutionKey.put("type", "hangoutsMeet");
        createRequest.put("conferenceSolutionKey", conferenceSolutionKey);
        conferenceData.put("createRequest", createRequest);
        event.put("conferenceData", conferenceData);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        try {
            String json = objectMapper.writeValueAsString(event);
            HttpEntity<String> entity = new HttpEntity<>(json, headers);
            ResponseEntity<String> resp = restTemplate.exchange(
                    "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            JsonNode node = objectMapper.readTree(resp.getBody());
            String hangoutLink = node.path("hangoutLink").asText(null);
            String eventId = node.path("id").asText(null);
            return new CreateEventResult(hangoutLink, eventId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Google Calendar event");
        }
    }

    private static String url(String s) {
        try {
            return java.net.URLEncoder.encode(s == null ? "" : s, java.nio.charset.StandardCharsets.UTF_8);
        } catch (Exception e) {
            return "";
        }
    }

    public record TokenResponse(String accessToken, String refreshToken, long expiresIn) {}
    public record CreateEventResult(String meetLink, String eventId) {}
}

