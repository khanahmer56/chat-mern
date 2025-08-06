"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export const user_service = "http://localhost:5000";
export const chat_service = "http://localhost:5002";
export interface User {
  _id: string;
  users: string;
  email: string;
}
export interface Chat {
  _id: string;
  users: string[];
  latestMessage: {
    text: string;
    sender: string;
  };
  createdAt: string;
  updatedAt: string;
  unseenCount?: number;
}
export interface Chats {
  _id: string;
  user: User;
  chat: Chat;
}
interface AppContextType {
  user: User | null;
  loading: boolean;
  isAuth: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
  fetchUser: () => void;
  chats: Chats[] | null;
  setChats: React.Dispatch<React.SetStateAction<Chats[]>>;
  fetchChats: () => void;
  users: User[] | null;
  setUsers: React.Dispatch<React.SetStateAction<User[] | null>>;
}
const AppContext = createContext<AppContextType | undefined>(undefined);
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<Chats[]>([]);
  const [users, setUsers] = useState<User[] | null>(null);
  async function fetchUser() {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.get(`${user_service}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  }
  async function logout() {
    Cookies.remove("token");
    setUser(null);
    setIsAuth(false);
    toast.success("Logout successfully");
  }
  const fetchChats = async () => {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.get(`${chat_service}/api/v1/get-all-chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChats(data?.chats);
    } catch (error) {
      console.log("error", error);
    }
  };
  const getUsers = async () => {
    const token = Cookies.get("token");
    try {
      const { data } = await axios.get(`${user_service}/api/v1/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(data);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    fetchUser();
    fetchChats();
    getUsers();
  }, []);
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        loading,
        logout,
        fetchUser,
        fetchChats,
        chats,
        setChats,
        users,
        setUsers,
      }}
    >
      {children}
      <Toaster />
    </AppContext.Provider>
  );
};
export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("UseappData must be used within AppProvider");
  }
  return context;
};
