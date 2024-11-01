import React from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

const Wallet = ({ walletAmount }) => {
  return (
    <Card 
      sx={{ 
        marginBottom: 4, 
        borderRadius: 2, // Set border radius (adjust as needed)
        boxShadow: 2 // Apply shadow (adjust level as needed)
      }}
    >
      <CardHeader 
        title="Wallet Balance" 
        titleTypographyProps={{ variant: "h6" }} 
      />
      <CardContent>
        <Typography 
          variant="h4" 
          sx={{ fontWeight: "bold", color: "#4CAF50" }}
        >
          EGP {walletAmount.toFixed(2)} {/* Display wallet amount with EGP */}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ color: "#555", marginTop: 1 }}
        >
          Your current wallet balance.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Wallet;
