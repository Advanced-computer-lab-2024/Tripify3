import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserId } from '../../utils/authUtils';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
} from '@mui/material';

const TermsAndAgreements = () => {
  const navigate = useNavigate();
  const userId = getUserId();
  const [userName, setUserName] = useState('');
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/user/get/profile/${userId}`);
        setUserName(response.data.user.name);
        setUserDetails(response.data.user);
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, [userId]);

  const handleAccept = async () => {
    try {
      await axios.put(`http://localhost:8000/user/accept-terms/${userId}`);
      if (userDetails && userDetails.type) {
        console.log(userDetails.type);
        
        switch (userDetails.type) {
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
            navigate("/admin/users");
            break;
          case "Tour Guide":
            navigate("/tour-guide/profile");
            break;
          case "Advertiser":
            navigate("/advertiser/my-activities");
            break;
          default:
            console.error("Unknown user type:", userDetails.type);
        }
      } else {
        console.error("User type is not defined");
      }
    } catch (error) {
      console.error("Error accepting terms:", error);
      alert("There was an error accepting the terms. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to Tripify, {userName}!
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" gutterBottom>
          Terms and Conditions
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="body1" gutterBottom>
            Please read the following terms and agreements carefully before using our services:
          </Typography>
          <Typography variant="body2" gutterBottom>
            1. You must be at least 18 years old to use our platform.
          </Typography>
          <Typography variant="body2" gutterBottom>
            2. All user-generated content must adhere to community guidelines.
          </Typography>
          <Typography variant="body2" gutterBottom>
            3. We reserve the right to modify or terminate the service at any time.
          </Typography>
        </Box>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleAccept}
          sx={{ mt: 3 }}
        >
          Accept
        </Button>
      </Paper>
    </Container>
  );
};

export default TermsAndAgreements;
