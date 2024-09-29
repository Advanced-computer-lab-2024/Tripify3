import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material';

const VerificationCode = () => {
    const { state } = useLocation();
    const [verificationCode, setVerificationCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const username = state.username;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear previous error message

        try {
            const response = await fetch('http://localhost:8000/access/user/verifyVerificationCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, verificationCode }),
            });

            if (response.status === 200) {
                navigate('/new-password', { state: { username } }); // Navigate to new password page
            } else {
                setErrorMessage('Incorrect or invalid verification code. Please try again.'); // Set error message
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again later.'); // Set error for network issues
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
                    Enter Verification Code
                </Typography>

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="6-digit code"
                        variant="outlined"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
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
                        Submit
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default VerificationCode;
