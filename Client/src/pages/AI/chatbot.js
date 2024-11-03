import React, { useState, useEffect, useRef } from "react";
import { Box, Button, TextField, Typography, Paper, Avatar } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";

// Custom vibrant theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50", // Green color theme for buttons and user messages
    },
    secondary: {
      main: "#81c784", // Lighter green for bot messages
    },
    error: {
      main: "#ff5722", // Add a bright orange for accents
    },
    warning: {
      main: "#ffeb3b", // Yellow for bright warning
    },
    info: {
      main: "#2196f3", // Blue for informational color
    },
  },
});

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [botTyping, setBotTyping] = useState(false); // Control typing animation
  const chatWindowRef = useRef(null); // Reference to the chat window for auto-scrolling

  // Function to scroll to the bottom when a new message is added
  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage = { sender: "user", text: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage(""); // Clear input field after sending message

    // Show typing indicator for bot
    setBotTyping(true);

    try {
      const response = await axios.post("http://localhost:5000/chat", { message: inputMessage });

      // Remove typing indicator and add bot message
      setBotTyping(false);
      const botMessage = { sender: "bot", text: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    scrollToBottom(); // Auto-scroll to bottom whenever messages are updated
  }, [messages]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundColor: "#fff3e0", // Light orange background
        }}
      >
        {/* Chat Display */}
        <Box
          ref={chatWindowRef}
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2,
            border: "2px solid #ffc107", // Bright yellow border for emphasis
            borderRadius: 3,
            backgroundColor: "#ffe0b2", // Light orange for the chat window
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                alignItems: "center", // Align icon and message
              }}
            >
              {/* Avatar/Icon */}
              {msg.sender === "bot" && (
                <Avatar sx={{ bgcolor: "secondary.main", mr: 1 }}>
                  <SmartToyIcon />
                </Avatar>
              )}

              {/* Message Box */}
              <Paper
                sx={{
                  p: 1.5,
                  backgroundColor: msg.sender === "user" ? "#4caf50" : "#81c784", // Green for user, lighter green for bot
                  color: msg.sender === "user" ? "white" : "black",
                  maxWidth: "60%",
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
              </Paper>

              {/* Avatar/Icon for user */}
              {msg.sender === "user" && (
                <Avatar sx={{ bgcolor: "primary.main", ml: 1 }}>
                  <PersonIcon />
                </Avatar>
              )}
            </Box>
          ))}

          {/* Show typing indicator */}
          {botTyping && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "secondary.main", mr: 1 }}>
                <SmartToyIcon />
              </Avatar>
              <Typography variant="body1">Typing...</Typography>
            </Box>
          )}
        </Box>

        {/* Input and Send Button at the bottom */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 1,
            borderTop: "2px solid #ff9800", // Orange border at the top of the input section
            backgroundColor: "#fff8e1", // Matching background for input section
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && inputMessage.trim()) handleSendMessage();
            }}
            sx={{
              backgroundColor: "#ffffff", // White background for the text field
              borderRadius: 1,
              input: { color: "black" }, // Black text in the input field
            }}
          />
          {inputMessage.trim() && (
            <Button variant="contained" color="primary" onClick={handleSendMessage}>
              Send
            </Button>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Chatbot;
