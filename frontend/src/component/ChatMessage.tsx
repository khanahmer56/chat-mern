import { Message } from "@/app/chat/page";
import { User } from "@/context/AppContext";
import {
  Clock,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Download,
  Maximize2,
} from "lucide-react";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  selectedUser: any;
  messages: Message[] | null;
  loggedInUser: User | null;
}

// Image Modal Component
const ImageModal = ({
  src,
  alt,
  isOpen,
  onClose,
}: {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full">
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const ChatMessage = ({ selectedUser, messages, loggedInUser }: Props) => {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const uniqueMessages = useMemo(() => {
    if (!messages) return [];
    const seen = new Set();
    return messages.filter((message) => {
      if (seen.has(message._id)) return false;
      seen.add(message._id);
      return true;
    });
  }, [messages]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedUser, uniqueMessages]);

  // Helper function to detect if message contains an image URL
  const isImageUrl = (text: string) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    try {
      const url = new URL(text);
      return imageRegex.test(url.pathname);
    } catch {
      return imageRegex.test(text);
    }
  };

  // Helper function to format time
  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Helper function to check if messages are from the same day
  const isSameDay = (date1: string | Date, date2: string | Date) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.toDateString() === d2.toDateString();
  };

  // Helper function to format date
  const formatDate = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  return (
    <>
      <div className="flex-1 overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-green-400 to-blue-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="h-full max-h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent relative z-10">
          {!selectedUser ? (
            /* Empty State */
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    Ready to chat?
                  </h3>
                  <p className="text-gray-400">
                    Select a conversation to start messaging
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {uniqueMessages.map((message, index) => {
                const isSentByme = message.sender === loggedInUser?._id;
                const uniqueKey = `${message._id}-${index}`;
                return (
                  <div
                    className={`flex flex-col gap-1 ${
                      isSentByme ? "items-end" : "items-start"
                    } `}
                    key={uniqueKey}
                  >
                    <div
                      className={`rounded-lg p-3 max-w-sm ${
                        isSentByme
                          ? "bg-blue-500 text-white"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      {message.messageType === "image" && message.image && (
                        <img
                          src={message.image.url}
                          alt="Sent Image"
                          className="w-full h-full object-cover"
                        />
                      )}
                      {message.messageType === "text" && (
                        <span className="mt-2">{message.text}</span>
                      )}
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs text-gray-400 ${
                        isSentByme ? "justify-end" : "justify-start"
                      }`}
                    >
                      {moment(message.createdAt).format("hh:mm A . MMM D")}
                    </div>
                    {isSentByme && (
                      <div className="flex items-center ml-1">
                        {message?.seen ? (
                          <div className="flex items-center gap-1 text-blue-400">
                            <CheckCheck className="w-3 h-3" />
                            {message?.seenAt && (
                              <span>
                                {moment(message?.seenAt).format("hh:mm A")}
                              </span>
                            )}
                          </div>
                        ) : (
                          <Check className="w-3 h-3 text-gray-500" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatMessage;
