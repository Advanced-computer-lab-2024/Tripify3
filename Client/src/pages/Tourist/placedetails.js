import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { getPlaceById } from '../../services/tourist'; // Import the service to fetch place by ID

const PlaceDetails = () => {
  const { id } = useParams(); // Retrieve the place ID from the URL
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPlaceId, setCurrentPlaceId] = useState(null); // Current Place ID state

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await getPlaceById(id);
        setPlace(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching place details");
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);

  const toggleShareDropdown = (placeId) => {
    // Toggle the dropdown: if the same place is clicked, close it; otherwise, open it
    if (currentPlaceId === placeId) {
      setCurrentPlaceId(null); // Close the dropdown
    } else {
      setCurrentPlaceId(placeId); // Open the dropdown for the selected place
    }
  };

  const handleCopyLink = (placeId) => {
    // Construct the URL for the current place page
    const link = `http://localhost:3000/tourist/placedetails/${placeId}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
      setCurrentPlaceId(null); // Close dropdown after copying
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" color="black" gutterBottom>
        {place?.name || "Unnamed Place"}
      </Typography>
      <Typography variant="h6">
        <strong>Location:</strong> {typeof place?.location === 'object' ? JSON.stringify(place.location) : place?.location}
      </Typography>
      <Typography variant="body1">
        <strong>Description:</strong> {typeof place?.description === 'object' ? JSON.stringify(place.description) : place?.description}
      </Typography>
      {/* Modified styles for the Back to Places button */}
      <Button variant="contained" color="primary" href="/tourist/historical-places" sx={{ mt: 2 }}>
        Back to Places
      </Button>
      {/* Share button with modified styles */}
      <Button
        variant="outlined"
        sx={{
          mt: 2,
          ml: 2,
          color: 'blue', // Text color
          borderColor: 'blue', // Border color
          '&:hover': {
            backgroundColor: 'lightblue', // Background color on hover
            color: 'white', // Text color on hover
          },
        }}
        onClick={() => toggleShareDropdown(place?._id)}
      >
        Share
      </Button>
      
      {currentPlaceId === place?._id && (
        <Box
          sx={{
            position: "absolute",
            background: "white",
            boxShadow: 1,
            p: 1,
            mt: 1,
            zIndex: 10, // Ensure the dropdown appears above other elements
          }}
        >
          <Button variant="text" onClick={() => handleCopyLink(place._id)}>
            Copy Link
          </Button>
          <Button
            variant="text"
            href={`https://twitter.com/intent/tweet?url=http://localhost:3000/tourist/places/${place._id}`}
            target="_blank"
          >
            Share on Twitter
          </Button>
          <Button
            variant="text"
            href={`https://www.facebook.com/sharer/sharer.php?u=http://localhost:3000/tourist/places/${place._id}`}
            target="_blank"
          >
            Share on Facebook
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PlaceDetails;
