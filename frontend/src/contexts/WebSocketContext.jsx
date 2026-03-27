import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const client = new Client({
        webSocketFactory: () => {
          const isSecure = window.location.protocol === 'https:';
          const defaultUrl = isSecure 
            ? 'https://swapskill-backend-3a00.onrender.com/ws' 
            : 'http://localhost:10000/ws';
          return new SockJS(import.meta.env.VITE_WS_URL || defaultUrl);
        },
        connectHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        reconnectDelay: 3000,
        debug: (str) => {
          // Enable this while debugging delivery issues
          console.log(str);
        },
        onConnect: () => {
          setStompClient(client);
        },
        onStompError: (frame) => {
          console.error('Broker reported error: ' + frame.headers['message']);
          console.error('Additional details: ' + frame.body);
        },
        onWebSocketError: (evt) => {
          console.error('WebSocket error', evt);
        },
      });

      client.activate();

      return () => {
        if (client.connected) {
          client.deactivate();
        }
      };
    } else if (stompClient) {
      stompClient.deactivate();
      setStompClient(null);
    }
  }, [isAuthenticated, user]);

  return (
    <WebSocketContext.Provider value={stompClient}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
