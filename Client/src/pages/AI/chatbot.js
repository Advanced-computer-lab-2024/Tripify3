import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = { sender: 'user', text: inputMessage };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post('http://localhost:5000/chat', { message: inputMessage });
      console.log(response);
      
      const botMessage = { sender: 'bot', text: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setInputMessage(''); // Clear input field after sending message
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', p: 2 }}>
      {/* Chat Display */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 2,
          border: '1px solid lightgray',
          borderRadius: 2,
          mb: 2,
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <Paper
              sx={{
                p: 1.5,
                backgroundColor: msg.sender === 'user' ? 'primary.main' : 'grey.300',
                color: msg.sender === 'user' ? 'white' : 'black',
                maxWidth: '60%',
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Input and Send Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && inputMessage.trim()) handleSendMessage();
          }}
        />
        {inputMessage.trim() && (
          <Button variant="contained" color="primary" onClick={handleSendMessage}>
            Send
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Chatbot;
