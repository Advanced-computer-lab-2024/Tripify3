import React, { useState } from "react";
import signupImage from "../assets/signup/CarouselLogin1.png";
import { TextField, Button, Checkbox, FormControlLabel, Grid, Box, Typography, Link, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { signup } from "../services/Signup.js"; // Import the signup service

const nationalities = [
  "United States",
  "Canada",
  "Egypt",
  "United Kingdom",
  "Germany",
  "France",
  "India",
  "China",
  "Brazil",
  "Japan",
  "Australia",
  "Mexico",
  // Add more nationalities as needed
];

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    birthDate: "",
    nationality: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, username, birthDate, nationality, phoneNumber, email, password } = formData;

    const signupData = {
      name: `${firstName} ${lastName}`,
      email,
      dateOfBirth: birthDate, // Ensure this is formatted as "YYYY-MM-DD"
      phoneNumber,
      username,
      occupation: "Student", // You can adjust this based on your needs
      nationality,
      password,
      type: "tourist",
    };

    try {
      const response = await signup(signupData);
      console.log("Signup successful:", response);
      // Handle success (e.g., redirect or show a success message)
    } catch (error) {
      console.error("Signup failed:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <Box p={4} maxWidth={1200} mx="auto">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Hello! Sign up to get started.
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="First Name" name="firstName" fullWidth margin="normal" value={formData.firstName} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Last Name" name="lastName" fullWidth margin="normal" value={formData.lastName} onChange={handleInputChange} />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Birthdate" name="birthDate" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={formData.birthDate} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Nationality</InputLabel>
                  <Select name="nationality" value={formData.nationality} onChange={handleInputChange}>
                    {nationalities.map((nation) => (
                      <MenuItem key={nation} value={nation}>
                        {nation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField label="Username" name="username" fullWidth margin="normal" value={formData.username} onChange={handleInputChange} />
            <TextField label="Email" name="email" fullWidth margin="normal" value={formData.email} onChange={handleInputChange} />
            <TextField label="Phone Number" name="phoneNumber" fullWidth margin="normal" value={formData.phoneNumber} onChange={handleInputChange} placeholder="+44" />
            <TextField label="Password" name="password" type="password" fullWidth margin="normal" value={formData.password} onChange={handleInputChange} />
            <TextField label="Confirm Password" name="confirmPassword" type="password" fullWidth margin="normal" value={formData.confirmPassword} onChange={handleInputChange} />
            <FormControlLabel control={<Checkbox name="acceptTerms" checked={formData.acceptTerms} onChange={handleInputChange} />} label="I agree to the terms and conditions" />
            <Button type="submit" variant="contained" fullWidth color="primary">
              Next
            </Button>
            <Box mt={2}>
              <Typography variant="body2">
                Already have an account?{" "}
                <Link href="/login" color="primary">
                  Log in
                </Link>
              </Typography>
            </Box>
          </form>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundImage: `url(${signupImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%",
              borderRadius: "8px",
            }}
          ></Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignupPage;
