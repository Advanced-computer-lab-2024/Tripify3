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
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>
            Upcoming Itineraries
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          {userType === "Tour Guide" && (
            <Button color="secondary" variant="contained" onClick={() => navigate("/tour-guide/create-itinerary")}>
              Add +
            </Button>
          )}
          <TextField label="Search by name" variant="outlined" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} sx={{ mr: 2, width: "300px" }} />
          <FormControl variant="outlined" sx={{ mr: 2, width: "150px" }}>
            <InputLabel>Sort by Price</InputLabel>
            <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} label="Sort by Price">
              <MenuItem value="asc">Low to High</MenuItem>
              <MenuItem value="desc">High to Low</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleSortByPrice}>
            Sort
          </Button>
        </Box>

        <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
          <FormControl variant="outlined" sx={{ mr: 2, width: "200px" }}>
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={selectedTags}
              onChange={(e) => setSelectedTags(e.target.value)}
              input={<OutlinedInput label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={tags.find((tag) => tag._id === value)?.name || value} />
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

          <FormControl variant="outlined" sx={{ mr: 2, width: "200px" }}>
            <InputLabel>Languages</InputLabel>
            <Select
              multiple
              value={selectedLanguages}
              onChange={(e) => setSelectedLanguages(e.target.value)}
              input={<OutlinedInput label="Languages" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {languageOptions.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  <Checkbox checked={selectedLanguages.indexOf(lang) > -1} />
                  <ListItemText primary={lang} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="Budget" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} variant="outlined" sx={{ width: "150px", mr: 2 }} />

          <Button variant="contained" color="secondary" onClick={handleResetFilters} sx={{ ml: 2 }}>
            Reset Filters
          </Button>
        </Box>

        <Grid container spacing={3}>
          {filteredItineraries.map((itinerary) => (
            <Grid item xs={12} md={6} key={itinerary._id}>
              <Card sx={{ display: "flex", justifyContent: "space-between" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {itinerary.name}
                  </Typography>
                  <Typography>Price: EGP {itinerary.price}</Typography>
                  <Typography>
                    <strong>Language:</strong> {itinerary.language}
                  </Typography>
                  <Typography>
                    <strong>Tags:</strong> {itinerary.tags.map((tag) => tag.name).join(", ")}
                  </Typography>

                  <Button component={Link} to={`/tour-guide/itinerary/details/${itinerary._id}`} variant="contained" sx={{ mt: 2 }}>
                    View Details
                  </Button>

                  <Button
                    onClick={() => handleDeleteItinerary(itinerary._id)} // Trigger state update
                    variant="contained"
                    sx={{
                      marginLeft: 2,
                      mt: 2,
                      backgroundColor: "red", // Red color if not deleted
                      "&:hover": { backgroundColor: "#d32f2f" }, // Hover color
                    }}
                  >
                    <DeleteIcon sx={{ color: "white", mr: 1 }} /> {/* White color for the icon */}
                    Delete Itinerary
                  </Button>
                </CardContent>

                <Dialog open={bookingErrorDialogOpen} onClose={() => setBookingErrorDialogOpen(false)}>
                  <DialogTitle sx={{ color: "#f44336" }}>Unable to Delete Itinerary</DialogTitle>
                  <DialogContent>
                    <Alert severity="error" sx={{ mb: 2 }}>
                      You have upcoming bookings. Please cancel them before deleting the itinerary.
                    </Alert>
                    <DialogContentText>If you need further assistance, please contact our support team.</DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setBookingErrorDialogOpen(false)}
                      variant="outlined"
                      sx={{
                        color: "#f44336",
                        borderColor: "#f44336",
                        ":hover": { backgroundColor: "#fdecea", borderColor: "#f44336" },
                      }}
                    >
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>

                {userType === "Admin" && (
                  <IconButton color={itinerary.inappropriate ? "error" : "primary"} onClick={() => handleFlagClick(itinerary._id, itinerary.inappropriate)}>
                    <FlagIcon />
                  </IconButton>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default TourGuideItineraries;
