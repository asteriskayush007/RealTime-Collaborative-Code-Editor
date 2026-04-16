const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (repoId) => {
    socket.join(repoId);

    if (!rooms[repoId]) {
      rooms[repoId] = {
        "main.js": 'console.log("hello")',
      };
    }

    socket.emit("load-code", rooms[repoId]);
  });

  socket.on("code-change", ({ repoId, files }) => {
    rooms[repoId] = files;

    socket.to(repoId).emit("code-update", files);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5001, () => {
  console.log("Server running on 5001");
});