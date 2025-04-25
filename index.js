const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let players = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  if (players.length < 2) {
    const symbol = players.length === 0 ? "X" : "O";
    players.push({ id: socket.id, symbol });
    socket.emit("assignSymbol", symbol);
  }

  socket.on("events", (data) => {
    socket.broadcast.emit("events", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    players = players.filter((p) => p.id !== socket.id);
  });
});

app.use(express.static("public")); // Your HTML file should be inside a "public" folder

server.listen(3000, () => console.log("Server running on http://localhost:3000"));
