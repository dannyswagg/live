const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    method: ["POST", "GET"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected ${socket.id}`);
  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });
});

server.listen(5174, () => {
  console.log("Server is Running");
});

module.exports = server; // Export the server for Vercel
