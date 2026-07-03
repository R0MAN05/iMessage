import express from "express";
import http from "http";
import {server} from "socket.io";


const app = express();

const server = http.createServer(app);

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(server,{cors: {origin: [allowedOrigin] } });    //call the new socket Server with http server.

function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

// online users map = {userId: socketId}
const userSocketMap = {};

io.on("connection", (socket) => {   //(socket) is basically a user which is connected, its an object.  "connection" it must be this string to work.

    const userId = socket.handshake.query.userId;   //this field is gonna be sent from frontend and receive here.
    if(userId) userSocketMap[userId] = socket.id;   //if there's a userId then put that id into online users object array i.e. userSocketMap.

    // io.emit() sends event to everyone - broadcast.
    io.emit("getOnlineUsers", Object.keys(userSocketMap) );  //here broadcasting the online userId to everyone. "" anything is allowed in the string. 

    // socket.on() listens for events.
    socket.on("disconnect", () => {  // ."disconnect" it must be this string to work.
        if(userId) delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap) );   //broadcast who went offline/ disconnected.
    });  
});

export {app, server, io, getReceiverSocketId};