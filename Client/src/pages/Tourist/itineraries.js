import React, { useState, useEffect } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

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
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getUserId } from "../../utils/authUtils";
import { getItineraryById, getUserProfile } from "../../services/tourist";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toggleBookmark, getAllItineraries, getAllActiveAppropriateIteneraries, getAllTags } from "../../services/tourist.js";
import { getUserType, getUserPreferences } from "../../utils/authUtils.js";
import FlagIcon from "@mui/icons-material/Flag";
import { toast } from "react-toastify";
import { markItineraryInappropriate } from "../../services/admin.js";
import { useParams } from "react-router-dom";

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

const Itineraries = () => {
  const { id } = useParams();
  const userId = getUserId();
  const userType = getUserType();
  const userPreferences = userType === "Tourist" ? getUserPreferences() : [];
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
  const [currency, setCurrency] = useState("USD"); // Default currency

  const navigate = useNavigate();
  const languageOptions = ["English", "Spanish", "French", "German", "Arabic", "Russian", "Japanese", "Korean", "Italian"];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(userId);
        setCurrency(response.data.userProfile.currency); // Set user's selected currency
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const fetchData = async () => {
      try {
        let itinerariesResponse;
        if (userType === "Tourist") {
          itinerariesResponse = await getAllActiveAppropriateIteneraries(userId);
        } else {
          itinerariesResponse = await getAllItineraries();
        }

        const tagsResponse = await getAllTags();

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
    fetchUserProfile();
  }, [id, userId]);

  useEffect(() => {
    const filtered = itineraries
      .filter((itinerary) => (searchQuery ? itinerary.name.toLowerCase().includes(searchQuery.toLowerCase()) : true))
      .filter((itinerary) => (selectedTags.length ? itinerary.tags.some((tag) => selectedTags.includes(tag._id)) : true))
      .filter((itinerary) => (selectedLanguages.length ? selectedLanguages.includes(itinerary.language) : true))
      .filter((itinerary) => {
        if (!budget) return true; // If no budget is set, include all itineraries
        const priceInSelectedCurrency = currency === "EGP" ? itinerary.price : itinerary.price * exchangeRates[currency];
        return userType === "Tourist" ? priceInSelectedCurrency <= parseFloat(budget) : itinerary.price <= parseFloat(budget);
      });

    setFilteredItineraries(filtered);

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

  // Get recommended itineraries based on user preferences
  const getRecommendedItineraries = () => {
    return itineraries.filter((itinerary) => itinerary.tags.some((tag) => userPreferences.includes(tag.name)));
  };

  const handleResetFilters = () => {
    setSelectedTags([]);
    setSelectedLanguages([]);
    setBudget("");
    setSearchQuery("");
    setFilteredItineraries(itineraries);
  };

  const handleFlagClick = async (itineraryId, currentInappropriateStatus) => {
    try {
      const newStatus = !currentInappropriateStatus;
      setFilteredItineraries((prevItineraries) => prevItineraries.map((itinerary) => (itinerary._id === itineraryId ? { ...itinerary, inappropriate: newStatus } : itinerary)));

      await markItineraryInappropriate(itineraryId, { inappropriate: newStatus });

      toast.success(newStatus ? "Itinerary marked as inappropriate!" : "Itinerary unmarked as inappropriate!");
    } catch (error) {
      toast.error("Error updating itinerary status!");
    }
  };

  const exchangeRates = {
    USD: 1 / 49, // 1 EGP = 0.0204 USD (1 USD = 49 EGP)
    EUR: 1 / 52, // 1 EGP = 0.0192 EUR (1 EUR = 52 EGP)
    GBP: 1 / 63, // 1 EGP = 0.0159 GBP (1 GBP = 63 EGP)
    AUD: 1 / 32, // 1 EGP = 0.03125 AUD (1 AUD = 32 EGP)
    CAD: 1 / 35, // 1 EGP = 0.02857 CAD (1 CAD = 35 EGP)
    // Add other currencies as needed
  };

  const formatCurrency = (amount) => {
    if (!currency) {
      return amount; // Fallback to amount if currency is not set
    }

    // Ensure amount is a number
    const value = Number(amount);

    // Check user type and apply currency logic
    if (getUserType() !== "Tourist") {
      // If user is not Tourist, format amount in EGP
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
      }).format(value);
    }
    // Convert amount from EGP to chosen currency if currency is EGP
    const convertedAmount = currency === "EGP" ? value : value * exchangeRates[currency];

    // return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency })
    //   .format(convertedAmount);

    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(convertedAmount);

    return formattedAmount.replace(/(\D)(\d)/, "$1 $2");
  };

  const handleToggleBookmark = async (itineraryId, isCurrentlyBookmarked) => {
    try {
      const newStatus = !isCurrentlyBookmarked;

      // Update the UI optimistically
      setItineraries((prevItineraries) => prevItineraries.map((itinerary) => (itinerary._id === itineraryId ? { ...itinerary, isBookmarked: newStatus } : itinerary)));

      // Call the API to toggle the bookmark
      await toggleBookmark({
        userId,
        itemType: "itinerary",
        itemId: itineraryId,
      });

      toast.success(newStatus ? "Itinerary added to bookmarks!" : "Itinerary removed from bookmarks!");
    } catch (error) {
      toast.error("Error toggling bookmark!");
      console.error("Error:", error);
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

  const recommendedItineraries = getRecommendedItineraries();

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
            <Button color="secondary" variant="contained" onClick={() => navigate("/add-itinerary")}>
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
          {filteredItineraries.map((itinerary) => {
            // Check if the itinerary is recommended for tourists
            const isRecommended = userType === "Tourist" && recommendedItineraries.some((recommended) => recommended._id === itinerary._id);

            return (
              <Grid item xs={12} md={6} key={itinerary._id}>
                <Card sx={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {itinerary.name}
                    </Typography>
                    {isRecommended && (
                      <Typography variant="body2" color="secondary" sx={{ mb: 1 }}>
                        Recommended
                      </Typography>
                    )}
                    <Typography>Price: {formatCurrency(itinerary.price)}</Typography>
                    <Typography>
                      <strong>Language:</strong> {itinerary.language}
                    </Typography>
                    <Typography>
                      <strong>Tags:</strong> {itinerary.tags.map((tag) => tag.name).join(", ")}
                    </Typography>

                    <Button
                      component={Link}
                      to={getUserType() === "Tourist" ? `/tourist/itinerary/${itinerary._id}` : `/tour-guide/itinerary/details/${itinerary._id}`}
                      variant="contained"
                      sx={{ mt: 2 }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                  {userType === "Admin" && (
                    <IconButton color={itinerary.inappropriate ? "error" : "primary"} onClick={() => handleFlagClick(itinerary._id, itinerary.inappropriate)}>
                      <FlagIcon />
                    </IconButton>
                  )}

                  {userType === "Tourist" && (
                    <IconButton onClick={() => handleToggleBookmark(itinerary._id, itinerary.isBookmarked)} color="secondary">
                      {itinerary.isBookmarked ? <StarIcon style={{ color: "yellow" }} /> : <StarBorderIcon />}
                    </IconButton>
                  )}
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Itineraries;
