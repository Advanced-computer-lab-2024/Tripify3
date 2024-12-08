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
import DeleteIcon from "@mui/icons-material/Delete";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getAllActivitiesForAdvertiser, getAllCategories } from "../../services/tourist.js";
import { deleteActivity } from "../../services/advertiser.js";
import { Link, useNavigate } from "react-router-dom";
import { getUserId } from "../../utils/authUtils.js";

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

const AdvertiserActivities = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activitiesResponse, categoriesResponse] = await Promise.all([
          getAllActivitiesForAdvertiser(userId),
          getAllCategories(),
        ]);
        
        // Filter out activities where isDeleted is true
        const activeActivities = activitiesResponse.data.filter(
          (activity) => !activity.isDeleted
        );
  
        setActivities(activeActivities);
        setOriginalActivities(activeActivities);
        setCategories(categoriesResponse.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching activities or categories");
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

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

  const handleFilter = () => {
    let filteredActivities = [...originalActivities];

    if (selectedCategories.length > 0) {
      filteredActivities = filteredActivities.filter((activity) =>
        selectedCategories.includes(activity.category)
      );
    }

    if (budget) {
      filteredActivities = filteredActivities.filter(
        (activity) => activity.price <= parseFloat(budget)
      );
    }

    if (searchTerm) {
      filteredActivities = filteredActivities.filter((activity) =>
        activity.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
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

  const handleDeleteActivity = async (activityId) => {
    try {
      await deleteActivity(activityId);
      setActivities((prevActivities) =>
        prevActivities.filter((activity) => activity._id !== activityId)
      );
    } catch (error) {
      setError("Failed to delete activity");
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
        <AppBar position="static" color="primary" sx={{ mb: 4, marginTop: 2 }}>
          <Toolbar sx={{ justifyContent: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>
              My Activities
            </Typography>
          </Toolbar>
        </AppBar>
  
        <Box sx={{ maxWidth: "1200px", margin: "auto" }}>
          {/* Search, Sort, Filter, and Add Activity Button Section */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <TextField
              label="Search by name"
              variant="outlined"
              sx={{ mr: 2, width: "300px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FormControl variant="outlined" sx={{ mr: 2, width: "150px" }}>
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
            <Button variant="contained" onClick={handleSortByPrice} sx={{ mr: 2 }}>
              Sort
            </Button>
  
            {/* Add Activity Button */}
            <Button
              variant="contained"
              onClick={() => navigate(`/advertiser/my-activities/add`)}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                ml: 3, // Offset the button slightly to the right
                "&:hover": { bgcolor: "green" },
              }}
            >
              Add Activity
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
                      <Chip
                        key={value}
                        label={categories.find((cat) => cat._id === value)?.name || value}
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
              sx={{ width: "150px", mr: 2 }}
            />
  
            <Button variant="contained" onClick={handleFilter} sx={{ mr: 2 }}>
              Filter
            </Button>
  
            <Button variant="contained" color="secondary" onClick={handleResetFilters} sx={{ ml: 2 }}>
              Reset Filters
            </Button>
          </Box>
  
          {/* Activities Section */}
          <Typography variant="h5" sx={{ marginTop: 4, fontWeight: "bold", color: "#1e3a5f" }}>
            Your Activities
          </Typography>
          <Grid container spacing={3}>
            {activities.map((activity) => (
              <Grid item xs={12} sm={6} md={4} key={activity._id}>
                <Card sx={{ display: "flex", justifyContent: "space-between", position: "relative", padding: 2 }}>
                  {/* Delete Button positioned absolutely */}
                  <Button
                    variant="contained"
                    onClick={() => handleDeleteActivity(activity._id)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "white",
                      color: "white",
                      minWidth: 0,
                      padding: 0,
                      fontSize: '24px', // Adjust the emoji size
                      '&:hover': { backgroundColor: "#d32f2f" }, // Darker red on hover
                    }}
                  >
                       <DeleteIcon sx={{ color: "red" }} />
                  </Button>
  
                  <CardContent>
                    <Typography variant="h6" color="secondary">
                    📍 {activity.name}
                    </Typography>
                    <Typography>
                      <strong>💵 </strong> {activity.price} EGP
                    </Typography>
                    <Typography>
                    🚩 {activity.category.name}
                    </Typography>
                    <Typography>🔖 {activity.tags.map((tag) => tag.name).join(", ")}</Typography>
                    <Typography>
                      <strong>📅</strong> {new Date(activity.date).toLocaleDateString()}
                    </Typography>
  
                    <Button
                      component={Link}
                      to={`/advertiser/my-activities/details/${activity._id}`}
                      variant="contained"
                      sx={{ mt: 2, backgroundColor: "#ff6f00", color: "#ffffff", "&:hover": { backgroundColor: "#e65c00" } }}
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

export default AdvertiserActivities;
