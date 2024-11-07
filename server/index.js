const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "*",
    methods: ["GET"],
    credentials: true,
  })
);

app.get("/", (_, res) => {
  res.send("hello world");
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

module.exports = server;
