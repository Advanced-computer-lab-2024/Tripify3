import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ChangePassword = () => {
  const [email, setEmail] = useState('');
  const [openPopup, setOpenPopup] = useState(false); // State for controlling the popup visibility

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password change request for email:', email);
    setOpenPopup(true); 
  };

  const handleClosePopup = () => {
    setOpenPopup(false); 
  };

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        backgroundColor: '#f4f7fa',
        paddingTop: '50px',
      }}
    >
      <Paper
        sx={{
          padding: '50px',
          width: '100%',
          maxWidth: '600px',
          minHeight: '400px',
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
          <Box mb={3}>
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
                padding: '15px',
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

      {/* Popup Dialog */}
      <Dialog open={openPopup} onClose={handleClosePopup}>
  <DialogTitle sx={{ textAlign: 'center', fontSize: '20px', fontWeight: 600 }}>
    Email Sent
  </DialogTitle>
  <DialogContent sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
    <CheckCircleIcon sx={{ fontSize: '80px', color: '#4caf50', marginBottom: '20px' }} /> {/* Increased size of the icon */}
    <Typography variant="h6" sx={{ color: '#333' }}>
      A password reset link has been sent to your email address.
    </Typography>
  </DialogContent>
  <DialogActions sx={{ justifyContent: 'center' }}>
    <Button onClick={handleClosePopup} color="primary" variant="contained" sx={{ fontWeight: 'bold' }}>
      Close
    </Button>
  </DialogActions>
</Dialog>

    </Container>
  );
};

export default ChangePassword;
