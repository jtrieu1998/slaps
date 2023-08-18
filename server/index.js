const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { disconnect } = require("process");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET","POST"],
  },
});

// Game logic starts here
let players = new Set()
let gameStarted = false

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`)

  // Add new player to player array
  socket.on("add_player", () => {
    players.add(socket.id)
    console.log(players)
  })

  // Player closes tab
  // TODO: Decide what to do if player leaves mid game
  socket.on("disconnect", () => {
    players.delete(socket.id)
    console.log("Player removed: ", socket.id);
    console.log(players)
  });
})

server.listen(3001, () => {
  console.log("SERVER RUNNING")
})

// socket.on("send_message", (data) => {
//   console.log(`Message came from: ${socket.id}`)
//   socket.broadcast.emit("receive_message", data)
  
// })