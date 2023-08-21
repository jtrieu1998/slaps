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
// let gameStarted = false
let ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
let suits = ['s','c','d','h']
let hands
let middleDeck = []
let turn = 0
let slapable = false

const generateDeck = () => {
  let deck = []
  suits.forEach( (s) => {
    ranks.forEach( (r) => {
      let card = {rank: r, suit: s}
      card.rank = r
      card.suit = s
      deck.push(card)
    })
  })

  return deck
}

const shuffle = (deck) => {
  let card1, card2, temp

  for( let i = 0; i < 1000; i++){
    card1 = Math.floor((Math.random() * deck.length));
    card2 = Math.floor((Math.random() * deck.length));
    temp = deck[card1];

    deck[card1] = deck[card2]
    deck[card2] = temp
  }
  
  return deck
}

const dealCards = (numPlayers, deck) => {
  let hands = []

  for(let h = 0; h < numPlayers; h++){
    hands[h] = []
  }
  let h = 0
  for(let c = 0; c < deck.length-42; c++){
    if(h > numPlayers-1){
      h = 0
    }
    hands[h++].push(deck[c])
  }

  return hands
} 

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`)

  // Add new player to player array
  socket.on("add_player", () => {
    players.add(socket.id)
    console.log(players)
    socket.broadcast.emit("player_id", (players.size-1))
  })

  // Player closes tab
  // TODO: Decide what to do if player leaves mid game
  socket.on("disconnect", () => {
    players.delete(socket.id)
    console.log("Player removed: ", socket.id);
    console.log(players)

    // If all players disconnect reset game
    if(players.size == 0){
      middleDeck = []
      turn = 0
    }
  });

  // For testing, to delete
  socket.on("show_deck", () => {
    console.log(deck)
  })

  socket.on("start_game", () => {
    let numPlayers = players.size
    hands = dealCards(numPlayers, shuffle(generateDeck()))
    console.log(hands)
    socket.broadcast.emit("game_started", (numPlayers))
  })

  socket.on("play_card", (pid) => {
    console.log("Card was played")
    if(pid == turn){
      let cardPlayed = hands[pid].shift()
      socket.emit("card_played", (pid, cardPlayed))
      middleDeck.push(cardPlayed)
      console.log(middleDeck)
      turn++
      if(turn > players.size-1){
        turn = 0
      }
      // emit pid for card count feature later
      
    } else {
      // do nothing
    }
  })

  // TODO: socket.on slap
  //   input = slapability, timeToInput, pid
})

server.listen(3001, () => {
  console.log("SERVER RUNNING")
})

// socket.on("send_message", (data) => {
//   console.log(`Message came from: ${socket.id}`)
//   socket.broadcast.emit("receive_message", data)
  
// })