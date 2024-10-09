import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupImage from "../../assets/signup/CarouselLogin1.png";
import { TextField, Button, Checkbox, FormControlLabel, Grid, Box, Typography, Link, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { signup } from "../../services/Signup.js"; // Import the signup service

const userTypes = ["Tourist", "Tour Guide", "Seller", "Advertiser"];
const nationalities = [
  "USA",
  "Canada",
  "UK",
  "Germany",
  "France",
  "Australia",
  "Egypt",
  "Italy",
  "Spain",
  "Brazil",
  "Argentina",
  "Mexico",
  "India",
  "China",
  "Japan",
  "South Korea",
  "Russia",
  "South Africa",
  "Nigeria",
  "Kenya",
  "Turkey",
  "Saudi Arabia",
  "United Arab Emirates",
  "Sweden",
  "Norway",
  "Finland",
  "Denmark",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Austria",
  "Greece",
  "Portugal",
  "Czech Republic",
  "Ireland",
  "Iceland",
  "Palestine",
  "Chile",
  "Colombia",
  "Peru",
  "Panama",
  "Costa Rica",
  "Cuba",
  "Honduras",
  "El Salvador",
  "Paraguay",
  // Add more nationalities as needed
];

const SignupPage = () => {
  const [formData, setFormData] = useState({
    type: "",
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    nationality: "",
    birthDate: "",
    occupation: "",
    yearsOfExperience: "", // New field for Tour Guide
    previousWork: "", // New field for Tour Guide
    acceptTerms: false,
    companyName: "", // New field for Advertiser
    websiteLink: "", // New field for Advertiser
    hotline: "", // New field for Advertiser
    description: "",
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({}); // State for error messages

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateAge = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, name, email, password, phoneNumber, nationality, birthDate, occupation, yearsOfExperience, previousWork, type, companyName, websiteLink, hotline, description } = formData;

    const newErrors = {};
    if (!username) newErrors.username = "Username is required";
    if (["Tourist", "Tour Guide", "Seller"].includes(type) && !name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Email is not valid";
    if (!password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";

    // Validate fields based on user type
    if (type === "Tourist") {
      if (!phoneNumber) newErrors.phoneNumber = "Mobile Number is required";
      if (!nationality) newErrors.nationality = "Nationality is required";
      if (!birthDate) newErrors.birthDate = "Date of Birth is required";
      else {
        const age = validateAge(birthDate);
        if (age < 18 || age > 100) {
          newErrors.birthDate = "You must be between 18 and 100 years old";
        }
      }
      if (!occupation) newErrors.occupation = "Occupation is required";
    }

    if (type === "Tour Guide") {
      if (!phoneNumber) newErrors.phoneNumber = "Mobile Number is required";
      if (!yearsOfExperience) newErrors.yearsOfExperience = "Years of experience is required";
      if (!previousWork) newErrors.previousWork = "Previous work experience is required";
    }

    if (type === "Seller") {
      if (!description) newErrors.phoneNumber = "Description is required";
    }

    if (type === "Advertiser") {
      if (!companyName) newErrors.companyName = "Company Name is required";
      if (!websiteLink) newErrors.websiteLink = "Website Link is required";
      if (!hotline) newErrors.hotline = "Hotline is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Exit if there are errors
    }

    // Ensure birthDate is formatted as "YYYY-MM-DD"
    const formattedBirthDate = birthDate ? new Date(birthDate).toISOString().split("T")[0] : null;

    // Construct request data based on user type
    let signupData = {
      username,
      email,
      password,
      type,
    };

    // Include name only for Tourist, Tour Guide, or Seller
    if (["Tourist", "Tour Guide", "Seller"].includes(type)) {
      signupData = {
        ...signupData,
        name,
      };
    }

    // If the user is a Tourist, include additional fields
    if (type === "Tourist") {
      signupData = {
        ...signupData,
        phoneNumber,
        occupation,
        nationality,
        birthDate: formattedBirthDate, // Add formatted birthDate
      };
    }

    // If the user is a Tour Guide, include additional fields
    if (type === "Tour Guide") {
      signupData = {
        ...signupData,
        phoneNumber,
        yearsOfExperience,
        previousWork,
      };
    }

    if (type === "Seller") {
      signupData = {
        ...signupData,
        description,
      };
    }
    // If the user is an Advertiser, include additional fields
    if (type === "Advertiser") {
      signupData = {
        ...signupData,
        companyName,
        websiteLink,
        hotline,
      };
    }

    try {
      const response = await signup(signupData);
      console.log("Signup successful:", response);
      // If successful, navigate to the login page

      navigate("/login");
    } catch (error) {
      if (error.response.status === 400) {
        const errorMessage = error.response.data.message;
        console.log(errorMessage);

        // Set errors based on the error message
        if (errorMessage.includes("Username and Email")) {
          newErrors.username = "Username already exists.";
          newErrors.email = "Email already exists.";
        } else if (errorMessage.includes("Username")) {
          newErrors.username = "Username already exists.";
        } else if (errorMessage.includes("Email")) {
          newErrors.email = "Email already exists.";
        }
        // Update the errors state so that the errors appear above the fields
        setErrors(newErrors);
      }
      console.error("Signup failed:", error);
      // Handle error (e.g., show an error message)
    }
  };

  // Conditionally render the name field for specific user types
  const renderNameField = () => {
    if (["Tourist", "Tour Guide", "Seller"].includes(formData.type)) {
      return <TextField label="Name" name="name" fullWidth margin="normal" value={formData.name} onChange={handleInputChange} error={!!errors.name} helperText={errors.name} />;
    }
    return null;
  };

  const renderConditionalFields = () => {
    if (formData.type === "Tourist") {
      return (
        <>
          <TextField
            label="Mobile Number"
            name="phoneNumber"
            fullWidth
            margin="normal"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="+20"
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
          />
          <FormControl fullWidth margin="normal" error={!!errors.nationality}>
            <InputLabel>Nationality</InputLabel>
            <Select name="nationality" value={formData.nationality} onChange={handleInputChange}>
              {nationalities.map((nation) => (
                <MenuItem key={nation} value={nation}>
                  {nation}
                </MenuItem>
              ))}
            </Select>
            {errors.nationality && <Typography color="error">{errors.nationality}</Typography>}
          </FormControl>
          <TextField
            label="Date of Birth"
            name="birthDate"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.birthDate}
            onChange={handleInputChange}
            error={!!errors.birthDate}
            helperText={errors.birthDate}
          />
          <TextField
            label="Occupation"
            name="occupation"
            fullWidth
            margin="normal"
            value={formData.occupation}
            onChange={handleInputChange}
            error={!!errors.occupation}
            helperText={errors.occupation}
          />
        </>
      );
    }

    if (formData.type === "Seller") {
      return (
        <>
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            value={formData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
          />
        </>
      );
    }

    if (formData.type === "Tour Guide") {
      return (
        <>
          <TextField
            label="Mobile Number"
            name="phoneNumber"
            fullWidth
            margin="normal"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="+44"
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
          />
          <TextField
            label="Years of Experience"
            name="yearsOfExperience"
            type="number"
            fullWidth
            margin="normal"
            value={formData.yearsOfExperience}
            onChange={handleInputChange}
            error={!!errors.yearsOfExperience}
            helperText={errors.yearsOfExperience}
          />
          <TextField
            label="Previous Work Experience"
            name="previousWork"
            fullWidth
            margin="normal"
            value={formData.previousWork}
            onChange={handleInputChange}
            error={!!errors.previousWork}
            helperText={errors.previousWork}
          />
        </>
      );
    }

    if (formData.type === "Advertiser") {
      return (
        <>
          <TextField
            label="Company Name"
            name="companyName"
            fullWidth
            margin="normal"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Company Name"
            error={!!errors.companyName}
            helperText={errors.companyName}
          />
          <TextField
            label="Website Link"
            name="websiteLink"
            fullWidth
            margin="normal"
            value={formData.websiteLink}
            onChange={handleInputChange}
            error={!!errors.websiteLink}
            helperText={errors.websiteLink}
          />
          <TextField
            label="Hotline"
            name="hotline"
            type="number"
            fullWidth
            margin="normal"
            value={formData.hotline}
            onChange={handleInputChange}
            error={!!errors.hotline}
            helperText={errors.hotline}
          />
        </>
      );
    }

    return null; // No additional fields for other types
  };

  return (
    <Box p={4} maxWidth={1200} mx="auto">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Hello! Sign up to get started
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField label="Username" name="username" fullWidth margin="normal" value={formData.username} onChange={handleInputChange} error={!!errors.username} helperText={errors.username} />
            {renderNameField()}
            <FormControl fullWidth margin="normal">
              <InputLabel>User Type</InputLabel>
              <Select name="type" value={formData.type} onChange={handleInputChange}>
                {userTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {renderConditionalFields()}
            <TextField label="Email" name="email" fullWidth margin="normal" value={formData.email} onChange={handleInputChange} error={!!errors.email} helperText={errors.email} />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              margin="normal"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <FormControlLabel control={<Checkbox name="acceptTerms" checked={formData.acceptTerms} onChange={handleInputChange} />} label="I accept the terms and conditions" />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Sign Up
            </Button>
            <Typography mt={2}>
              Already have an account?{" "}
              <Link href="/login" variant="body2">
                Login
              </Link>
            </Typography>
          </form>
        </Grid>
        <Grid item xs={12} md={6}>
          <img src={signupImage} alt="Signup" width="100%" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignupPage;
