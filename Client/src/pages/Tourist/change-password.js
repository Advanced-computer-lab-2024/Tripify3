import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Container, Paper, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { getUserId } from "../../utils/authUtils";

const ChangePassword = () => {
  const userId = getUserId();
  const [user, setUser] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8000/user/get/profile/${userId}`)
      .then(response => {
        setUser(response.data.user);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword === user.password) {
      setPasswordError('New password cannot be the same as the old password.');
      return;
    }

    if (newPassword !== repeatPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError('Password must be at least 6 characters long, contain a number, an uppercase letter, and a special character.');
      return;
    }

    setPasswordError('');
    setIsSubmitting(true);

    axios.put('http://localhost:8000/user/change/password', {
      username: user.username,
      oldPassword: user.password,
      newPassword: newPassword,
    })
      .then(response => {
        setIsSubmitting(false);
        setOpenPopup(false);
      })
      .catch(error => {
        setIsSubmitting(false);
        setPasswordError('Error changing password, please try again.');
        console.error('Error changing password:', error);
      });
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
        {user && (
          <>
            <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: '20px', fontSize: '26px', fontWeight: 600, color: '#333333' }}>
              Security Settings
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center">
              <TextField
                label="Password"
                type="password"
                value="********"
                variant="outlined"
                sx={{ width: '70%', marginRight: '10px' }}
                InputProps={{ readOnly: true }}
              />
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#0056b3',
                  },
                }}
                onClick={() => setOpenPopup(true)}
              >
                Change Password
              </Button>
            </Box>
          </>
        )}

        {/* Popup Dialog */}
        <Dialog open={openPopup} onClose={() => setOpenPopup(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: 'center', fontSize: '20px', fontWeight: 600 }}>
            Change Password
          </DialogTitle>
          <DialogContent sx={{ padding: '20px', textAlign: 'center' }}>
            {passwordError && (
              <FormHelperText error sx={{ marginBottom: '20px' }}>
                {passwordError}
              </FormHelperText>
            )}
            <TextField
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              sx={{ marginBottom: '20px' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword((show) => !show)}
                      edge="end"
                    >
                      {showNewPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Repeat Password"
              type={showRepeatPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
              sx={{ marginBottom: '20px' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowRepeatPassword((show) => !show)}
                      edge="end"
                    >
                      {showRepeatPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              disabled={isSubmitting}
              sx={{ fontWeight: 'bold' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default ChangePassword;
