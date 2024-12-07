import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
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
import { Bookmark } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

import { getUserId } from "../../utils/authUtils";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1e3a5f", // Dark blue
    },
    secondary: {
      main: "#ff6f00", // Orange
    },
  },
});

const Bookmarks = () => {
  const userId = getUserId();
  const [originalItineraries, setOriginalItineraries] = useState([]);
  const [originalActivities, setOriginalActivities] = useState([]);
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
        setOriginalItineraries(response.data.bookmarkedItineraries);
        setOriginalActivities(response.data.bookmarkedActivities);
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

  const applyFilters = () => {
    const filterItems = (items) =>
      items.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = ratingFilter ? item.rating >= parseInt(ratingFilter, 10) : true;
        const matchesBudget = budgetFilter ? item.price <= parseFloat(budgetFilter) : true;
        return matchesSearch && matchesRating && matchesBudget;
      });

    setBookmarkedItineraries(filterItems(originalItineraries));
    setBookmarkedActivities(filterItems(originalActivities));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setRatingFilter("");
    setBudgetFilter("");
    setBookmarkedItineraries([...originalItineraries]);
    setBookmarkedActivities([...originalActivities]);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, ratingFilter, budgetFilter]);

  const handleToggleBookmark = async (itemId, itemType) => {
    try {
      await axios.post("http://localhost:8000/toggle-bookmark", {
        userId,
        itemType,
        itemId,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 4 }}>
        {/* Title */}
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 4,
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          Bookmarked Events
        </Typography>

        {/* Filters Section */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
            backgroundColor: "#f0f4f7",
            padding: 2,
            borderRadius: 2,
          }}
        >
          <TextField
            label="Search by Name"
            variant="outlined"
            sx={{ width: "300px", bgcolor: "white" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FormControl variant="outlined" sx={{ width: "150px" }}>
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
            sx={{ width: "150px", bgcolor: "white" }}
          />
          <Button variant="contained" color="secondary" onClick={resetFilters}>
            Reset Filters
          </Button>
        </Box>

        {/* Bookmarked Itineraries */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}>
            Bookmarked Itineraries
          </Typography>
          <Grid container spacing={3}>
            {bookmarkedItineraries.map((itinerary) => (
              <Grid item xs={12} md={6} lg={4} key={itinerary._id}>
                <Card sx={{ bgcolor: "#eaf4f4" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="h6" sx={{ color: "primary.main" }}>
                        {itinerary.name}
                      </Typography>
                      <IconButton
                        onClick={() => handleToggleBookmark(itinerary._id, "itinerary")}
                        sx={{ color: "black" }}
                      >
                        <Bookmark />
                      </IconButton>
                    </Box>
                    <Typography>
                      <strong>Price:</strong> {itinerary.price} EGP
                    </Typography>
                    <Typography>
                      <strong>Rating:</strong> {itinerary.rating} / 5
                    </Typography>
                    <Button
                      component={Link}
                      to={`/tourist/itinerary/${itinerary._id}`}
                      variant="contained"
                      sx={{ mt: 2, bgcolor: "primary.main" }}
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
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}>
            Bookmarked Activities
          </Typography>
          <Grid container spacing={3}>
            {bookmarkedActivities.map((activity) => (
              <Grid item xs={12} md={6} lg={4} key={activity._id}>
                <Card sx={{ bgcolor: "#eaf4f4" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="h6" sx={{ color: "primary.main" }}>
                        {activity.name}
                      </Typography>
                      <IconButton
                        onClick={() => handleToggleBookmark(activity._id, "activity")}
                        sx={{ color: "black" }}
                      >
                        <Bookmark />
                      </IconButton>
                    </Box>
                    <Typography>
                      <strong>Price:</strong> {activity.price} EGP
                    </Typography>
                    <Typography>
                      <strong>Rating:</strong> {activity.rating || "N/A"} / 5
                    </Typography>
                    <Button
                      component={Link}
                      to={`/activity/${activity._id}`}
                      variant="contained"
                      sx={{ mt: 2, bgcolor: "primary.main" }}
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
    </ThemeProvider>
  );
};

export default Bookmarks;
