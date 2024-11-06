import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper } from '@mui/material';

// Define custom styles using the `sx` prop
const ChangePassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for sending email to change password goes here
    console.log('Password change request for email:', email);
  };

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start', // Align items to the top of the page
        minHeight: '100vh', // Keeps the full height of the viewport
        backgroundColor: '#f4f7fa',
        paddingTop: '50px', // Move the content higher from the top
      }}
    >
      <Paper
        sx={{
          padding: '50px', // Increased padding for more spacious design
          width: '100%',
          maxWidth: '600px', // Increased width for larger card
          minHeight: '400px', // Increased card height
          borderRadius: '15px',
          boxShadow: 3,
          backgroundColor: '#ffffff',
        }}
      >
        <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: '20px', fontSize: '26px', fontWeight: 600, color: '#333333' }}>
          Change Your Password
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" sx={{ marginBottom: '30px' }}>
          Enter your email address and we will send you a link to change your password.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={3}> {/* Increased bottom margin for spacing */}
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ marginBottom: '20px' }}
            />
          </Box>
          <Box mb={3}>
            <Button
              variant="contained"
              fullWidth
              type="submit"
              sx={{
                backgroundColor: '#007bff',
                color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#0056b3',
                },
                padding: '15px', // Increased padding for button
              }}
            >
              Send Reset Link
            </Button>
          </Box>
        </form>
        <Typography variant="body2" sx={{ textAlign: 'center', fontSize: '14px', color: '#666666', marginTop: '30px' }}>
          We'll send you an email with a link to reset your password.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ChangePassword;
