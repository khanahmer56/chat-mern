import { Chats, User } from "@/context/AppContext";
import { MessageCircle, Plus, Search, UserCircle, X } from "lucide-react";
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
}: ChatSideBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <aside
      className={`fixed z-20 sm:static top-0 left-0 h-screen w-72 bg-gray-900 border-r border-gray-700 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}
    >
      <div className="p-6 border-b border-gray-700">
        <div className="sm:hidden flex justify-end mb-0">
          <button
            className="p-2 hover:bg-gray-500 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 justify-between">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              {showAllUsers ? "New Chats" : "Messages"}
            </h2>
          </div>
          <button
            className={`p-2.5 rounded-lg transition-colors text-white ${
              showAllUsers
                ? "bg-red-600  hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700 "
            }`}
            onClick={() => setShowAllUsers(!showAllUsers)}
          >
            {showAllUsers ? (
              <X className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden px-4 py-2">
        {showAllUsers ? (
          <div className="space-y-4 h-full">
            <div className="relative">
              <Search className="w-4 h-4 absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-2 overflow-y-auto h-full">
              {users
                ?.filter(
                  (u: any) =>
                    u._id !== loggedInUser?._id &&
                    u.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((user: any) => (
                  <button
                    key={user._id}
                    className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-700"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <UserCircle className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-white">
                          {user?.name}
                        </span>
                        <div className="text-xs text-gray-400 mt-0.5"></div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </aside>
  );
};

export default ChatSideBar;
