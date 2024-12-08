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
import FlagIcon from "@mui/icons-material/Flag";
import { toast } from "react-toastify";
import { getUserProfile } from "../../services/tourist";
import { getUserId, getUserType, getUserPreferences } from "../../utils/authUtils";
import { useParams, Link } from "react-router-dom";
import Bookmark from "@mui/icons-material/Bookmark"; 
import BookmarkBorder from "@mui/icons-material/BookmarkBorder"; 
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toggleBookmark, getAllActivities, getAllCategories, getAllActivitiesForTourist } from "../../services/tourist.js";
import { markActivityInappropriate } from "../../services/admin.js";
import { styled } from "@mui/material/styles";

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

const ActivitiesContainer = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  gap: theme.spacing(3),
}));

const ActivityTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: "bold",
  color: theme.palette.primary.main,
}));

const PriceTag = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.secondary.main,
  fontWeight: "600",
}));

const Activities = () => {
  const userType = getUserType();
  let userPreferences;
  if (userType === "Tourist") {
    userPreferences = getUserPreferences();
  }
  const { id } = useParams();
  const userId = getUserId();
  const [activities, setActivities] = useState([]);
  const [originalActivities, setOriginalActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [budget, setBudget] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(userId);
        setCurrency(response.data.userProfile.currency); 
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
    const fetchData = async () => {
      try {
        const fetchActivities = userType === "Tourist" ? () => getAllActivitiesForTourist(userId) : getAllActivities;
        const [activitiesResponse, categoriesResponse] = await Promise.all([fetchActivities(), getAllCategories()]);
        setActivities(activitiesResponse.data.activities);
        setOriginalActivities(activitiesResponse.data.activities);
        setCategories(categoriesResponse.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching activities or categories");
        setLoading(false);
        console.log(error);
      }
    };

    fetchData();
  }, [id, userId]);

  const handleCategoryChange = (event) => {
    setSelectedCategories(event.target.value);
  };

  const handleSortByPrice = () => {
    const sortedActivities = [...activities].sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });
    setActivities(sortedActivities);
  };

  const exchangeRates = {
    USD: 1 / 49,
    EUR: 1 / 52,
    GBP: 1 / 63,
    AUD: 1 / 32,
    CAD: 1 / 35,
  };

  const handleFlagClick = async (activityId, currentInappropriateStatus) => {
    try {
      const newStatus = !currentInappropriateStatus;
      setActivities((prevActivities) => prevActivities.map((activity) => (activity._id === activityId ? { ...activity, inappropriate: newStatus } : activity)));
      await markActivityInappropriate(activityId, { inappropriate: newStatus });
      toast.success(newStatus ? "Activity marked as inappropriate!" : "Activity unmarked as inappropriate!");
    } catch (error) {
      toast.error("Error updating itinerary status!");
    }
  };

  const formatCurrency = (amount) => {
    if (!currency) {
      return amount; 
    }
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

  const getRecommendedActivities = () => {
    if (userType === "Tourist") {
      const recommendedActivities = activities.filter((activity) => activity.tags.some((tag) => userPreferences.includes(tag.name)));
      const otherActivities = activities.filter((activity) => !activity.tags.some((tag) => userPreferences.includes(tag.name)));
      return [...recommendedActivities];
    }
    return activities;
  };

  const handleFilter = () => {
    let filteredActivities = [...originalActivities];

    if (selectedCategories.length > 0) {
      filteredActivities = filteredActivities.filter((activity) => selectedCategories.includes(activity.category._id));
    }

    if (budget) {
      if (userType === "Tourist") {
        filteredActivities = filteredActivities.filter((activity) => (currency === "EGP" ? activity.price <= parseFloat(budget) : activity.price * exchangeRates[currency] <= parseFloat(budget)));
      } else {
        filteredActivities = filteredActivities.filter((activity) => activity.price <= parseFloat(budget));
      }
    }

    if (searchTerm) {
      filteredActivities = filteredActivities.filter((activity) => activity.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    setActivities(filteredActivities);
  };

  useEffect(() => {
    handleFilter();
  }, [searchTerm, selectedCategories, budget]);

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setBudget("");
    setSearchTerm("");
    setActivities(originalActivities);
  };

  const handleToggleBookmark = async (activityId, isCurrentlyBookmarked) => {
    try {
      const newStatus = !isCurrentlyBookmarked;
      setActivities((prevActivities) => prevActivities.map((activity) => (activity._id === activityId ? { ...activity, isBookmarked: newStatus } : activity)));
      await toggleBookmark({
        userId,
        itemType: "activity",
        itemId: activityId,
      });
      toast.success(newStatus ? "Activity added to bookmarks!" : "Activity removed from bookmarks!");
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

  const recommendedActivities = getRecommendedActivities(); // Fetch recommended activities

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
              Explore Activities
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ maxWidth: "1200px", margin: "auto" }}>
          <SearchBarContainer>
            <TextField
              label="Search by name"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1, minWidth: "250px" }}
            />
            <FormControl variant="outlined" sx={{ minWidth: "200px" }}>
              <InputLabel>Sort by Price</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                label="Sort by Price"
              >
                <MenuItem value="asc">Low to High</MenuItem>
                <MenuItem value="desc">High to Low</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleSortByPrice} sx={{ px: 4 }}>
              Sort
            </Button>
          </SearchBarContainer>

          <FiltersContainer>
            <FormControl variant="outlined" sx={{ minWidth: "200px" }}>
              <InputLabel>Categories</InputLabel>
              <Select
                multiple
                value={selectedCategories}
                onChange={handleCategoryChange}
                input={<OutlinedInput label="Categories" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={
                          categories.find((cat) => cat._id === value)?.name || value
                        }
                        sx={{ backgroundColor: "#e0f7fa", color: "#006064" }}
                      />
                    ))}
                  </Box>
                )}
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    <Checkbox checked={selectedCategories.indexOf(category._id) > -1} />
                    <ListItemText primary={category.name} />
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
              sx={{ minWidth: "150px" }}
            />
            <Button variant="contained" onClick={handleFilter}>
              Filter
            </Button>
            <Button variant="contained" color="secondary" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </FiltersContainer>

          {/* Recommended Activities Section - Display only for Tourist */}
          {userType === "Tourist" && (
            <>
              <Typography variant="h5" sx={{ marginTop: 4, fontWeight: "bold", color: "#1e3a5f" }}>
                Recommended Activities
              </Typography>
              <ActivitiesContainer container>
                {recommendedActivities.length > 0
                  ? recommendedActivities.map((activity) => (
                      <Grid item xs={12} sm={6} md={4} key={activity._id}>
                        <StyledCard>
                          <StyledCardContent>
                            <ActivityTitle>📍 {activity.name}</ActivityTitle>
                            <PriceTag>💵 {formatCurrency(activity.price)}</PriceTag>
                            <Typography>🚩 {activity.category.name}</Typography>
                            <Typography>🔖 {activity.tags.map((tag) => tag.name).join(", ")}</Typography>
                            <Typography>📅 {new Date(activity.date).toLocaleDateString()}</Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                              <Button
                                component={Link} to={`/activity/${activity._id}`}
                                variant="contained"
                                sx={{
                                  backgroundColor: "#ff6f00",
                                  color: "#ffffff",
                                  padding: "12px 20px",
                                  borderRadius: "8px",
                                  fontSize: "1rem",
                                  "&:hover": { backgroundColor: "#e65c00" }
                                }}
                              >
                                View Details
                              </Button>
                              <IconButton onClick={() => handleToggleBookmark(activity._id, activity.isBookmarked)} color="inherit">
                                {activity.isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                              </IconButton>
                              {userType === "Admin" && (
                                <IconButton color={activity.inappropriate ? "error" : "default"} onClick={() => handleFlagClick(activity._id, activity.inappropriate)}>
                                  <FlagIcon />
                                </IconButton>
                              )}
                            </Box>
                          </StyledCardContent>
                        </StyledCard>
                      </Grid>
                    )) : (
                    <Typography>No recommended activities found based on your preferences.</Typography>
                  )}
              </ActivitiesContainer>
            </>
          )}

          {/* All Activities Section */}
          <Typography variant="h5" sx={{ marginTop: 4, fontWeight: "bold", color: "#1e3a5f" }}>
            All Activities
          </Typography>
          <ActivitiesContainer container>
            {activities.map((activity) => (
              <Grid item xs={12} sm={6} md={4} key={activity._id}>
                <StyledCard>
                  <StyledCardContent>
                    <ActivityTitle>📍 {activity.name}</ActivityTitle>
                    <PriceTag>💵 {formatCurrency(activity.price)}</PriceTag>
                    <Typography>🚩 {activity.category.name}</Typography>
                    <Typography>🔖 {activity.tags.map((tag) => tag.name).join(", ")}</Typography>
                    <Typography>📅 {new Date(activity.date).toLocaleDateString()}</Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                      <Button
                        component={Link} to={`/activity/${activity._id}`}
                        variant="contained"
                        sx={{
                          backgroundColor: "#ff6f00",
                          color: "#ffffff",
                          padding: "12px 20px",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          "&:hover": { backgroundColor: "#e65c00" }
                        }}
                      >
                        View Details
                      </Button>
                      {userType === "Tourist" && (
                        <IconButton onClick={() => handleToggleBookmark(activity._id, activity.isBookmarked)} color="inherit">
                          {activity.isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                        </IconButton>
                      )}
                      {userType === "Admin" && (
                        <IconButton color={activity.inappropriate ? "error" : "default"} onClick={() => handleFlagClick(activity._id, activity.inappropriate)}>
                          <FlagIcon />
                        </IconButton>
                      )}
                    </Box>
                  </StyledCardContent>
                </StyledCard>
              </Grid>
            ))}
          </ActivitiesContainer>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Activities;