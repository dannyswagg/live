const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Use CLIENT_URL for production, fallback for local
    methods: ["GET", "POST"],
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["POST", "GET"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });
});

module.exports = server; // Export server for Vercel
