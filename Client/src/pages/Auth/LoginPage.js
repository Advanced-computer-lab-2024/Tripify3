import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography, Alert, IconButton, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import backgroundImage from "../../assets/signup/CarouselLogin1.png"; // Import your image

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/access/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setErrorMessage("Invalid username or password.");
        return;
      }

      alert("Login successful!");
      navigate("/"); // Redirect to home page or dashboard
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred while logging in.");
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "80%",
          height: "80vh",
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
          textAlign: "center",
          position: "relative",
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            top: "20px",
            left: "20px",
            color: "#00695C",
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: "500px" }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "black" }}>
              Login
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ marginBottom: "30px" }}>
              Please enter your username and password to log in.
            </Typography>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} margin="normal" required />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "orange" }} // Set icon color to orange
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                }}
              />

              {/* Forgot Password link under the password field */}
              <Box sx={{ textAlign: "right", mt: 1 }}>
                <Link href="/username-input" underline="none" sx={{ color: "#00695C", fontSize: "14px" }}>
                  Forgot Password?
                </Link>
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                sx={{ marginTop: "20px", backgroundColor: "#00695C" }} // Set button color
              >
                Login
              </Button>

              <Typography variant="body2" sx={{ marginTop: "20px", color: "gray", textAlign: "center" }}>
                Don't have an account?{" "}
                <Link href="/signup" underline="none" sx={{ color: "#00695C" }}>
                  Sign up
                </Link>
              </Typography>
            </form>
          </Box>
        </Box>

        <Box
          sx={{
            width: "50%",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "20px",
          }}
        />
      </Box>
    </Container>
  );
};

export default Login;
