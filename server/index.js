const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Configure CORS to allow only specific origins
app.use(
  cors({
    origin: "https://live-three-psi.vercel.app", // frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "https://live-three-psi.vercel.app", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// In-memory storage for message history (for production, use a database)
const messageHistory = [];

// Handle incoming socket connections
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Send the message history to the newly connected user
  // socket.emit("load_history", messageHistory);

  // Handle receiving and broadcasting messages
  socket.on("send_message", (data) => {
    // Add the new message to the history
    messageHistory.push(data);

    // Broadcast the message to all connected clients
    io.emit("receive_message", data); // Emit to all, including the sender
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = process.env.PORT || 5174;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server; // Export server, useful for testing or integration
