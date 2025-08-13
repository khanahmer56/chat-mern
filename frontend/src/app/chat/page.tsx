"use client";
import ChatSideBar from "@/component/ChatSideBar";
import { chat_service, useAppData, User } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import ChatHeader from "@/component/ChatHeader";
import ChatMessage from "@/component/ChatMessage";
import MessageInput from "@/component/MessageInput";
import { useSocket } from "@/context/SocketContext";

export interface Message {
  _id: string;
  chatId: string;
  sender: string;
  text?: string;
  image?: {
    url: string;
    publicId: string;
  };
  messageType: "text" | "image";
  seen: boolean;
  seenAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
const ChatApp = () => {
  const {
    isAuth,
    loading,
    logout,
    chats,
    user: loggedinUser,
    users,
    fetchChats,
    setChats,
  } = useAppData();
  const [slectedUser, setSelectedUser] = useState<any | null>(null);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showAllUser, setShowAllUser] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeOut, setTypingTimeOut] = useState<NodeJS.Timeout | null>(
    null
  );
  const { onlineeUsers = [], socket } = useSocket();
  console.log(onlineeUsers);
  console.log("userr", user);
  const router = useRouter();
  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, loading, router]);
  const handleLogout = () => {
    logout();
  };

  const fetchChat = async () => {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.get(
        `${chat_service}/api/v1/message/${slectedUser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      setMessages(data?.messages);
      setUser(data?.user);
      await fetchChats();
    } catch (error) {
      console.error("Error fetching chat:", error);
      toast.error("Error fetching chat");
    }
  };
  const createNewChat = async (u: any) => {
    console.log("userid", u);
    try {
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${chat_service}/api/v1/create-chat`,
        { userId: loggedinUser?._id, otherUserId: u },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedUser(data?.chatId);
      setShowAllUser(false);
      fetchChats();
    } catch (error) {
      toast.error("Error creating new chat");
    }
  };
  const handleSendMessage = async (e: any, imageFile?: File | null) => {
    e.preventDefault();
    if (!message.trim() && !imageFile) return;
    if (!slectedUser) return;
    if (typingTimeOut) {
      clearTimeout(typingTimeOut);
      setTypingTimeOut(null);
    }
    socket?.emit("stopTyping", {
      chatId: slectedUser,
      userId: loggedinUser?._id,
    });
    const token = Cookies.get("token");
    try {
      const formData = new FormData();
      formData.append("chatId", slectedUser);

      if (message.trim()) {
        formData.append("text", message);
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }
      const { data } = await axios.post(
        `${chat_service}/api/v1/message`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(data);
      setMessages((prev) => [...prev, data?.message]);
      setMessage("");
      const disPlayText = imageFile ? "📷 image" : "";
      fetchChat();
    } catch (error) {
      toast.error("Error sending message");
    }
  };
  const handleTyping = (value: string) => {
    setMessage(value);
    if (!slectedUser) return;
    if (value.trim()) {
      socket?.emit("typing", {
        chatId: slectedUser,
        userId: loggedinUser?._id,
      });

      if (typingTimeOut) {
        clearTimeout(typingTimeOut);
      }
      setTypingTimeOut(
        setTimeout(() => {
          socket?.emit("stopTyping", {
            chatId: slectedUser,
            userId: loggedinUser?._id,
          });
        }, 1000)
      );
    }
  };

  useEffect(() => {
    if (slectedUser) {
      fetchChat();
      setIsTyping(false);
      socket?.emit("joinChat", slectedUser);
    }
    return () => {
      socket?.emit("leaveChat", slectedUser);
      setMessages([]);
    };
  }, [slectedUser, socket]);
  useEffect(() => {
    if (socket) {
      socket.on("userTyping", (data) => {
        if (data?.userId == slectedUser && data?.userId == loggedinUser?._id)
          setIsTyping(true);
      });
      socket.on("userStopTyping", (data) => {
        setIsTyping(false);
      });
    }
    return () => {
      if (socket) {
        socket.off("userTyping");
        socket.off("userStopTyping");
      }
    };
  }, [socket, slectedUser, loggedinUser?._id]);
  return (
    <div className="h-screen flex bg-gray-900 text-white relative overflow-hidden">
      <ChatSideBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showAllUsers={showAllUser}
        setShowAllUsers={setShowAllUser}
        users={users}
        loggedInUser={loggedinUser}
        chats={chats}
        selectedUser={slectedUser}
        setSelectedUser={setSelectedUser}
        handleLogout={handleLogout}
        createNewChat={createNewChat}
        onlineeUsers={onlineeUsers}
      />
      <div className="flex-1 flex flex-col justify-between p-4 backdrop-blur-xl bg-white/10 border-1 border-white/10">
        <ChatHeader
          user={user}
          setSidebarOpen={setSidebarOpen}
          isTyping={isTyping}
          onlineeUsers={onlineeUsers}
        />
        <ChatMessage
          selectedUser={slectedUser}
          messages={messages}
          loggedInUser={loggedinUser}
        />
        <MessageInput
          selectedUser={slectedUser}
          message={message}
          setMessage={handleTyping}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatApp;
