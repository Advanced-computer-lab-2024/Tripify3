import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

const NewPassword = () => {
    const { state } = useLocation();
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();
    const username = state.username;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:8000/access/user/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, newPassword }),
            });
            alert('Password has been reset successfully!');
            navigate('/'); // Redirect to home or login page
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Box
                sx={{
                    backgroundColor: '#fff',
                    padding: '40px',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h5" gutterBottom color="primary">
                    Enter New Password
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="New Password"
                        variant="outlined"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        margin="normal"
                        required
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: '20px', backgroundColor: '#00695C' }}
                    >
                        Reset Password
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default NewPassword;
