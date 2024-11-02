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
  Chip,
  Checkbox,
  OutlinedInput,
  ListItemText,
  Grid,
  CircularProgress,
  IconButton, // Import IconButton
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getAllIteneraries, getAllTags, markItineraryInappropriate } from "../../services/tourist.js"; // Updated API functions
import { getUserId, getUserType } from "../../utils/authUtils.js";
import FlagIcon from "@mui/icons-material/Flag"; // Import FlagIcon
import { toast } from "react-toastify"; // Optional: For notification

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

const Itineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [budget, setBudget] = useState("");
  const [validationError, setValidationError] = useState("");
  const userId = getUserId();
  const userType = getUserType();

  const languageOptions = ["English", "Spanish", "French", "German", "Arabic", "Russian", "Japanese", "Korean", "Italian"];

  // Fetch itineraries and tags when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itinerariesResponse, tagsResponse] = await Promise.all([getAllIteneraries(userId), getAllTags()]);
        setItineraries(itinerariesResponse.data);
        setTags(tagsResponse.data.tags);
        setLoading(false);
      } catch (error) {
        setError("Error fetching itineraries or tags");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTagChange = (event) => {
    setSelectedTags(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguages(event.target.value);
  };

  const handleSortByPrice = () => {
    const sortedItineraries = [...itineraries].sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });
    setItineraries(sortedItineraries);
  };

  const handleFilter = () => {
    // Implement filtering logic
  };

  const handleResetFilters = () => {
    setSelectedTags([]);
    setSelectedLanguages([]);
    setBudget("");
    // Optionally refetch itineraries
  };

  const handleFlagClick = async (itineraryId, currentInappropriateStatus) => {
    try {
      const newStatus = !currentInappropriateStatus; // Toggle the current status
      await markItineraryInappropriate(itineraryId, { inappropriate: newStatus }); // Call API with new status

      setItineraries((prevItineraries) =>
        prevItineraries.map((itinerary) =>
          itinerary._id === itineraryId
            ? { ...itinerary, inappropriate: newStatus } // Update local state with the new status
            : itinerary
        )
      );

      toast.success(newStatus ? "Itinerary marked as inappropriate!" : "Itinerary unmarked as inappropriate!"); // Notify the user based on the action
    } catch (error) {
      toast.error("Error updating itinerary status!"); // Handle error
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
        {/* Search, Sort, and Filter Section */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <TextField label="Search by name" variant="outlined" sx={{ mr: 2, width: "300px" }} />
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

        {/* Filters Section */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
          <FormControl variant="outlined" sx={{ mr: 2, width: "200px" }}>
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={selectedTags}
              onChange={handleTagChange}
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
              onChange={handleLanguageChange}
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

          <Button variant="contained" onClick={handleFilter} sx={{ mr: 2 }}>
            Filter
          </Button>

          <Button variant="contained" color="secondary" onClick={handleResetFilters} sx={{ ml: 2 }}>
            Reset Filters
          </Button>
        </Box>

        {/* Itineraries Section */}
        <Grid container spacing={3}>
          {itineraries.map((itinerary) => (
            <Grid item xs={12} md={6} key={itinerary._id}>
              <Card sx={{ display: "flex", justifyContent: "space-between" }}>
                <CardContent>
                  <Typography variant="h6" color="secondary">
                    {itinerary.name}
                  </Typography>
                  <Typography>
                    <strong>Price:</strong> ${itinerary.price}
                  </Typography>
                  <Typography>
                    <strong>Language:</strong> {itinerary.language}
                  </Typography>
                  {userType === "Admin" && ( // Render flag icon only for admin users
                    <IconButton
                      onClick={() => handleFlagClick(itinerary._id, itinerary.inappropriate)} // Pass current inappropriate status
                      sx={{ color: itinerary.inappropriate ? "red" : "inherit" }} // Change color if marked inappropriate
                    >
                      <FlagIcon />
                    </IconButton>
                  )}

                  <Button variant="contained" sx={{ mt: 2 }} onClick={() => console.log(`Navigate to itinerary ${itinerary._id}`)}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Itineraries;
