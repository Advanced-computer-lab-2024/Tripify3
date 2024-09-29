import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material';

const UsernameInput = () => {
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear the previous error message

        try {
            const response = await fetch('http://localhost:8000/access/user/sendVerificationCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            if (response.status === 200) {
                navigate('/verify-code', { state: { username } }); // Navigate to verification page
            } else {
                setErrorMessage('User not found. Please try again.'); // Set the error message
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again later.'); // Handle network or other errors
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
                    Enter Your Username
                </Typography>

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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

export default UsernameInput;
