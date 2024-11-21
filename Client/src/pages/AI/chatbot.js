import React, { useState, useEffect, useRef } from "react";
import { Box, Button, TextField, Typography, Paper, Avatar } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { getUser } from "../../utils/authUtils";


// Custom professional theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#003366", // Muted blue for buttons and user messages
    },
    secondary: {
      main: "#e9ecef", // Light gray for bot messages, soft on the eyes
    },
    background: {
      default: "#f5f5f5", // Very light gray background for a clean look
    },
    text: {
      primary: "#343a40", // Dark gray for main text, readable and professional
      secondary: "#6c757d", // Lighter gray for secondary text
    },
  },
});

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const chatWindowRef = useRef(null);
  const user = getUser();
  const initialMessageSent = useRef(false); // Flag to track initial message


  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage = { sender: "user", text: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    scrollToBottom();

    setBotTyping(true);

    try {
      const response = await axios.post("http://localhost:5000/chat", { message: inputMessage, user_info: user });
      console.log(user);
      
      setBotTyping(false);
      const botMessage = { sender: "bot", text: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendInitialMessage = async () => {
    if (initialMessageSent.current) return; // Prevent duplicate calls
    initialMessageSent.current = true;

    setBotTyping(true);

    try {
      const response = await axios.post("http://localhost:5000/chat", { message: "", user_info: user });
      setBotTyping(false);
      const botMessage = { sender: "bot", text: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
      scrollToBottom();
    } catch (error) {
      console.error("Error sending initial message:", error);
      setBotTyping(false);
    }
  };

  useEffect(() => {
    sendInitialMessage();
  }, []); // Runs only once when the component mounts


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh - 100px",
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* Title */}
        <Box
          sx={{
            py: 2,
            px: 3,
            backgroundColor: theme.palette.primary.main,
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Chat with Touri
          </Typography>
        </Box>

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
            maxHeight: "calc(100vh - 300px)",// Only set the height when messages are present
            border: "1px solid #ced4da",
            borderRadius: 3,
            backgroundColor: "#f1f3f5",
            marginBottom: "20px", // Additional space above the input field
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                alignItems: "center",
              }}
            >
              {msg.sender === "bot" && (
                <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}>
                  <SmartToyIcon />
                </Avatar>
              )}
              <Paper
                sx={{
                  p: 1.5,
                  backgroundColor: msg.sender === "user" ? "#003366" : "#e9ecef",
                  color: msg.sender === "user" ? "white" : "black",
                  maxWidth: "60%",
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
              </Paper>
              {msg.sender === "user" && (
                <Avatar sx={{ bgcolor: "primary.main", ml: 1 }}>
                  <PersonIcon />
                </Avatar>
              )}
            </Box>
          ))}

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
            borderTop: "1px solid #ced4da",
            backgroundColor: theme.palette.background.default,
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
              backgroundColor: "#ffffff",
              borderRadius: 1,
              input: { color: "black" },
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
