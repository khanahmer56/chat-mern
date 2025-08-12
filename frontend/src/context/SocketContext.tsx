"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { chat_service, useAppData } from "./AppContext";

interface SocketContextType {
  socket: Socket | null;
  onlineeUsers: string[] | null;
}
interface SocketProviderProps {
  children: React.ReactNode;
}
const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAppData();
  const [onlineeUsers, setOnlineeUsers] = useState<string[] | null>(null);
  useEffect(() => {
    if (!user?._id) return;
    const newsocket = io(chat_service, {
      query: {
        user: user?._id,
      },
    });
    setSocket(newsocket);
    newsocket.on("getOnlineUsers", (users: string[]) => {
      setOnlineeUsers(users);
    });
    return () => {
      newsocket.disconnect();
    };
  }, [user?._id]);
  return (
    <SocketContext.Provider value={{ socket, onlineeUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
