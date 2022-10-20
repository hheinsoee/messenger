import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';



import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
// import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Input, InputBase } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const socket = io("wss://live.heinsoe.com");

function Msgr(prams) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messageData, setMessageData] = useState([]);
  const [sending, setSending] = useState(false);

  const [typing, setTyping] = useState('');

  const divRef = useRef(null);
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
      divRef.current.scrollIntoView({ behavior: 'smooth' });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
    };
  }, []);

  const sendMessage = (event) => {
    setSending(true);
    var data = { "name": prams.name, "message": typing }
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
    <div className='messenger'>
      <div className='messageHistory'>
        <div>{!isConnected && "offline"}</div>
        <List>
          {messageData.map((m, i) =>
            <ListItem key={i} style={{ alignItems: 'flex-start' }}>
              <ListItemAvatar>
                <Avatar alt="Profile Picture">{m.name}</Avatar>
              </ListItemAvatar>
              <ListItemText className="messageItems" style={{ padding: "0.3rem 1rem", backgroundColor: 'rgba(112,112,112,0.1)' }}>
                <small>{m.name}</small>
                <div>{m.message}</div>
              </ListItemText>
            </ListItem>
          )}
        </List>
      </div>
      {sending && <div>sending...</div>}
      <div ref={divRef} style={{padding:'var(--msgBox-height)'}}/>
      <Paper elevation={3} square className='messageBox' component={'form'} onSubmit={sendMessage}>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          inputProps={{ 'aria-label': 'enter message' }}
          placeholder="enter message" value={typing} onChange={handleChange}
        />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <SendIcon />
        </IconButton>
      </Paper>
    </div>
  );
}

export default Msgr;