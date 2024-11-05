import React, { useState, useEffect } from "react";
import axios from 'axios';

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
  Chip,
  Checkbox,
  OutlinedInput,
  ListItemText,
  Grid,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getAllItenerariesForTourGuide, getAllTags, markItineraryInappropriate } from "../../services/tourGuide.js";
import { getUserId, getUserType } from "../../utils/authUtils.js";
import FlagIcon from "@mui/icons-material/Flag";

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
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [actionMessage, setActionMessage] = useState('');
  const userId = getUserId();
  const userType = getUserType();

  const languageOptions = ["English", "Spanish", "French", "German", "Arabic", "Russian", "Japanese", "Korean", "Italian"];

  // Fetch itineraries and tags on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itinerariesResponse, tagsResponse] = await Promise.all([
          getAllItenerariesForTourGuide(userId),
          getAllTags(),
        ]);

        setItineraries(itinerariesResponse.data.data);
        setFilteredItineraries(itinerariesResponse.data.data);
        setTags(tagsResponse.data.tags);
        setPickupLocation(itinerariesResponse.data.pickupLocation);
        setDropoffLocation(itinerariesResponse.data.dropoffLocation);

        setLoading(false);
      } catch (error) {
        setError("Error fetching itineraries or tags");
        setLoading(false);
        setFilteredItineraries([]);
      }
    };
    fetchData();
  }, [userId]);

  // Filter itineraries based on selected criteria
  useEffect(() => {
    const filtered = itineraries
      .filter((itinerary) =>
        searchQuery ? itinerary.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
      )
      .filter((itinerary) =>
        selectedTags.length ? selectedTags.every((tag) => itinerary.tags.includes(tag)) : true
      )
      .filter((itinerary) =>
        selectedLanguages.length ? selectedLanguages.includes(itinerary.language) : true
      )
      .filter((itinerary) => (budget ? itinerary.price <= budget : true));

    setFilteredItineraries(filtered);
  }, [searchQuery, selectedTags, selectedLanguages, budget, itineraries]);

  // Sort itineraries based on price
  const handleSortByPrice = () => {
    const sorted = [...filteredItineraries].sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });
    setFilteredItineraries(sorted);
  };
  const activateItinerary = async (id) => {
    try {
      console.log(`Activating itinerary with ID: ${id}`); // Debugging log
      const response = await axios.put(`http://localhost:8000/itinerary/activate/${id}`);
      console.log(response.data); // Debugging log
      setItineraries((prevItineraries) =>
        prevItineraries.map((itinerary) =>
          itinerary._id === id ? { ...itinerary, status: 'Active' } : itinerary
        )
      );
      setActionMessage(response.data.message);
    } catch (error) {
      console.error(error); // Debugging log
      setActionMessage(error.response?.data?.message || 'Error activating itinerary');
    }
  };
  
  const deactivateItinerary = async (id) => {
    try {
      console.log(`Deactivating itinerary with ID: ${id}`); // Debugging log
      const response = await axios.put(`http://localhost:8000/itinerary/deactivate/${id}`);
      console.log(response.data); // Debugging log
      setItineraries((prevItineraries) =>
        prevItineraries.map((itinerary) =>
          itinerary._id === id ? { ...itinerary, status: 'Inactive' } : itinerary
        )
      );
      setActionMessage(response.data.message);
    } catch (error) {
      console.error(error); // Debugging log
      setActionMessage(error.response?.data?.message || 'Error deactivating itinerary');
    }
  };
  
  

  // Reset filters and refetch itineraries
  const handleResetFilters = () => {
    setSelectedTags([]);
    setSelectedLanguages([]);
    setBudget("");
    setSearchQuery("");
    setFilteredItineraries(itineraries);
  };

  const formatAvailableDates = (availableDates) => {
    if (!availableDates || availableDates.length === 0) return "No available dates";
  
    const startDate = new Date(availableDates[0].date);
    const endDate = new Date(availableDates[availableDates.length - 1].date);
    return `${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;
  };

  const handleFlagClick = async (itineraryId, currentInappropriateStatus) => {
    try {
      const newStatus = !currentInappropriateStatus;
      await markItineraryInappropriate(itineraryId, { inappropriate: newStatus });

      setFilteredItineraries((prevItineraries) =>
        prevItineraries.map((itinerary) =>
          itinerary._id === itineraryId
            ? { ...itinerary, inappropriate: newStatus }
            : itinerary
        )
      );

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
      <AppBar position="static" color="primary" sx={{ mb: 4, marginTop: 8 }}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>
            Upcoming Itineraries
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <TextField
            label="Search by name"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mr: 2, width: "300px" }}
          />
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
            <Grid item xs={12} sm={6} md={4} key={itinerary._id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography sx={{marginBottom: 2}} variant="h5" color="secondary" component="div">
                    {itinerary.name}
                  </Typography>
                  <Typography ><strong>Duration: </strong>{itinerary.duration} hours</Typography>
                  <Typography ><strong>Language:</strong>{itinerary.language}</Typography>
                  <Typography ><strong>Price:</strong>${itinerary.price}</Typography>
                  <Typography ><strong>Available Dates: </strong>{formatAvailableDates(itinerary.availableDates)}</Typography>

                  <Typography ><strong>Pickup Location: </strong>{itinerary.pickupLocation}</Typography>
                  <Typography ><strong>Drop-off Location:</strong> {itinerary.dropoffLocation}</Typography>
                  <Typography ><strong>Accessibility: </strong>{itinerary.accessibility}</Typography>
                  <Typography ><strong>bookings:</strong> {itinerary.bookings.length}</Typography>
                  <Typography ><strong>status:</strong> {itinerary.status}</Typography>


                    <Typography><strong>Places:</strong></Typography>
                      {itinerary.places.length > 0 ? (
                        itinerary.places.map((place, index) => (
                          <div key={place._id}>
                            <Typography variant="body1">
                              {index + 1}. {place.name}
                            </Typography>
                          </div>
                        ))
                      ) : (
                        <Typography>No places found</Typography>
                      )}

                      <Typography><strong>Activities:</strong></Typography>
                      {itinerary.activities.length > 0 ? (
                        itinerary.activities.map((activity, index) => (
                          <div key={activity._id}>
                            <Typography variant="body1">
                              {index + 1}. {activity.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {activity.description}
                            </Typography>
                          </div>
                        ))
                      ) : (
                        <Typography>No activities found</Typography>
                      )}


                        {/* <Typography color="text.secondary">Tags:</Typography>
                        {itinerary.tags.length > 0 ? (
                          itinerary.tags.map((tag) => (
                            <div key={tag._id}>
                              <Typography variant="body1">{tag.name}</Typography>
                            </div>
                          ))
                        ) : (
                          <Typography>No tags found</Typography>
                        )} */}

                    {itinerary.status === 'Inactive' && (
                    <button onClick={() => activateItinerary(itinerary._id)}>Activate</button>
                  )}

                  {itinerary.status === 'Active' && itinerary.bookings.length > 0 && (
                    <button onClick={() => deactivateItinerary(itinerary._id)}>Deactivate</button>
                  )}

                  {itinerary.status === 'Active' && itinerary.bookings.length === 0 && (
                    <p>This itinerary cannot be deactivated as it has no bookings.</p>
                  )}



                 

                  
                </CardContent>
              </Card>
            </Grid>
          ))}

        </Grid>
      </Box>
      {actionMessage && <div>{actionMessage}</div>}

    </ThemeProvider>

  );
};

export default TourGuideItineraries;
