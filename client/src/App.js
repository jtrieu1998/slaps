import './App.css';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

const socket = io.connect("http://localhost:3001", {
  'sync disconnect on unload': true
})

function App() {
  const [inLobby, setInLobby] = useState(false)
  const [inGame, setInGame] = useState(false)
  const [middleDeck, setMiddleDeck] = useState([])
  const [pid, setPid] = useState(0)

  // TODO: function to check slapability

  const addPlayer = () => {
    socket.emit("add_player")
    console.log("Adding player")
    setInLobby(true)
  }

  const addSpectator = () => {
    socket.emit("add_spectator")
    setInLobby(true)
  }

  // For testing, to delete
  const showDeck = () => {
    socket.emit("show_deck")
  }

  const startGame = () => {
    socket.emit("start_game")
    setInGame(true)
  }

  const playCard = (pid_) => {
    socket.emit("play_card", (pid_))
  }

  useEffect(() => {
    socket.on("player_id", (pid_) => {
      setPid(pid_)
    })

    socket.on("game_started", (numPlayers) => {
      setInGame(true)
    })

    // TODO: use pid for card count
    socket.on("card_played", (pid, cardPlayed) => {
      setMiddleDeck([
        ...middleDeck,
        cardPlayed
      ])
      console.log(middleDeck, cardPlayed)
      // TODO: add function to check slapability
    })

  }, [socket])

  if(!inLobby){
    return ( 
      <div className="App">
        <button onClick={addPlayer}>Connect to play</button>
        <button onClick={addSpectator}>Connect to spectate</button>
        <button onClick={showDeck}>SHOW DECK</button>
      </div>
    );
  } else if(!inGame) {
    return ( 
      <div className="App">
        <h1>Welcome to the lobby!</h1>
        <button onClick={startGame}>Start Game</button>
      </div>
    );
  } else {
    return (
      <div className="App">
        <h1>Welcome to the game!</h1>
        <button onClick={() => playCard(pid)}>Play Card</button>
        {/* <button onClick={player_slap}>Slap</button> */}
        <div>HERE IS THE MIDDLE DECK: {middleDeck[0]}</div>
      </div>
    )
  }
  
}

export default App;


// const [message,setMessage] = useState("")
// const [messageReceived, setMessageReceived] = useState("")

  // const sendMessage = () => {
//   socket.emit("send_message", {message})
// }

// useEffect(() => {
//   socket.on("receive_message", (data) => {
//     setMessageReceived(data.message)
//   })
// }, [socket])

//   <input 
//   placeholder="Message" 
//   onChange={(event) => {
//     setMessage(event.target.value)
//   }}
// />
// <button onClick={sendMessage}> Send Message</button>
// <h1>Message: </h1>
// {messageReceived}