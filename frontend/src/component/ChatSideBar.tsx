import { Chats, User } from "@/context/AppContext";
import {
  LogOut,
  MessageCircle,
  Plus,
  Search,
  UserCircle,
  X,
  Hash,
  Circle,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface ChatSideBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showAllUsers: boolean;
  setShowAllUsers: React.Dispatch<React.SetStateAction<boolean>>;
  users: any;
  loggedInUser: User | null;
  chats: Chats[] | null;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  handleLogout: () => void;
  createNewChat: (u: any) => void;
}

const ChatSideBar = ({
  sidebarOpen,
  setSidebarOpen,
  showAllUsers,
  setShowAllUsers,
  users,
  loggedInUser,
  chats,
  selectedUser,
  setSelectedUser,
  handleLogout,
  createNewChat,
}: ChatSideBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <aside
      className={`fixed z-20 sm:static top-0 left-0 h-screen w-80 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 border-r border-gray-700/50 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 transition-transform duration-500 ease-out flex flex-col shadow-2xl`}
    >
      {/* Header Section */}
      <div className="relative p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-2 right-2 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl"></div>
        </div>

        {/* Mobile Close Button */}
        <div className="sm:hidden flex justify-end mb-4">
          <button
            className="p-2 hover:bg-gray-700/50 rounded-xl transition-all duration-300 group backdrop-blur-sm border border-gray-600/30"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
          </button>
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                {showAllUsers ? "Discover" : "Messages"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {showAllUsers
                  ? "Find new connections"
                  : `${chats?.length || 0} conversations`}
              </p>
            </div>
          </div>

          <button
            className={`relative p-3 rounded-xl transition-all duration-300 text-white group overflow-hidden ${
              showAllUsers
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-red-500/30"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-green-500/30"
            }`}
            onClick={() => setShowAllUsers(!showAllUsers)}
          >
            <div className="relative z-10">
              {showAllUsers ? (
                <X className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
              ) : (
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
              )}
            </div>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-hidden px-4 py-4 relative">
        {showAllUsers ? (
          /* All Users View */
          <div className="space-y-4 h-full">
            {/* Search Bar */}
            <div className="relative group">
              <Search className="w-4 h-4 absolute top-3.5 left-4 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Users List */}
            <div className="space-y-2 overflow-y-auto h-full pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {users
                ?.filter(
                  (u: any) =>
                    u._id !== loggedInUser?._id &&
                    u.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((user: any, index: number) => (
                  <button
                    key={user._id}
                    className="w-full group relative overflow-hidden"
                    onClick={() => {
                      // setSelectedUser(user._id);
                      createNewChat(user._id);
                    }}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-800/50 transition-all duration-300 border border-transparent hover:border-gray-600/30 backdrop-blur-sm">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <UserCircle className="w-7 h-7 text-gray-300 group-hover:text-white transition-colors" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full border-2 border-gray-900"></div>
                      </div>

                      <div className="flex-1 min-w-0 text-left">
                        <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
                          {user?.name}
                        </h3>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                          Start a conversation
                        </p>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Plus className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ) : chats && chats.length > 0 ? (
          /* Chats List */
          <div className="space-y-3 overflow-y-auto h-full pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {chats?.map((chat: any, index: number) => {
              const selected = chat.chat._id === selectedUser;
              const latestMessage = chat.chat.latestMessage;
              const isSentByMe = latestMessage?.sender === loggedInUser?._id;
              const unseenCount = chat.chat.unseenCount;
              const isOnline = chat.user.isOnline;

              return (
                <button
                  key={chat.chat._id}
                  className={`w-full group relative overflow-hidden transition-all duration-300 ${
                    selected ? "scale-[0.98]" : "hover:scale-[1.02]"
                  }`}
                  onClick={() => {
                    setSelectedUser(chat.chat._id);
                    setSidebarOpen(false);
                  }}
                  style={{
                    animationDelay: `${index * 30}ms`,
                  }}
                >
                  <div
                    className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 backdrop-blur-sm ${
                      selected
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 shadow-lg shadow-blue-500/10"
                        : "hover:bg-gray-800/50 border-gray-700/30 hover:border-gray-600/50"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                          selected
                            ? "bg-gradient-to-br from-blue-600 to-purple-600"
                            : "bg-gradient-to-br from-gray-700 to-gray-800 group-hover:from-gray-600 group-hover:to-gray-700"
                        }`}
                      >
                        <UserCircle
                          className={`w-8 h-8 transition-colors ${
                            selected
                              ? "text-white"
                              : "text-gray-300 group-hover:text-white"
                          }`}
                        />
                      </div>

                      {/* Online Status */}
                      {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-gray-900 shadow-lg">
                          <div className="w-full h-full rounded-full bg-green-400 animate-pulse"></div>
                        </div>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3
                          className={`font-semibold truncate transition-colors ${
                            selected
                              ? "text-white"
                              : "text-white group-hover:text-blue-300"
                          }`}
                        >
                          {chat.user.name}
                        </h3>

                        {unseenCount > 0 && (
                          <div className="shrink-0 px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg">
                            <span className="text-xs text-white font-medium">
                              {unseenCount > 99 ? "99+" : unseenCount}
                            </span>
                          </div>
                        )}
                      </div>

                      <p
                        className={`text-sm truncate transition-colors ${
                          selected
                            ? "text-gray-300"
                            : "text-gray-400 group-hover:text-gray-300"
                        }`}
                      >
                        {latestMessage?.text
                          ? `${isSentByMe ? "You: " : ""}${latestMessage.text}`
                          : "Start a conversation..."}
                      </p>
                    </div>

                    {/* Selection Indicator */}
                    {selected && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <MessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  No conversations yet
                </h3>
                <p className="text-gray-400 text-sm">
                  Start a new chat to begin messaging
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="relative p-4 border-t border-gray-700/50 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm space-y-2">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-2 left-2 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full blur-xl"></div>
        </div>

        <Link
          href="/profile"
          className="relative flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-800/50 transition-all duration-300 group border border-transparent hover:border-gray-600/30 backdrop-blur-sm"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-300">
            <UserCircle className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
          </div>
          <span className="font-medium text-white group-hover:text-blue-300 transition-colors">
            Profile Settings
          </span>
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Hash className="w-4 h-4 text-gray-400 rotate-45" />
          </div>
        </Link>

        <button
          className="relative w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-all duration-300 group border border-transparent hover:border-red-500/30 backdrop-blur-sm"
          onClick={handleLogout}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center group-hover:from-red-500/30 group-hover:to-red-600/30 transition-all duration-300">
            <LogOut className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors" />
          </div>
          <span className="font-medium text-red-400 group-hover:text-red-300 transition-colors">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
};

export default ChatSideBar;
