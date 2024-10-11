import React, { useState, useEffect } from "react";
import {
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
import { getAllIteneraries, getAllTags } from "../../services/tourist.js"; // Updated API functions

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

  const languageOptions = [
    "English",
    "Spanish",
    "French",
    "German",
    "Arabic",
    "Russian",
    "Japanese",
    "Korean",
    "Italian",
  ];

  // Fetch itineraries and tags when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itinerariesResponse, tagsResponse] = await Promise.all([
          getAllIteneraries(),
          getAllTags(),
        ]);
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
      <Box sx={{ p: 4 }}>
        <Typography variant="h3" align="center" color="primary" gutterBottom>
          Upcoming Itineraries
        </Typography>

        {/* Search, Sort, and Filter Section */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <TextField
            label="Search by name"
            variant="outlined"
            sx={{ mr: 2, width: "300px" }}
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
          <Button variant="outlined" onClick={handleResetFilters}>
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
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => console.log(`Navigate to itinerary ${itinerary._id}`)}
                  >
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
