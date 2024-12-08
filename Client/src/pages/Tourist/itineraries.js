import React, { useState, useEffect } from "react";
import Bookmark from "@mui/icons-material/Bookmark";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
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
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserId, getUserType, getUserPreferences } from "../../utils/authUtils";
import { getUserProfile } from "../../services/tourist";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toggleBookmark, getAllItineraries, getAllActiveAppropriateIteneraries, getAllTags } from "../../services/tourist.js";
import FlagIcon from "@mui/icons-material/Flag";
import { toast } from "react-toastify";
import { markItineraryInappropriate } from "../../services/admin.js";
import { styled } from "@mui/material/styles";

// Theme for Material-UI
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

// Styled components for better card design
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "relative",
  padding: theme.spacing(3),
  borderRadius: "12px",
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
  },
  background: theme.palette.background.paper,
}));

const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const SearchBarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  justifyContent: "center",
  alignItems: "center",
}));

const FiltersContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  justifyContent: "center",
  alignItems: "center",
}));

const ItinerariesContainer = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  gap: theme.spacing(3),
}));

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
  const [currency, setCurrency] = useState("USD");

  const navigate = useNavigate();
  const languageOptions = ["English", "Spanish", "French", "German", "Arabic", "Russian", "Japanese", "Korean", "Italian"];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(userId);
        setCurrency(response.data.userProfile.currency);
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
        if (!budget) return true;
        const priceInSelectedCurrency = currency === "EGP" ? itinerary.price : itinerary.price * exchangeRates[currency];
        return userType === "Tourist" ? priceInSelectedCurrency <= parseFloat(budget) : itinerary.price <= parseFloat(budget);
      });

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

  const exchangeRates = {
    USD: 1 / 49,
    EUR: 1 / 52,
    // Add other currencies as needed
  };

  const formatCurrency = (amount) => {
    if (!currency) return amount; 
    const value = Number(amount);
    if (getUserType() !== "Tourist") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
      }).format(value);
    }
    const convertedAmount = currency === "EGP" ? value : value * exchangeRates[currency];
    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(convertedAmount);
    return formattedAmount.replace(/(\D)(\d)/, "$1 $2");
  };

  const getRecommendedItineraries = () => {
    // Filter itineraries based on user preferences (tags)
    return itineraries.filter((itinerary) => itinerary.tags.some((tag) => userPreferences.includes(tag.name)));
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

  const handleToggleBookmark = async (itineraryId, isCurrentlyBookmarked) => {
    try {
      const newStatus = !isCurrentlyBookmarked;

      setItineraries((prevItineraries) => prevItineraries.map((itinerary) => (itinerary._id === itineraryId ? { ...itinerary, isBookmarked: newStatus } : itinerary)));

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
      <Box sx={{ background: "linear-gradient(to bottom, #f5f7fa, #c3cfe2)", minHeight: "100vh", padding: 4 }}>
        <AppBar position="static" color="primary" sx={{ mb: 4 }}>
          <Toolbar sx={{ justifyContent: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#fff" }}>
              Upcoming Itineraries
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ maxWidth: "1200px", margin: "auto" }}>
          <SearchBarContainer>
            <TextField
              label="Search by name"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flexGrow: 1, minWidth: "250px" }}
            />
            <FormControl variant="outlined" sx={{ minWidth: "200px" }}>
              <InputLabel>Sort by Price</InputLabel>
              <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} label="Sort by Price">
                <MenuItem value="asc">Low to High</MenuItem>
                <MenuItem value="desc">High to Low</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleSortByPrice} sx={{ px: 4, backgroundColor: "#ff6f00", color: "#ffffff" }}>
              Sort
            </Button>
          </SearchBarContainer>

          <FiltersContainer>
            <FormControl variant="outlined" sx={{ minWidth: "200px" }}>
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
            <TextField label="Budget" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} variant="outlined" sx={{ minWidth: "150px" }} />
            <Button variant="contained" color="secondary" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </FiltersContainer>

          {/* Recommended Itineraries Section - Display only for Tourist */}
          {userType === "Tourist" && (
            <>
              <Typography variant="h5" sx={{ marginTop: 4, fontWeight: "bold", color: "#1e3a5f" }}>
                Recommended Itineraries
              </Typography>
              <ItinerariesContainer container>
                {recommendedItineraries.length > 0 ? (
                  recommendedItineraries.map((itinerary) => (
                    <Grid item xs={12} sm={6} md={4} key={itinerary._id}>
                      <StyledCard>
                        <StyledCardContent>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            📍 {itinerary.name}
                          </Typography>
                          <Typography>💵 {formatCurrency(itinerary.price)}</Typography>
                          <Typography>
                            <strong>🈸 </strong> {itinerary.language}
                          </Typography>
                          <Typography>
                            <strong>🔖 </strong> {itinerary.tags.map((tag) => tag.name).join(", ")}
                          </Typography>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <Button
                              component={Link}
                              to={`/tourist/itinerary/${itinerary._id}`}
                              variant="contained"
                              sx={{ backgroundColor: "#ff6f00", color: "#ffffff", padding: "12px 20px" }}
                            >
                              View Details
                            </Button>
                            {userType === "Tourist" && (
                              <IconButton
                                onClick={() => handleToggleBookmark(itinerary._id, itinerary.isBookmarked)}
                                color="inherit"
                              >
                                {itinerary.isBookmarked ? <Bookmark style={{ color: "black" }} /> : <BookmarkBorder style={{ color: "black" }} />}
                              </IconButton>
                            )}
                          </Box>
                        </StyledCardContent>
                      </StyledCard>
                    </Grid>
                  ))
                ) : (
                  <Typography>No recommended itineraries found based on your preferences.</Typography>
                )}
              </ItinerariesContainer>
            </>
          )}

          <Typography variant="h5" sx={{ marginTop: 4, fontWeight: "bold", color: "#1e3a5f" }}>
            All Itineraries
          </Typography>
          <ItinerariesContainer container>
            {filteredItineraries.map((itinerary) => (
              <Grid item xs={12} sm={6} md={4} key={itinerary._id}>
                <StyledCard>
                  <StyledCardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      📍 {itinerary.name}
                    </Typography>
                    <Typography>💵 {formatCurrency(itinerary.price)}</Typography>
                    <Typography>
                      <strong>🈸 </strong> {itinerary.language}
                    </Typography>
                    <Typography>
                      <strong>🔖 </strong> {itinerary.tags.map((tag) => tag.name).join(", ")}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                      <Button
                        component={Link}
                        to={`/tourist/itinerary/${itinerary._id}`}
                        variant="contained"
                        sx={{ backgroundColor: "#ff6f00", color: "#ffffff", padding: "12px 20px" }}
                      >
                        View Details
                      </Button>
                      {userType === "Tourist" && (
                        <IconButton
                          onClick={() => handleToggleBookmark(itinerary._id, itinerary.isBookmarked)}
                          color="inherit"
                        >
                          {itinerary.isBookmarked ? <Bookmark style={{ color: "black" }} /> : <BookmarkBorder style={{ color: "black" }} />}
                        </IconButton>
                      )}
                      {userType === "Admin" && (
                        <IconButton color={itinerary.inappropriate ? "error" : "default"} onClick={() => handleFlagClick(itinerary._id, itinerary.inappropriate)}>
                          <FlagIcon />
                        </IconButton>
                      )}
                    </Box>
                  </StyledCardContent>
                </StyledCard>
              </Grid>
            ))}
          </ItinerariesContainer>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Itineraries;