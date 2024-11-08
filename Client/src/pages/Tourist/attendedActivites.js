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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getAllActivitiesAttended, getAllCategories } from "../../services/tourist.js";
import { Link } from 'react-router-dom';
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

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [originalActivities, setOriginalActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [budget, setBudget] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  

  // Fetch activities and categories when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getUserId();
        const [activitiesResponse, categoriesResponse] = await Promise.all([
          getAllActivitiesAttended(userId),
          getAllCategories(),
        ]);
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
  }, []);

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

  // Filter activities based on selected categories, budget, and search term
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
            Attended Activities
          </Typography>
        </Toolbar>
      </AppBar>

     

        {/* Activities Section */}
        <Grid container spacing={3}>
          {activities.length>0&&activities.map((activity) => (
            <Grid item xs={12} key={activity._id}>
              <Card sx={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                <CardContent>
                  <Typography variant="h6" color="secondary">
                    {activity.name}
                  </Typography>
                  <Typography>
                    <strong>Price:</strong> ${activity.price}
                  </Typography>
                  <Typography>
                    <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
                  </Typography>
               
                  <Button
                    component={Link}
                    to={`/tourist/activity/${activity._id}`}
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
  View Details
</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
    </ThemeProvider>
  );
};

export default Activities;
