import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Alert, IconButton } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import backgroundImage from '../../../assets/logo.jpeg'; // Import your image

const NewPassword = () => {
    const { state } = useLocation();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false); // Separate state for new password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Separate state for confirm password visibility
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const email = state.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (newPassword !== confirmPassword) {
                setErrorMessage("Passwords do not match.");
                return;
            }
            await fetch('http://localhost:8000/user/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, newPassword }),
            });
            alert('Password has been reset successfully!');
            navigate('/'); // Redirect to home or login page
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage("An error occurred while resetting your password.");
        }
    };

    return (
        <Container
            maxWidth={false}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '80%',
                    height: '80vh',
                    backgroundColor: '#fff',
                    padding: '40px',
                    borderRadius: '20px',
                    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
                    textAlign: 'center',
                    position: 'relative',
                }}
            >
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        color: '#00695C',
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>

                <Box
                    sx={{
                        width: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '40px',
                    }}
                >
                    <Box sx={{ width: '100%', maxWidth: '500px' }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                            Create New Password
                        </Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ marginBottom: '30px' }}>
                            Your new password must be unique from those previously used.
                        </Typography>

                        {errorMessage && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {errorMessage}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="New Password"
                                type={showNewPassword ? 'text' : 'password'}
                                variant="outlined"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                margin="normal"
                                required
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            edge="end"
                                            sx={{ color: 'orange' }} // Set color to orange
                                        >
                                            {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                variant="outlined"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                margin="normal"
                                required
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                            sx={{ color: 'orange' }} // Set color to orange
                                        >
                                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    ),
                                }}
                            />
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ marginTop: '20px', backgroundColor: '#00695C' }} // Set button color to blue
                            >
                                Confirm
                            </Button>
                        </form>
                    </Box>
                </Box>

                <Box
                    sx={{
                        width: '50%',
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '20px',
                    }}
                />
            </Box>
        </Container>
    );
};

export default NewPassword;
