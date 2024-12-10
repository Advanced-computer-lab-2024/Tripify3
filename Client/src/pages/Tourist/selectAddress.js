import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { getUserId } from "../../utils/authUtils";
import { useParams, useNavigate } from "react-router-dom";

const SelectAddress = () => {
  const { price, dropOffDate, delivery } = useParams();
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = getUserId();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/tourist/get/addresses/${userId}`
        );
        setLocations(response.data.addresses || []);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [userId]);

  const handleSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleContinue = () => {
    if (selectedLocation) {
      const dropOffLocation = selectedLocation.location;
      navigate(
        `/tourist/payment/${price}/Product/${null}/${null}/${dropOffLocation}/${dropOffDate}/${delivery}/${null}`
      );
    }
  };

  const handleAddNewAddress = () => {
    navigate("/tourist/add/address");
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} maxWidth="lg" margin="auto" position="relative">
      {/* Go Back Button */}
      <Button
        variant="contained"
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "10px",
          left: "0",
          transformOrigin: "center left",
          backgroundColor: "darkblue",
          color: "white",
          fontWeight: "bold",
          textTransform: "none",
          transition: "transform 0.2s ease-in-out",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        Go Back
      </Button>

      <Typography variant="h4" textAlign="center" gutterBottom>
        🌍 Select Your Address
      </Typography>

      <Box display="flex" justifyContent="center" mb={3}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleAddNewAddress}
          style={{
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          ➕ Add a New Address
        </Button>
      </Box>

      <Box display="flex" flexDirection="column" gap={2} alignItems="center">
        {locations.map((address) => (
          <Card
            key={address._id}
            onClick={() => handleSelect(address)}
            style={{
              width: "100%",
              maxWidth: 400,
              border: selectedLocation?._id === address._id ? "4px solid #ff6f61" : "3px solid #2196f3",
              cursor: "pointer",
              transition: "border-color 0.3s, transform 0.2s",
              borderRadius: "15px",
              boxShadow: selectedLocation?._id === address._id ? "0px 4px 12px rgba(255, 111, 97, 0.5)" : "0px 2px 6px rgba(0, 0, 0, 0.2)",
              backgroundColor: selectedLocation?._id === address._id ? "#ffe6e1" : "#e3f2fd",
              transform: selectedLocation?._id === address._id ? "scale(1.05)" : "scale(1)",
            }}
          >
            <CardContent>
              <Typography variant="h6" style={{ fontWeight: 600, marginBottom: "5px" }}>
                📍 {address.label}
              </Typography>
              <Typography color="textSecondary" style={{ fontSize: "0.9rem" }}>
                🗺️ {address.location}
              </Typography>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="contained"
          color="primary"
          disabled={!selectedLocation}
          onClick={handleContinue}
          style={{
            marginTop: "1rem",
            backgroundColor: "#4caf50",
            color: "#fff",
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default SelectAddress;
