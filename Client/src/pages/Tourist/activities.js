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
} from "@mui/material";


import {  getUserProfile } from "../../services/tourist";
import { getUserId } from "../../utils/authUtils";
import { useParams, useNavigate } from "react-router-dom";////////////////////////


import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getAllActivities, getAllCategories } from "../../services/tourist.js";
import { Link } from "react-router-dom";
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

import { getUserType } from "../../utils/authUtils";

const Activities = () => {
  const userType = getUserType();
  const { id } = useParams();/////////
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
  useEffect( () => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(userId);
        setCurrency(response.data.userProfile.currency); // Set user's selected currency
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
    const fetchData = async () => {
      try {
        const [activitiesResponse, categoriesResponse] = await Promise.all([getAllActivities(), getAllCategories()]);
        setActivities(activitiesResponse.data);
        setOriginalActivities(activitiesResponse.data);
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
    USD: 0.02, // 1 EGP = 0.05 USD
    EUR: 0.07, // 1 EGP = 0.045 EUR
    GBP: 0.038, // 1 EGP = 0.038 GBP
    AUD: 0.07, // 1 EGP = 0.07 AUD
    CAD: 0.065, // 1 EGP = 0.065 CAD
    // Add other currencies as needed
  };
  
  const formatCurrency = (amount) => {
    if (!currency) {
      return amount; // Fallback to amount if currency is not set
    }
  
    // Ensure amount is a number
    const value = Number(amount);
  
    // Convert amount from EGP to chosen currency if currency is EGP
    const convertedAmount = (currency === "EGP") ? value : value * ( exchangeRates[currency]);
  
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency })
      .format(convertedAmount);
  };

  // Filter activities based on selected categories, budget, and search term
  const handleFilter = () => {
    let filteredActivities = [...originalActivities];

    if (selectedCategories.length > 0) {
      filteredActivities = filteredActivities.filter((activity) => selectedCategories.includes(activity.category));
    }

    if (budget) {
      filteredActivities = filteredActivities.filter((activity) => activity.price <= parseFloat(budget));
    }

    if (searchTerm) {
      filteredActivities = filteredActivities.filter((activity) => activity.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    setActivities(filteredActivities);
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
        <Grid container spacing={3}>
          {activities.map((activity) => (
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
    </ThemeProvider>
  );
};

export default Activities;
