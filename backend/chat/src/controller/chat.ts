import axios from "axios";
import TryCatch from "../config/TryCatch.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import Chat from "../models/chat.js";
import Messages from "../models/Messages.js";
import { Response } from "express";

// Type definitions for better type safety
interface ChatUser {
  _id: string;
  name: string;
  email?: string;
  avatar?: string;
}

interface MessageData {
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
}

export const createNewChat = TryCatch(async (req: any, res: Response) => {
  const userId = req.user?._id;
  const { otherUserId } = req.body;

  // Validation
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!otherUserId) {
    return res.status(400).json({ message: "Other user ID is required" });
  }

  if (userId === otherUserId) {
    return res
      .status(400)
      .json({ message: "Cannot create chat with yourself" });
  }

  // Check if chat already exists
  const existingChat = await Chat.findOne({
    users: { $all: [userId, otherUserId] },
  });

  if (existingChat) {
    return res.status(200).json({
      message: "Chat already exists",
      chatId: existingChat._id,
    });
  }

  // Create new chat
  const newChat = new Chat({
    users: [userId, otherUserId],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const savedChat = await newChat.save();

  res.status(201).json({
    message: "Chat created successfully",
    chatId: savedChat._id,
    chat: savedChat,
  });
});

export const getAllChats = TryCatch(async (req: any, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Find all chats for the user
  const chats = await Chat.find({
    users: { $in: [userId] },
  }).sort({ updatedAt: -1 });

  if (!chats.length) {
    return res.status(200).json({ chats: [] });
  }

  const chatWithUsers = await Promise.all(
    chats.map(async (chat) => {
      const otherUserId = chat.users.find(
        (user: any) => user.toString() !== userId.toString()
      );

      if (!otherUserId) {
        return null; // Skip invalid chats
      }

      // Fixed: Count unseen messages correctly (messages NOT sent by current user and not seen)
      const unseenCount = await Messages.countDocuments({
        chatId: chat._id,
        sender: { $ne: userId }, // Messages NOT sent by current user
        seen: false,
      });

      try {
        // Get other user's details
        const { data } = await axios.get(
          `http://localhost:5000/api/v1/user/${otherUserId}`,
          { timeout: 5000 } // Add timeout to prevent hanging
        );

        return {
          user: data,
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage,
            unseenCount,
          },
        };
      } catch (error) {
        console.error(`Error fetching user ${otherUserId}:`, error);
        // Return fallback user data
        return {
          user: {
            _id: otherUserId,
            name: "Unknown User",
            isActive: false,
          },
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage,
            unseenCount,
          },
        };
      }
    })
  );

  // Filter out null entries
  const validChats = chatWithUsers.filter((chat) => chat !== null);

  res.status(200).json({
    chats: validChats,
    total: validChats.length,
  });
});

export const sendMessage = TryCatch(async (req: any, res: Response) => {
  const senderId = req.user?._id;
  const { chatId, text } = req.body;
  const imageFile = req.file;

  // Validation
  if (!senderId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!chatId) {
    return res.status(400).json({ message: "Chat ID is required" });
  }

  // Must have either text or image
  if (!text?.trim() && !imageFile) {
    return res.status(400).json({ message: "Message content is required" });
  }

  // Find and validate chat
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  // Check if user is part of this chat
  const isUserInChat = chat.users.some(
    (user: any) => user.toString() === senderId.toString()
  );

  if (!isUserInChat) {
    return res.status(403).json({
      message: "You are not authorized to send messages in this chat",
    });
  }

  // Get the other user
  const otherUserId = chat.users.find(
    (user: any) => user.toString() !== senderId.toString()
  );
  if (!otherUserId) {
    return res
      .status(400)
      .json({ message: "Invalid chat: no other user found" });
  }

  // Prepare message data
  let messageData: MessageData = {
    chatId: chatId,
    sender: senderId,
    seen: false,
    messageType: "text",
  };

  if (imageFile) {
    messageData.image = {
      url: imageFile.path,
      publicId: imageFile.filename,
    };
    messageData.messageType = "image";
    if (text?.trim()) {
      messageData.text = text.trim();
    }
  } else {
    messageData.text = text.trim();
    messageData.messageType = "text";
  }

  // Create and save message
  const message = new Messages(messageData);
  const savedMessage = await message.save();

  // Update chat's latest message
  const latestMessageText = imageFile ? "📷 Image" : text.trim();
  await Chat.findByIdAndUpdate(
    chatId,
    {
      latestMessage: {
        text: latestMessageText,
        sender: senderId,
        createdAt: new Date(),
      },
      updatedAt: new Date(),
    },
    { new: true }
  );

  res.status(201).json({
    success: true,
    message: savedMessage,
    sender: senderId,
  });
});

export const getMessagesbyChat = TryCatch(async (req: any, res: Response) => {
  const userId = req.user?._id;
  const { chatId } = req.params;

  // Validation
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!chatId) {
    return res.status(400).json({ message: "Chat ID is required" });
  }

  // Find and validate chat
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  // Check if user is part of this chat
  const isUserInChat = chat.users.some(
    (user: any) => user.toString() === userId.toString()
  );

  if (!isUserInChat) {
    return res
      .status(403)
      .json({ message: "You are not authorized to access this chat" });
  }

  // Mark messages as seen (only messages sent by OTHER users)
  await Messages.updateMany(
    {
      chatId,
      seen: false,
      sender: { $ne: userId }, // Only mark messages NOT sent by current user as seen
    },
    {
      seen: true,
      seenAt: new Date(),
    }
  );

  // Get all messages for this chat
  const messages = await Messages.find({ chatId }).sort({ createdAt: 1 });

  // Get other user details
  const otherUserId = chat.users.find(
    (user: any) => user.toString() !== userId.toString()
  );
  if (!otherUserId) {
    return res
      .status(400)
      .json({ message: "Invalid chat: no other user found" });
  }

  try {
    const { data } = await axios.get(
      `http://localhost:5000/api/v1/user/${otherUserId}`,
      { timeout: 5000 } // Add timeout
    );

    res.status(200).json({
      success: true,
      messages,
      user: data,
      chatId,
      totalMessages: messages.length,
    });
  } catch (error) {
    console.error(`Error fetching user ${otherUserId}:`, error);

    // Return messages with fallback user data
    res.status(200).json({
      success: true,
      messages,
      user: {
        _id: otherUserId,
        name: "Unknown User",
        isActive: false,
      },
      chatId,
      totalMessages: messages.length,
      warning: "Could not fetch user details",
    });
  }
});

export const markMessagesAsSeen = TryCatch(async (req: any, res: Response) => {
  const userId = req.user?._id;
  const { chatId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!chatId) {
    return res.status(400).json({ message: "Chat ID is required" });
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  const isUserInChat = chat.users.some(
    (user: any) => user.toString() === userId.toString()
  );

  if (!isUserInChat) {
    return res
      .status(403)
      .json({ message: "You are not authorized to access this chat" });
  }

  // Mark messages as seen
  const result = await Messages.updateMany(
    {
      chatId,
      seen: false,
      sender: { $ne: userId },
    },
    {
      seen: true,
      seenAt: new Date(),
    }
  );

  res.status(200).json({
    success: true,
    message: "Messages marked as seen",
    modifiedCount: result.modifiedCount,
  });
});
