import React, { useState, useEffect } from "react";
import axios from "axios";
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
  DialogTitle,
  DialogContent,
  Alert,
  DialogContentText,
  DialogActions,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Dialog,
  Checkbox,
  OutlinedInput,
  ListItemText,
  Grid,
  CircularProgress,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getAllItenerariesForTourGuide, getAllTags } from "../../services/tourGuide.js";
import { getUserId, getUserType } from "../../utils/authUtils.js";
import FlagIcon from "@mui/icons-material/Flag";
import { toast } from "react-toastify";
import { markItineraryInappropriate } from "../../services/admin.js";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1e3a5f",
    },
    secondary: {
      main: "#ff6f00",
    },
  },
});

const TourGuideItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [budget, setBudget] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userType, setUserType] = useState("");
  const [bookingErrorDialogOpen, setBookingErrorDialogOpen] = useState(false);

  const userId = getUserId();

  const navigate = useNavigate();
  const languageOptions = ["English", "Spanish", "French", "German", "Arabic", "Russian", "Japanese", "Korean", "Italian"];

  useEffect(() => {
    setUserType(getUserType()); // Fetch the user type when component mounts
    const fetchData = async () => {
      try {
        const [itinerariesResponse, tagsResponse] = await Promise.all([getAllItenerariesForTourGuide(userId), getAllTags()]);
        setItineraries(itinerariesResponse.data.data);
        setFilteredItineraries(itinerariesResponse.data.data);
        setTags(tagsResponse.data.tags);
        setLoading(false);
      } catch (error) {
        setError("Error fetching itineraries or tags");
        setLoading(false);
        setFilteredItineraries([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = itineraries
      .filter((itinerary) => (searchQuery ? itinerary.name.toLowerCase().includes(searchQuery.toLowerCase()) : true))
      .filter((itinerary) => (selectedTags.length ? selectedTags.every((tag) => itinerary.tags.includes(tag)) : true))
      .filter((itinerary) => (selectedLanguages.length ? selectedLanguages.includes(itinerary.language) : true))
      .filter((itinerary) => (budget ? itinerary.price <= budget : true));

    setFilteredItineraries(filtered);
  }, [searchQuery, selectedTags, selectedLanguages, budget, itineraries]);

  const handleSortByPrice = () => {
    const sorted = [...filteredItineraries].sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });
    setFilteredItineraries(sorted);
  };

  const handleResetFilters = () => {
    setSelectedTags([]);
    setSelectedLanguages([]);
    setBudget("");
    setSearchQuery("");
    setFilteredItineraries(itineraries);
  };

  const handleDeleteItinerary = async (itineraryId) => {
    try {
      // Send PATCH request to mark itinerary as deleted
      await axios.put(`http://localhost:8000/itinerary/delete/${itineraryId}`);

      // Update local state
      setItineraries((prevItineraries) => prevItineraries.map((itinerary) => (itinerary._id === itineraryId ? { ...itinerary, isDeleted: true } : itinerary)));
      setFilteredItineraries((prevItineraries) => prevItineraries.map((itinerary) => (itinerary._id === itineraryId ? { ...itinerary, isDeleted: true } : itinerary)));

      window.location.reload();

      toast.success("Itinerary marked as deleted!");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Open the dialog for booking error
        setBookingErrorDialogOpen(true);
      } else {
        toast.error("Error marking itinerary as deleted!");
      }
    }
  };

  const handleFlagClick = async (itineraryId, currentInappropriateStatus) => {
    try {
      const newStatus = !currentInappropriateStatus;
      await markItineraryInappropriate(itineraryId, { inappropriate: newStatus });

      setFilteredItineraries((prevItineraries) => prevItineraries.map((itinerary) => (itinerary._id === itineraryId ? { ...itinerary, inappropriate: newStatus } : itinerary)));

      toast.success(newStatus ? "Itinerary marked as inappropriate!" : "Itinerary unmarked as inappropriate!");
    } catch (error) {
      toast.error("Error updating itinerary status!");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          background: "linear-gradient(to bottom, #f5f7fa, #c3cfe2)",
          minHeight: "100vh",
          padding: 4,
        }}
      >
        <AppBar position="static" color="primary" sx={{ mb: 4 }}>
          <Toolbar sx={{ justifyContent: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#fff" }}>
              Upcoming Itineraries
            </Typography>
          </Toolbar>
        </AppBar>
  
        <Box sx={{ maxWidth: "1200px", margin: "auto" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
            {userType === "Tour Guide" && (
              <Button
                color="secondary"
                variant="contained"
                onClick={() => navigate("/tour-guide/create-itinerary")}
                sx={{ borderRadius: "8px", padding: "12px 20px" }}
              >
                Add +
              </Button>
            )}
            <TextField
              label="Search by name"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flexGrow: 1, minWidth: "250px", mx: 2 }}
            />
            <FormControl variant="outlined" sx={{ minWidth: "150px", mx: 2 }}>
              <InputLabel>Sort by Price</InputLabel>
              <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} label="Sort by Price">
                <MenuItem value="asc">Low to High</MenuItem>
                <MenuItem value="desc">High to Low</MenuItem>
              </Select>
            </FormControl>
  
            <Button variant="contained" onClick={handleSortByPrice} sx={{ borderRadius: "8px", padding: "12px 20px" }}>
              Sort
            </Button>
          </Box>
  
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between" }}>
            <FormControl variant="outlined" sx={{ minWidth: "200px", mx: 2 }}>
              <InputLabel>Tags</InputLabel>
              <Select
                multiple
                value={selectedTags}
                onChange={(e) => setSelectedTags(e.target.value)}
                input={<OutlinedInput label="Tags" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={tags.find((tag) => tag._id === value)?.name || value} sx={{ backgroundColor: "#e0f7fa", color: "#006064" }} />
                    ))}
                  </Box>
                )}
              >
                {tags.map((tag) => (
                  <MenuItem key={tag._id} value={tag._id}>
                    <Checkbox checked={selectedTags.indexOf(tag._id) > -1} />
                    <ListItemText primary={tag.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
  
            <TextField
              label="Budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              variant="outlined"
              sx={{ minWidth: "150px", mx: 2 }}
            />
  
            <Button variant="contained" color="secondary" onClick={handleResetFilters} sx={{ borderRadius: "8px", padding: "12px 20px" }}>
              Reset Filters
            </Button>
          </Box>
  
          <Typography variant="h5" sx={{ marginTop: 4, fontWeight: "bold", color: "#1e3a5f" }}>
            All Itineraries
          </Typography>
          <Grid container spacing={3}>
            {filteredItineraries.map((itinerary) => (
              <Grid item xs={12} md={6} key={itinerary._id}>
                <Card sx={{ position: 'relative', padding: 2, display: "block", flexDirection: "column", alignItems: "normal" }}>
                  {/* Delete Button positioned absolutely */}
                  <Button
                    onClick={() => handleDeleteItinerary(itinerary._id)}
                    variant="contained"
                    sx={{
                      backgroundColor: "white",
                      color: "white",
                      position: "absolute",
                      top: 8,
                      right: 8,
                      "&:hover": { backgroundColor: "#d32f2f" },
                    }}
                  >
                    <DeleteIcon sx={{ color: "red" }} />
                  </Button>
  
                  <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      📍 {itinerary.name}
                    </Typography>
                    <Typography>💵 {itinerary.price} EGP</Typography>
                    <Typography>
                      <strong>🈸 </strong> {itinerary.language}
                    </Typography>
                    <Typography>
                      <strong>🔖 </strong> {itinerary.tags.map((tag) => tag.name).join(", ")}
                    </Typography>
  
                    <Button
                      component={Link}
                      to={`/tour-guide/itinerary/details/${itinerary._id}`}
                      variant="contained"
                      sx={{
                        backgroundColor: "#ff6f00",
                        color: "white",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        "&:hover": { backgroundColor: "#e65c00" },
                        mt: 2,
                      }}
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

export default TourGuideItineraries;
