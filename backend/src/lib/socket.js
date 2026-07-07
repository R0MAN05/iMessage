import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

// Parse allowed origins (comma-separated for multiple)
const origins = allowedOrigin.split(",").map(o => o.trim());

const io = new Server(server, {
  cors: {
    origin: origins,
    credentials: true,
    methods: ["GET", "POST"]
  },
  // Render free tier: use polling first, websocket as upgrade
  // Increase timeouts for Render's proxy
  pingInterval: 25000,
  pingTimeout: 60000,
  transports: ["polling", "websocket"],
  // Allow upgrades but don't force websocket
  allowUpgrades: true,
  upgradeTimeout: 30000,
});

function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// online users map = {userId: socketId}
const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", (reason) => {
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log(`User ${userId} disconnected: ${reason}`);
  });

  // Handle connection errors
  socket.on("connect_error", (err) => {
    console.error(`Socket connection error for ${userId}:`, err.message);
  });
});

// Log socket.io server status
io.engine.on("connection_error", (err) => {
  console.error("Socket.io connection error:", err.code, err.message);
});

export { app, server, io, getReceiverSocketId };