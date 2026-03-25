package com.skillswap.service;

import com.skillswap.dto.response.SuggestionDTO;
import com.skillswap.dto.response.UserDTO;
import com.skillswap.model.User;
import com.skillswap.repository.ConnectionRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SuggestionService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConnectionRepository connectionRepository;

    public List<SuggestionDTO> getSuggestions(User currentUser) {
        List<User> allUsers = userRepository.findAll();
        List<User> connectedUsers = new ArrayList<>();
        connectedUsers.addAll(connectionRepository.findAcceptedReceiversByUser(currentUser));
        connectedUsers.addAll(connectionRepository.findAcceptedSendersByUser(currentUser));
        connectedUsers.addAll(connectionRepository.findPendingOrBlockedReceiversByUser(currentUser));
        connectedUsers.addAll(connectionRepository.findPendingSendersByUser(currentUser));

        List<User> usersToSuggest = allUsers.stream()
                .filter(user -> !user.getId().equals(currentUser.getId()) && !connectedUsers.contains(user))
                .collect(Collectors.toList());

        long connectionCount = connectionRepository.countByUser(currentUser);

        if (connectionCount == 0) {
            // Cold start: same branch + highly rated users (top 10) for new users
            return usersToSuggest.stream()
                    .filter(user -> user.getBranch().equalsIgnoreCase(currentUser.getBranch()))
                    .sorted((u1, u2) -> Double.compare(u2.getRating(), u1.getRating()))
                    .limit(10)
                    .map(user -> new SuggestionDTO(new UserDTO(user), (int)Math.floor(user.getRating())))
                    .collect(Collectors.toList());
        }

        List<SuggestionDTO> suggestions = usersToSuggest.stream()
                .map(user -> new SuggestionDTO(new UserDTO(user), calculateScore(currentUser, user)))
                .sorted((s1, s2) -> Integer.compare(s2.getScore(), s1.getScore()))
                .limit(10)
                .collect(Collectors.toList());

        return suggestions;
    }

    private int calculateScore(User currentUser, User otherUser) {
        int score = 0;

        // +10 if their offered skill matches your wanted skill
        for (String wantedSkill : currentUser.getSkillsWanted()) {
            if (otherUser.getSkillsOffered().contains(wantedSkill)) {
                score += 10;
            }
        }

        // +5 for each common wanted skill
        for (String wantedSkill : currentUser.getSkillsWanted()) {
            if (otherUser.getSkillsWanted().contains(wantedSkill)) {
                score += 5;
            }
        }

        // +3 for same branch
        if (currentUser.getBranch().equals(otherUser.getBranch())) {
            score += 3;
        }

        // +2 for same year
        if (currentUser.getYear().equals(otherUser.getYear())) {
            score += 2;
        }
        
        // +floor(rating) bonus points
        score += Math.floor(otherUser.getRating());

        return score;
    }
}
