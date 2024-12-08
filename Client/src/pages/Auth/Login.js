import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography, Alert, IconButton, Link, InputAdornment } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import backgroundImage from "../../assets/logo.jpeg";
import { setUser,setUserType } from "../../utils/authUtils.js";


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

      const data = await response.json();
      setUser(data.user); // Store user info in the utility file

      // Check if the user needs to accept terms
      if ((data.user.type === "Seller" || data.user.type === "Tour Guide" || data.user.type === "Advertiser") && !data.user.hasAcceptedTerms) {
        navigate("/TermsAndAgreements");
        return; // Ensure that we exit the function after navigating
      }

      switch (data.user.type) {
        case "Tourism Governor":
          navigate("/tourism-governor/profile");
          break;
        case "Tourist":
          navigate("/tourist/homepage");
          break;
        case "Seller":
          navigate("/seller/my-products");
          break;
        case "Admin":
          navigate("/admin/profile");
          break;
        case "Tour Guide":
          navigate("/tour-guide/profile");
          break;
        case "Advertiser":
          navigate("/advertiser/my-activities");
          break;
        default:
          console.error("Unknown user type:", data.user.type);
      }
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
          position: "relative", // Ensure the parent box is relatively positioned for arrow placement
        }}
      >
        {/* Back Arrow */}
        <IconButton
          onClick={() => navigate(-1)} // Navigate to previous page
          sx={{
            position: "absolute",
            top: "10px",
            left: "10px",
            padding: 0, // Remove padding so the icon doesn't take up extra space
            color: "#00695C",
            zIndex: 1, // Ensure the arrow stays on top
          }}
        >
          <ArrowBackIcon sx={{ fontSize: "30px" }} />
        </IconButton>

        {/* Left Box - Form */}
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
{/* 
<img
    src={require("../../assets/logo.jpeg")}
    alt="App Logo"
    style={{ width: "100px", marginBottom: "20px" }} // Adjust size and spacing
  /> */}
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
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: "orange" }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Forgot Password link under the password field */}
              <Box sx={{ textAlign: "right", mt: 1 }}>
                <Link href="/email-input" underline="none" sx={{ color: "#00695C", fontSize: "14px" }}>
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
              <Typography variant="body2" sx={{ marginTop: "5px", color: "gray", textAlign: "center" }}>
                continue as{" "}
                <Link
                  href="/guest/activities"
                  underline="none"
                  sx={{ color: "#00695C" }}
                  onClick={() => {
                    setUserType("Guest"); // Set the user type to Guest
                  }}
                >
                  Guest
                </Link>
              </Typography>
            </form>
          </Box>
        </Box>

        {/* Right Box - Background Image */}
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
