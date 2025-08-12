import { Server } from "socket.io";
import http from "http";
import express from "express";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const userSocketMap = {};
io.on("connection", (socket) => {
    console.log("User Connected", socket.id);
    const userId = socket.handshake.query.user;
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log(userSocketMap);
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
});
export { app, server, io };
