import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import { getUserId, getUserType, getUserPreferences } from "../../utils/authUtils";
const Bookmarks = () => {
  const userId  = getUserId(); // Get user ID from URL params
  const [bookmarkedItineraries, setBookmarkedItineraries] = useState([]);
  const [bookmarkedActivities, setBookmarkedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/tourist/bookmarks/${userId}`);
        setBookmarkedItineraries(response.data.bookmarkedItineraries);
        setBookmarkedActivities(response.data.bookmarkedActivities);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [userId]);

  const handleFilter = () => {
    const filterItems = (items) =>
      items.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = ratingFilter ? item.rating >= parseInt(ratingFilter, 10) : true;
        const matchesBudget = budgetFilter ? item.price <= parseFloat(budgetFilter) : true;
        return matchesSearch && matchesRating && matchesBudget;
      });

    setBookmarkedItineraries(filterItems(bookmarkedItineraries));
    setBookmarkedActivities(filterItems(bookmarkedActivities));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Filters Section */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
        <TextField
          label="Search by name"
          variant="outlined"
          sx={{ mr: 2, width: "300px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl variant="outlined" sx={{ mr: 2, width: "150px" }}>
          <InputLabel>Filter by Rating</InputLabel>
          <Select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} label="Filter by Rating">
            <MenuItem value="">All Ratings</MenuItem>
            <MenuItem value="1">1 and above</MenuItem>
            <MenuItem value="2">2 and above</MenuItem>
            <MenuItem value="3">3 and above</MenuItem>
            <MenuItem value="4">4 and above</MenuItem>
            <MenuItem value="5">5</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Budget (<=)"
          type="number"
          variant="outlined"
          value={budgetFilter}
          onChange={(e) => setBudgetFilter(e.target.value)}
          sx={{ mr: 2, width: "150px" }}
        />
        <Button variant="contained" onClick={handleFilter}>
          Apply Filters
        </Button>
      </Box>

      {/* Bookmarked Itineraries */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }} color="secondary">
          Bookmarked Itineraries
        </Typography>
        <Grid container spacing={3}>
          {bookmarkedItineraries.map((itinerary) => (
            <Grid item xs={12} md={6} lg={4} key={itinerary._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{itinerary.name}</Typography>
                  <Typography>
                    <strong>Price:</strong> ${itinerary.price}
                  </Typography>
                  <Typography>
                    <strong>Rating:</strong> {itinerary.rating} / 5
                  </Typography>
                  <Button
                    component={Link}
                    to={`/tourist/itinerary/${itinerary._id}`}
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Bookmarked Activities */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }} color="secondary">
          Bookmarked Activities
        </Typography>
        <Grid container spacing={3}>
          {bookmarkedActivities.map((activity) => (
            <Grid item xs={12} md={6} lg={4} key={activity._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{activity.name}</Typography>
                  <Typography>
                    <strong>Price:</strong> ${activity.price}
                  </Typography>
                  <Typography>
                    <strong>Rating:</strong> {activity.rating || "N/A"} / 5
                  </Typography>
                  <Button
                    component={Link}
                    to={`/activity/${activity._id}`}
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Bookmarks;
