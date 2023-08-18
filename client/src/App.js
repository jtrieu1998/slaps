import './App.css';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

const socket = io.connect("http://localhost:3001", {
  'sync disconnect on unload': true
})

function App() {
  const [inGame, setInGame] = useState(false)

  const addPlayer = () => {
    
    socket.emit("add_player")
    console.log("Adding player")
    setInGame(true)
  }

  const addSpectator = () => {
    socket.emit("add_spectator")
    setInGame(true)
  }

  if(!inGame){
    return ( 
      <div className="App">
        <button onClick={addPlayer}>Connect to play</button>
        <button onClick={addSpectator}>Connect to spectate</button>
      </div>
    );
  } else {
    return ( 
      <div className="App">
        <h1>Welcome to the game!</h1>
      </div>
    );
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