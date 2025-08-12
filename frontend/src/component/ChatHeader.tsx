import { User } from "@/context/AppContext";
import { useSocket } from "@/context/SocketContext";
import { Menu, UserCircle, Circle } from "lucide-react";
import React from "react";

interface ChatHeaderProps {
  user: any;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isTyping: boolean;
}

const ChatHeader = ({ user, setSidebarOpen, isTyping }: ChatHeaderProps) => {
  console.log(user);
  const socket = useSocket();
  console.log(socket);
  return (
    <div className="relative">
      {/* Mobile Menu Button */}
      <div className="sm:hidden fixed top-4 right-4 z-30">
        <button
          className="p-3 bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 rounded-xl transition-all duration-300 shadow-lg border border-gray-600/50 group"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-200" />
        </button>
      </div>

      {/* Main Header */}
      <div className="mb-6 relative">
        {/* Glassmorphism background with gradient border */}
        <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-600/30 p-6 shadow-2xl overflow-hidden">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-50"></div>

          {/* Subtle animated background pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-4 left-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-4 right-4 w-24 h-24 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-6">
              {user ? (
                <>
                  {/* User Avatar Section */}
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-xl border border-gray-600/50 group-hover:scale-105 transition-all duration-300">
                      <UserCircle className="w-10 h-10 text-gray-300 group-hover:text-white transition-colors duration-200" />
                    </div>

                    {/* Online Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-gray-800 shadow-lg">
                      <div className="w-full h-full rounded-full bg-green-400 animate-pulse"></div>
                    </div>

                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                  </div>

                  {/* User Info Section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent truncate">
                        {user?.name}
                      </h2>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-1 bg-gray-700/50 rounded-full border border-gray-600/30">
                        <Circle className="w-2 h-2 fill-green-400 text-green-400 animate-pulse" />
                        <span className="text-sm text-gray-300 font-medium">
                          {isTyping ? "Typing..." : "Active now"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Element */}
                  <div className="hidden md:block">
                    <div className="w-1 h-16 bg-gradient-to-b from-transparent via-gray-600/50 to-transparent rounded-full"></div>
                  </div>
                </>
              ) : (
                <>
                  {/* No User Selected State */}
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700/50 to-gray-800/50 flex items-center justify-center shadow-xl border border-gray-600/30">
                      <UserCircle className="w-10 h-10 text-gray-400" />
                    </div>

                    {/* Subtle pulse animation */}
                    <div className="absolute inset-0 rounded-2xl bg-gray-600/20 animate-pulse"></div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
                      Select a conversation
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Choose a chat to start messaging
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
      </div>
    </div>
  );
};

export default ChatHeader;
