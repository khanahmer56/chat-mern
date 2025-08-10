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
  const [slectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showAllUser, setShowAllUser] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeOut, setTypingTimeOut] = useState<NodeJS.Timeout | null>(
    null
  );
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
  useEffect(() => {
    if (slectedUser) {
      fetchChat();
    }
  }, [slectedUser]);
  return (
    <div className="min-h-screen flex bg-gray-900 text-white relative overflow-hidden">
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
      />
      <div className="flex-1 flex flex-col justify-between p-4 backdrop-blur-xl bg-white/10 border-1 border-white/10">
        <ChatHeader
          user={user}
          setSidebarOpen={setSidebarOpen}
          isTyping={isTyping}
        />
        <ChatMessage
          selectedUser={slectedUser}
          messages={messages}
          loggedInUser={loggedinUser}
        />
      </div>
    </div>
  );
};

export default ChatApp;
