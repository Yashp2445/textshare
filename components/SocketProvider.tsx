"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  isFallbackMode: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  isFallbackMode: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  useEffect(() => {
    // Attempt socket connection with timeout
    const socketInstance = io(window.location.origin, {
      timeout: 3000,
      reconnectionAttempts: 3,
      transports: ['websocket', 'polling'],
    });

    const fallbackTimer = setTimeout(() => {
      if (!socketInstance.connected) {
        setIsFallbackMode(true);
        setIsConnected(true);
      }
    }, 3000);

    socketInstance.on('connect', () => {
      clearTimeout(fallbackTimer);
      setIsFallbackMode(false);
      setIsConnected(true);
    });

    socketInstance.on('connect_error', () => {
      setIsFallbackMode(true);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsFallbackMode(true);
      setIsConnected(true);
    });

    setSocket(socketInstance);

    return () => {
      clearTimeout(fallbackTimer);
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, isFallbackMode }}>
      {children}
    </SocketContext.Provider>
  );
};
