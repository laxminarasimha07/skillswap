package com.skillswap.controller;

import com.skillswap.dto.response.MessageDTO;
import com.skillswap.model.Message;
import com.skillswap.model.User;
import com.skillswap.repository.MessageRepository;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatService chatService;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<MessageDTO>> getChatHistory(@PathVariable Long userId) {
        User currentUser = getCurrentUser();

        List<Message> messages = messageRepository.findChatHistory(currentUser.getId(), userId);

        List<MessageDTO> messageDTOs = messages.stream()
                .map(MessageDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(messageDTOs);
    }

    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(@RequestParam Long receiverId, 
                                                   @RequestBody SendMessageRequest request) {
        User sender = getCurrentUser();
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setMessage(request.getMessage());
        message.setFileUrl(request.getFileUrl());

        Message savedMessage = chatService.saveMessage(message);
        return ResponseEntity.ok(new MessageDTO(savedMessage));
    }

    @PostMapping("/batchSave")
    public ResponseEntity<?> batchSaveMessages(@RequestBody List<Message> messages) {
        messageRepository.saveAll(messages);
        return ResponseEntity.ok().build();
    }

    public static class SendMessageRequest {
        private String message;
        private String fileUrl;

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getFileUrl() {
            return fileUrl;
        }

        public void setFileUrl(String fileUrl) {
            this.fileUrl = fileUrl;
        }
    }
}
