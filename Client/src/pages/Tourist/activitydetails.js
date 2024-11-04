import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { getActivityById } from '../../services/tourist'; // Import the service to fetch activity by ID

const ActivityDetails = () => {
  const { id } = useParams(); // Retrieve the ID from the URL
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <Typography variant="h4" color="secondary" gutterBottom>
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
      <Button variant="contained" color="primary" href="/activities">
        Back to Activities
      </Button>
    </Box>
  );
};

export default ActivityDetails;