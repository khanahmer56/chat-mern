import { Paperclip, X, Send, Image, Loader2 } from "lucide-react";
import React, { useState, useRef } from "react";

interface MessageInputProps {
  selectedUser: any;
  message: any;
  setMessage: any;
  handleSendMessage: any;
}

const MessageInput = ({
  selectedUser,
  message,
  setMessage,
  handleSendMessage,
}: MessageInputProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if ((!message.trim() && !imageFile) || isUploading) return;

    if (imageFile) {
      setIsUploading(true);
      try {
        await handleSendMessage(e, imageFile);
        setImageFile(null);
      } catch (error) {
        console.error("Failed to send image:", error);
      } finally {
        setIsUploading(false);
      }
    } else {
      await handleSendMessage(e);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
    } else {
      alert("Please select an image file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!selectedUser) {
    return (
      <div className="p-6 border-t border-gray-700/50 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm">
        <div className="flex items-center justify-center">
          <p className="text-gray-400 text-center flex items-center gap-2">
            <Image size={20} className="opacity-50" />
            Select a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Drag & Drop Overlay */}
      {dragActive && (
        <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm border-2 border-dashed border-blue-400 rounded-2xl flex items-center justify-center z-10">
          <div className="text-center">
            <Image size={48} className="text-blue-400 mx-auto mb-2" />
            <p className="text-blue-400 font-medium">Drop image here</p>
          </div>
        </div>
      )}

      <div
        className="p-4 border-t border-gray-700/50 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Preview */}
          {imageFile && (
            <div className="animate-fade-in-up">
              <div className="relative inline-block group">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-600/50">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="w-48 h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Upload Progress Overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <Loader2
                          size={32}
                          className="text-white animate-spin mx-auto mb-2"
                        />
                        <p className="text-white text-sm font-medium">
                          Uploading...
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={isUploading}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-red-500/30 group disabled:cursor-not-allowed"
                >
                  <X
                    size={16}
                    className="text-white group-hover:scale-110 transition-transform"
                  />
                </button>

                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-2xl">
                  <p className="text-white text-xs font-medium truncate">
                    {imageFile.name}
                  </p>
                  <p className="text-gray-300 text-xs">
                    {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="relative">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl"></div>

            <div className="relative flex items-center gap-3 p-3 bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-600/30 hover:border-gray-500/50 focus-within:border-blue-500/50 focus-within:shadow-lg focus-within:shadow-blue-500/10 transition-all duration-300">
              {/* File Upload Button */}
              <label className="flex-shrink-0 cursor-pointer group">
                <div className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 shadow-lg hover:shadow-gray-700/30">
                  <Paperclip
                    size={18}
                    className="text-gray-300 group-hover:text-white transition-colors"
                  />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>

              {/* Text Input */}
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  imageFile
                    ? "Add a caption..."
                    : `Message ${selectedUser?.name || "someone"}...`
                }
                disabled={isUploading}
                className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none py-2 px-2 disabled:opacity-50"
                autoComplete="off"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={(!message.trim() && !imageFile) || isUploading}
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg ${
                  (message.trim() || imageFile) && !isUploading
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-blue-500/30"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed hover:shadow-none"
                }`}
              >
                {isUploading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} className="translate-x-0.5" />
                )}
              </button>
            </div>
          </div>

          {/* File Upload Info */}
          <div className="flex items-center justify-between text-xs text-gray-400 px-1">
            <span>Drag & drop images or click to browse</span>
            <span>Max 5MB</span>
          </div>
        </form>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MessageInput;
