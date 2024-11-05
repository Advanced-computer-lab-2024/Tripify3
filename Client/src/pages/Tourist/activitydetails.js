import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { getActivityById } from '../../services/tourist'; // Import the service to fetch activity by ID

const ActivityDetails = () => {
  const { id } = useParams(); // Retrieve the ID from the URL
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentActivityId, setCurrentActivityId] = useState(null); // Current Activity ID state

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await getActivityById(id);
        setActivity(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching activity details");
        setLoading(false);
      }
    };
    fetchActivity();
  }, [id]);

  const toggleShareDropdown = (activityId) => {
    // Toggle the dropdown: if the same activity is clicked, close it; otherwise, open it
    if (currentActivityId === activityId) {
      setCurrentActivityId(null); // Close the dropdown
    } else {
      setCurrentActivityId(activityId); // Open the dropdown for the selected activity
    }
  };

  const handleCopyLink = (activityId) => {
    const link = `http://localhost:3000/tourist/activity/${activityId}`; // Replace with actual activity link
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
      setCurrentActivityId(null); // Close dropdown after copying
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
        {activity.name}
      </Typography>
      <Typography variant="h6">
        <strong>Price:</strong> ${activity.price}
      </Typography>
      <Typography variant="body1">
        <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
      </Typography>
      <Typography variant="body1">
        <strong>Description:</strong> {activity.description}
      </Typography>
      {/* Modified styles for the Back to Activities button */}
      <Button variant="contained" color="primary" href="/tourist/activities" sx={{ mt: 2 }}>
        Back to Activities
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
        onClick={() => toggleShareDropdown(activity._id)}
      >
        Share
      </Button>
      
      {currentActivityId === activity._id && (
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
          <Button variant="text" onClick={() => handleCopyLink(activity._id)}>
            Copy Link
          </Button>
          <Button
            variant="text"
            href={`https://twitter.com/intent/tweet?url=http://localhost:3000/Tourist/activities/${activity._id}`}
            target="_blank"
          >
            Share on Twitter
          </Button>
          <Button
            variant="text"
            href={`https://www.facebook.com/sharer/sharer.php?u=http://localhost:3000/Tourist/activities/${activity._id}`}
            target="_blank"
          >
            Share on Facebook
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ActivityDetails;