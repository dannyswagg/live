const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Configure CORS to allow only specific origins
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST"],
  })
);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allowing frontend only from this origin
    methods: ["GET", "POST"],
  },
});

// Handle incoming socket connections
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Handle receiving and broadcasting messages
  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(5174, () => {
  console.log("Server is running on port 5174");
});

module.exports = server; // Export server, useful for testing or integration
