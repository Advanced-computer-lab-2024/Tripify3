import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Box, Card, CardContent, Typography, CircularProgress, Grid } from "@mui/material";

const ViewActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('http://localhost:8000/activity/get'); // Adjust the endpoint as necessary
        setActivities(response.data);
        console.log(activities.length);
      } catch (err) {
        setError('Failed to fetch activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Activities
      </Typography>
      <Grid container spacing={2}>
        {activities.map((activity) => (
          <Grid item xs={12} sm={6} md={4} key={activity._id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{activity.name}</Typography>
                <Typography color="textSecondary">{activity.location}</Typography>
                <Typography variant="body2">Date: {new Date(activity.date).toLocaleDateString()}</Typography>
                <Typography variant="body2">Time: {activity.time}</Typography>
                <Typography variant="body2">Duration: {activity.duration} minutes</Typography>
                <Typography variant="body2">Price: ${activity.price}</Typography>
                <Typography variant="body2">Status: {activity.status}</Typography>
                {/* Display other relevant information as needed */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ViewActivities;
