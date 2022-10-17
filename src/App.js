import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io("wss://live.heinsoe.com");

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messageData, setMessageData] = useState([]);
  const [sending, setSending] = useState(false);

  const [typing, setTyping] = useState('');


  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('conect')
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('message', (msg) => {
      setMessageData(messageData => [...messageData, msg]);
      console.log(msg)
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
    };
  }, []);

  const sendMessage = (event) => {
    setSending(true);
    var data = { "id": "9", "name": "Hein Soe", "message": typing }
    setTyping('')
    socket.emit('message', data, (response) => {
      response.status == 'ok' && setSending(false)
    });
    event.preventDefault();
  }
  const handleChange = (event) => {
    setTyping(event.target.value)
  }
  return (
    <div>
      <p>Connected: {'' + isConnected}</p>
      {messageData
        ? messageData.map((m, i) =>
          <div key={i}>
            {`${m.name} : ${m.message}`}
          </div>
        )
        : '-'}
      {sending && <div>sending...</div>}
      <form onSubmit={sendMessage}>
        <input type="text" value={typing} onChange={handleChange} />
        <button>Send Message</button>
      </form>
    </div>
  );
}

export default App;