package com.skillswap.controller;

import com.skillswap.dto.request.ChatMessage;
import com.skillswap.dto.response.MessageDTO;
import com.skillswap.model.Message;
import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserRepository userRepository;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage chatMessage, Principal principal) {
        Long senderId = Long.parseLong(principal.getName());
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(chatMessage.getReceiverId()).get();

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setMessage(chatMessage.getMessage());
        message.setFileUrl(chatMessage.getFileUrl());

        Message savedMessage = chatService.saveMessage(message);
        MessageDTO dto = new MessageDTO(savedMessage);

        messagingTemplate.convertAndSendToUser(
                receiver.getId().toString(),
                "/queue/messages",
                dto
        );

        // Echo to sender too so the UI can render the persisted message (id/timestamp).
        messagingTemplate.convertAndSendToUser(
                sender.getId().toString(),
                "/queue/messages",
                dto
        );
    }
}
