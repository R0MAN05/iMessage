import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import { hasImageKitConfig, uploadChatMedia } from "../lib/imagekit.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import axios from "axios";

export async function getUsersForSidebar(req, res) {
  try {
    const loggedInUserId = req.user._id; // comes form our auth middelware we have set req.user = user; there which gets the current loggedin user id.

    const filteredUser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-clerkId"); //gets all the user and their model info except the loggedin user (ourselves).

    res.status(200).json(filteredUser);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getConversationForSidebar(req, res) {
  try {
    const loggedInUserId = req.user._id;
    const conversations = await Message.aggregate([
      // 1. Keep only the messages I sent or received.
      {
        $match: {
          $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        },
      },
      // 2. Collapse them into one row per chat partner, noting our latest message time.
      {
        $group: {
          // The partner is the other person on the message (not me).
          _id: {
            $cond: [
              { $eq: ["$senderId", loggedInUserId] },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessageAt: { $max: "$createdAt" },
        },
      },
      // 3. Put the most recent conversation at the top.
      { $sort: { lastMessageAt: -1 } },
      // 4. Look up each partner's user profile (comes back as an array).
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      // 5. Pull that profile out of the array and make it the document.
      { $replaceRoot: { newRoot: { $first: "$user" } } },
      // 6. Hide the private clerkId field from the result.
      { $project: { clerkId: 0 } },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error in getConversationForSidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getConversationMessages(req, res) {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getConversationMessages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendMessage(req, res) {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    let videoUrl;

    if (req.file) {
      if (!hasImageKitConfig()) {
        return res
          .status(500)
          .json({ message: "Media upload is not configured" });
      }

      const url = await uploadChatMedia(req.file);
      if (req.file.mimetype.startsWith("video/")) videoUrl = url;
      else imageUrl = url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      video: videoUrl,
    });
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      //only send the message in realtime if the user is online.
      io.emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteMessage(req, res) {
  try {
    const { id: messageId } = req.params;
    const userId = req.user._id;
    const { forEveryone } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const isSender = String(message.senderId) === String(userId);
    const isReceiver = String(message.receiverId) === String(userId);

    // Allow both sender and receiver to delete
    if (!isSender && !isReceiver) {
      return res.status(403).json({ message: "Not authorized to delete this message" });
    }

    await Message.findByIdAndDelete(messageId);

    // Emit socket event to both parties for real-time deletion
    const senderSocketId = getReceiverSocketId(message.senderId);
    const receiverSocketId = getReceiverSocketId(message.receiverId);

    if (senderSocketId) {
      io.to(senderSocketId).emit("deleteMessage", { messageId, forEveryone });
    }
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("deleteMessage", { messageId, forEveryone });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error in deleteMessage:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function downloadMedia(req, res) {
  try {
    const { id: messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if user is part of this conversation
    const isSender = String(message.senderId) === String(userId);
    const isReceiver = String(message.receiverId) === String(userId);

    if (!isSender && !isReceiver) {
      return res.status(403).json({ message: "Not authorized to download this media" });
    }

    const mediaUrl = message.image || message.video;
    if (!mediaUrl) {
      return res.status(404).json({ message: "No media found in this message" });
    }

    // Fetch the file from ImageKit and stream it to the client
    const response = await axios.get(mediaUrl, {
      responseType: "stream",
      timeout: 30000,
    });

    const contentType = response.headers["content-type"] || "application/octet-stream";
    const contentDisposition = response.headers["content-disposition"] || `attachment; filename="media"`;

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", contentDisposition);
    res.setHeader("Cache-Control", "private, max-age=3600");

    response.data.pipe(res);
  } catch (error) {
    console.error("Error in downloadMedia:", error.message);
    res.status(500).json({ message: "Failed to download media" });
  }
}
