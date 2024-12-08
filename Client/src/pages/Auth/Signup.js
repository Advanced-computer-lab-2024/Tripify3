import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupImage from "../../assets/logo.jpeg";
import { TextField, Button, IconButton, Checkbox, FormControlLabel, Grid, Box, Typography, Link, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { signup, uploadFiles } from "../../services/Signup.js"; // Import the signup service
import DeleteIcon from "@mui/icons-material/Delete";

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
  "Saudi Arabia",
  "United Arab Emirates",
 
  // Add more nationalities as needed
];

const currencies = [
  { name: "US Dollar", symbol: "USD" },
  { name: "Canadian Dollar", symbol: "CAD" },
  { name: "British Pound", symbol: "GBP" },
  { name: "Euro", symbol: "EUR" },
  { name: "Australian Dollar", symbol: "AUD" },
  { name: "Egyptian Pound", symbol: "EGP" },
];



const Signup = () => {
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
    currency:"",
    occupation: "",
    yearsOfExperience: "", // New field for Tour Guide
    previousWork: "", // New field for Tour Guide
    acceptTerms: false,
    companyName: "", // New field for Advertiser
    websiteLink: "", // New field for Advertiser
    hotline: "", // New field for Advertiser
    description: "",
    files: [],
  });
  const navigate = useNavigate();

  const [selectedFiles, setSelectedFiles] = useState([]); // State to store uploaded files
  const [errors, setErrors] = useState({}); // State for error messages

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files); // Convert FileList to Array
    const allFiles = [...selectedFiles, ...newFiles]; // Combine new files with already selected files

    // Check if there are any duplicate file names
    const fileNames = allFiles.map((file) => file.name);
    const hasDuplicates = fileNames.some((name, index) => fileNames.indexOf(name) !== index);

    if (hasDuplicates) {
      setErrors({ files: "Duplicate file names are not allowed." });
    } else {
      setSelectedFiles(allFiles); // Add new files to the selectedFiles state
      setFormData({
        ...formData,
        files: allFiles, // Update the formData with selected files
      });
      setErrors({ files: "" });
    }
  };

  // Handle file removal
  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
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
    const { username, name, email, password, phoneNumber, nationality, birthDate,currency, occupation, yearsOfExperience, previousWork, type, companyName, websiteLink, hotline, description, files } = formData;

    const newErrors = {};
    if (!username) newErrors.username = "Username is required";
    if (["Tourist", "Tour Guide", "Seller"].includes(type) && !name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Email is not valid";
    if (!password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";

    console.log(files);







    // Validate file uploads for Advertiser, Seller, or Tour Guide
    if (["Tour Guide", "Seller", "Advertiser"].includes(type) && (!files || files.length < 2)) {
      newErrors.files = "Please upload at least 2 files";
    }








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
        currency,
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
      const userId = response.user._id; // Extract user ID from response
      const userType = response.user.type; // Extract user ID from response
      console.log("Signup successful:", response);

      // Step 2: After signup, call the file upload API if user is 'Tour Guide', 'Seller', or 'Advertiser'
      if (userType === "Tour Guide" || userType === "Seller" || userType === "Advertiser") {

        const formData = new FormData();
        formData.append("userId", userId); // Use the userId from the signup response
        selectedFiles.forEach((file) => formData.append("files", file)); // Append each selected file

        await uploadFiles(formData);

        navigate("/login");
      } else {
        // If user didn't upload files or isn't required to, navigate to login
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
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

  // Render selected files with remove button
  const renderSelectedFiles = () => (
    <div>
      {selectedFiles.map((file, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", margin: "5px 0" }}>
          <Typography variant="body2" style={{ marginRight: "10px" }}>
            {file.name}
          </Typography>
          <IconButton size="small" onClick={() => handleRemoveFile(index)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ))}
    </div>
  );

  const renderFileUploadSection = () => {
    let uploadLabel = "";
    
    // Determine the upload label based on formData.type
    if (formData.type === "Tour Guide") {
      uploadLabel = "Upload ID and Certificates";
    }  if (formData.type === "Advertiser") {
      uploadLabel = "Upload Taxation Registry Card";
    } else if (formData.type === "Seller") {
      uploadLabel = "Upload ID and Taxation Registry Card";
    }
  
    if (uploadLabel) {
      return (
        <>
          <Button variant="outlined" component="label" fullWidth margin="normal">
            {uploadLabel}
            <input type="file" multiple hidden onChange={handleFileChange} />
          </Button>
          {errors.files && <Typography color="error">{errors.files}</Typography>}
          {renderSelectedFiles()} {/* Show selected files under the button */}
        </>
      );
    }
    
    return null;
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
        
        {/* Currency Dropdown */}
        <FormControl fullWidth margin="normal" error={!!errors.currency}>
          <InputLabel>Currency</InputLabel>
          <Select name="currency" value={formData.currency} onChange={handleInputChange}>
            {currencies.map((currency) => (
              <MenuItem key={currency.name} value={currency.symbol}>
                {currency.name} ({currency.symbol})
              </MenuItem>
            ))}
          </Select>
          {errors.currency && <Typography color="error">{errors.currency}</Typography>}
        </FormControl>
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
            {renderFileUploadSection()}

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

export default Signup;
