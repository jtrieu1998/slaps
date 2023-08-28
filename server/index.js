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
let delay = 0
let royalLoop = false
let slappable = false

const resetGlobals = (turn_ = 0) => {
  middleDeck = []
  turn = turn_
  delay = 0
  royalLoop = false
}

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
  for(let c = 0; c < deck.length; c++){
    if(h > numPlayers-1){
      h = 0
    }
    hands[h++].push(deck[c])
  }

  return hands
} 

const incTurn = () => {
  turn++
  if(turn > players.size-1){
    turn = 0
  } 
}

const turnDelay = (cardPlayed) => {
  let card = cardPlayed.rank
  let delay = 0
  switch(card){
    case 'A':
      delay = 4
      break
    case 'K':
      delay = 3
      break
    case 'Q':
      delay = 2
      break
    case 'J':
      delay = 1
      break
    default:
      break
  }
  return delay
}

const newRoyalCard = (cardPlayed) => {
  delay = turnDelay(cardPlayed)
  incTurn()
}

// Checks if the top cards are a legal slap
const isSlappable = () => {
  if(middleDeck.length < 2){
    slappable = false
  }
  if(middleDeck.length === 2){
    if(middleDeck[0].rank === middleDeck[1].rank){
      slappable = true
    }
  }
  if(middleDeck.length > 2){
    let top3 = middleDeck.slice(middleDeck.length - 3)
    if(
      top3[0].rank === top3[1].rank ||
      top3[0].rank === top3[2].rank ||
      top3[1].rank === top3[2].rank 
    ){
      slappable = true
    }
  }
  return slappable
}

// Call when someone wins the middle deck
// Give middle deck and reset delay and royalLoop
const givePlayerMiddleDeck = () => {
  let winningPlayer
  if(turn == 0){
    winningPlayer = players.size-1
  } else {
    winningPlayer = turn-1
  }

  hands[winningPlayer] = hands[winningPlayer].concat(middleDeck)
  console.log(`Player ${winningPlayer} Wins the Pile!`)
  resetGlobals(winningPlayer)
}


io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`)

  // Add new player to player array
  socket.on("add_player", () => {
    players.add(socket.id)
    console.log(players)
    console.log(players.size-1)
    io.to(socket.id).emit("player_id", (players.size-1))  // io.to(socket.id) emits back to sender
  })

  // Player closes tab
  // TODO: Decide what to do if player leaves mid game
  socket.on("disconnect", () => {
    players.delete(socket.id)
    console.log("Player removed: ", socket.id);
    console.log(players)

    // If all players disconnect reset game
    if(players.size == 0){
      resetGlobals()
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
      io.emit("card_played", pid, cardPlayed) // emit pid for card count feature later
      middleDeck.push(cardPlayed)

      if(delay > 0){  // If a royal is played
        royalLoop = true
      }
      if(royalLoop === false){  // Increment the turn when in normal state
        newRoyalCard(cardPlayed)
      } else {  // Have same player add cards til either a royal or finished
        delay -= 1
        if(turnDelay(cardPlayed) > 0){
          newRoyalCard(cardPlayed)
        }
        console.log("DELAY: ",delay)
      }
      // give middle pile out to turn-1 or pid.length-1 if turn == 0
      if(delay == 0 && royalLoop){
        givePlayerMiddleDeck()
        io.emit("clear_middle")
      }
    } else {
      // do nothing
    }
  })

  // TODO: socket.on slap
  //   input = slapability, timeToInput, pid
  socket.on("play_slap", (pid) => {

  })
})

server.listen(3001, () => {
  console.log("SERVER RUNNING")
})
