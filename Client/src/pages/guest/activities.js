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
  IconButton,
} from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import { toast } from "react-toastify";
import { getUserProfile } from "../../services/tourist";
import { getUserId, getUserType, getUserPreferences } from "../../utils/authUtils";
import { useParams, useNavigate } from "react-router-dom"; ////////////////////////

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getAllActivities, getAllCategories, getAllActivitiesForTourist, getAllActivitiesForGuest } from "../../services/tourist.js";
import { Link } from "react-router-dom";

import { markActivityInappropriate } from "../../services/admin.js";

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

const GuestActivities = () => {
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

  // Fetch activities and categories when the component mounts
  useEffect(() => {

    const fetchData = async () => {
      try {
        const fetchActivities =  userType === "Guest" ? getAllActivitiesForGuest : getAllActivities;
        const [activitiesResponse, categoriesResponse] = await Promise.all([fetchActivities(), getAllCategories()]);
        setActivities(activitiesResponse.data.activities);
        setOriginalActivities(activitiesResponse.data.activities);

        setCategories(categoriesResponse.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching activities or categories");
        setLoading(false);
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
    USD: 1 / 49, // 1 EGP = 0.0204 USD (1 USD = 49 EGP)
    EUR: 1 / 52, // 1 EGP = 0.0192 EUR (1 EUR = 52 EGP)
    GBP: 1 / 63, // 1 EGP = 0.0159 GBP (1 GBP = 63 EGP)
    AUD: 1 / 32, // 1 EGP = 0.03125 AUD (1 AUD = 32 EGP)
    CAD: 1 / 35, // 1 EGP = 0.02857 CAD (1 CAD = 35 EGP)
    // Add other currencies as needed
  };

  const handleFlagClick = async (activityId, currentInappropriateStatus) => {
    try {
      const newStatus = !currentInappropriateStatus;
      // Update the specific activity's inappropriate status in the activities list
      setActivities((prevActivities) => prevActivities.map((activity) => (activity._id === activityId ? { ...activity, inappropriate: newStatus } : activity)));

      await markActivityInappropriate(activityId, { inappropriate: newStatus });

      toast.success(newStatus ? "Activity marked as inappropriate!" : "Activity unmarked as inappropriate!");
    } catch (error) {
      toast.error("Error updating itinerary status!");
    }
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

    // return new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(convertedAmount);

    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(convertedAmount);

    return formattedAmount.replace(/(\D)(\d)/, "$1 $2");
  };

  // Filter activities based on selected categories, budget, and search term
  const handleFilter = () => {
    let filteredActivities = [...originalActivities];
    console.log("filtered activities", filteredActivities);

    console.log("selected categories", selectedCategories);

    if (selectedCategories.length > 0) {
      filteredActivities = filteredActivities.filter((activity) => selectedCategories.includes(activity.category._id));
    }

    if (budget) {
      if (userType === "Tourist") {
        filteredActivities = filteredActivities.filter((activity) => (currency === "EGP" ? activity.price : activity.price * exchangeRates[currency]) <= parseFloat(budget));
      } else {
        filteredActivities = filteredActivities.filter((activity) => activity.price <= parseFloat(budget));
      }
    }

    if (searchTerm) {
      filteredActivities = filteredActivities.filter((activity) => activity.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    setActivities(filteredActivities);
    console.log("after setting", activities);
  };

  // Automatically filter when search term, selected categories, or budget changes
  useEffect(() => {
    handleFilter();
  }, [searchTerm, selectedCategories, budget]);

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setBudget("");
    setSearchTerm(""); // Reset search term
    setActivities(originalActivities);
  };

  // Sort activities to prioritize recommended ones based on user preferences
  // Updated getRecommendedActivities function
  const getRecommendedActivities = () => {
    if (userType === "Tourist") {
      const recommendedActivities = activities.filter((activity) => activity.tags.some((tag) => userPreferences.includes(tag.name)));
      const otherActivities = activities.filter((activity) => !activity.tags.some((tag) => userPreferences.includes(tag.name)));

      return [...recommendedActivities, ...otherActivities];
    }

    // For non-tourists, return all activities
    return activities;
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
            Upcoming Activities
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4 }}>
        {/* Search, Sort, and Filter Section */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <TextField
            label="Search by name"
            variant="outlined"
            sx={{ mr: 2, width: "300px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on change
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

        {/* Filters Section */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
          <FormControl variant="outlined" sx={{ mr: 2, width: "200px" }}>
            <InputLabel>Categories</InputLabel>
            <Select
              multiple
              value={selectedCategories}
              onChange={handleCategoryChange}
              input={<OutlinedInput label="Categories" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={categories.find((cat) => cat._id === value)?.name || value} />
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

          <TextField label="Budget" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} variant="outlined" sx={{ width: "150px", mr: 2 }} />

          <Button variant="contained" onClick={handleFilter} sx={{ mr: 2 }}>
            Filter
          </Button>

          <Button variant="contained" color="secondary" onClick={handleResetFilters} sx={{ ml: 2 }}>
            Reset Filters
          </Button>
        </Box>

        {/* Activities Section */}
        {userType === "Tourist" ? (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }} color="secondary">
                Recommended Activities
              </Typography>
              <Grid container spacing={3}>
                {getRecommendedActivities()
                  .filter((activity) => activity.tags.some((tag) => userPreferences.includes(tag.name)))
                  .map((activity) => (
                    <Grid item xs={12} key={activity._id}>
                      <Card sx={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                        <CardContent>
                          <Typography variant="h6" color="secondary">
                            {activity.name} {<Chip label="Recommended" color="secondary" sx={{ ml: 1 }} />}
                          </Typography>
                          <Typography>
                            <strong>Price:</strong> {formatCurrency(activity.price)}
                          </Typography>

                          <Typography>
                            <strong>Category:</strong> {activity.category.name}
                          </Typography>
                          <Typography>
                            <strong>Tags:</strong> {activity.tags.map((tag) => tag.name).join(", ")}
                          </Typography>
                          <Typography>
                            <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
                          </Typography>

                          <Button component={Link} to={`/activity/${activity._id}`} variant="contained" sx={{ mt: 2 }}>
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }} color="secondary">
                All Activities
              </Typography>
              <Grid container spacing={3}>
                {getRecommendedActivities().map((activity) => (
                  <Grid item xs={12} key={activity._id}>
                    <Card sx={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                      <CardContent>
                        <Typography variant="h6" color="secondary">
                          {activity.name}
                        </Typography>
                        <Typography>
                          <strong>Price:</strong> {formatCurrency(activity.price)}
                        </Typography>

                        <Typography>
                          <strong>Category:</strong> {activity.category.name}
                        </Typography>
                        <Typography>
                          <strong>Tags:</strong> {activity.tags.map((tag) => tag.name).join(", ")}
                        </Typography>
                        <Typography>
                          <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
                        </Typography>

                        <Button component={Link} to={`/activity/${activity._id}`} variant="contained" sx={{ mt: 2 }}>
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        ) : (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }} color="secondary">
              All Activities
            </Typography>
            <Grid container spacing={3}>
              {getRecommendedActivities().map((activity) => (
                <Grid item xs={12} key={activity._id}>
                  <Card sx={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                    <CardContent>
                      <Typography variant="h6" color="secondary">
                        {activity.name}
                      </Typography>
                      <Typography>
                        <strong>Price:</strong> {formatCurrency(activity.price)}
                      </Typography>

                      <Typography>
                        <strong>Category:</strong> {activity.category.name}
                      </Typography>
                      <Typography>
                        <strong>Tags:</strong> {activity.tags.map((tag) => tag.name).join(", ")}
                      </Typography>
                      <Typography>
                        <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
                      </Typography>

                      <Button component={Link} to={`/activity/${activity._id}`} variant="contained" sx={{ mt: 2 }}>
                        View Details
                      </Button>
                    </CardContent>
                    {userType === "Admin" && (
                      <IconButton color={activity.inappropriate ? "error" : "default"} onClick={() => handleFlagClick(activity._id, activity.inappropriate)}>
                        <FlagIcon />
                      </IconButton>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default GuestActivities;
