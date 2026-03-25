package com.skillswap.service;

import com.skillswap.dto.request.SessionProposeRequest;
import com.skillswap.model.Session;
import com.skillswap.model.User;
import com.skillswap.repository.SessionRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GoogleCalendarService googleCalendarService;

    public Session proposeSession(Long user1Id, SessionProposeRequest request) {
        User user1 = userRepository.findById(user1Id).orElseThrow(() -> new RuntimeException("User not found"));
        User user2 = userRepository.findById(request.getUser2Id()).orElseThrow(() -> new RuntimeException("User not found"));

        Session session = new Session();
        session.setUser1(user1);
        session.setUser2(user2);
        session.setStatus(Session.SessionStatus.PROPOSED);
        // In a real application, you would store the proposed slots in a separate table
        // For simplicity, we'll just set the first proposed slot as the start time
        session.setStartTime(request.getProposedSlots().get(0));
        session.setEndTime(request.getProposedSlots().get(0).plusHours(1));

        return sessionRepository.save(session);
    }

    public Session confirmSession(Long sessionId, Long userId, LocalDateTime selectedSlot) {
        Session session = sessionRepository.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found"));
        if (!session.getUser1().getId().equals(userId) && !session.getUser2().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        session.setStartTime(selectedSlot);
        session.setEndTime(selectedSlot.plusHours(1));
        session.setStatus(Session.SessionStatus.CONFIRMED);

        // Create Meet link in the confirmer's Google account (per-user OAuth).
        User confirmer = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        var created = googleCalendarService.createMeetEvent(confirmer, session);
        session.setMeetLink(created.meetLink());
        session.setGoogleEventId(created.eventId());

        return sessionRepository.save(session);
    }

    public Session cancelSession(Long sessionId, Long userId) {
        Session session = sessionRepository.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found"));
        if (!session.getUser1().getId().equals(userId) && !session.getUser2().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        session.setStatus(Session.SessionStatus.CANCELLED);
        // googleCalendarService.cancelEvent(session.getGoogleEventId());

        return sessionRepository.save(session);
    }

    public Session completeSession(Long sessionId, Long userId) {
        Session session = sessionRepository.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found"));
        if (!session.getUser1().getId().equals(userId) && !session.getUser2().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        session.setStatus(Session.SessionStatus.COMPLETED);
        return sessionRepository.save(session);
    }

    public List<Session> getSessionsForUser(Long userId) {
        return sessionRepository.findAll().stream()
                .filter(session -> session.getUser1().getId().equals(userId) || session.getUser2().getId().equals(userId))
                .toList();
    }
}
