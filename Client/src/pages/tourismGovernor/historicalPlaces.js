import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  CircularProgress,
  Checkbox,
  OutlinedInput,
  Box,
  ListItemText,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { Link } from 'react-router-dom';
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

import { getUserId, getUserType } from "../../utils/authUtils";

const GovernorHistoricalPlaces = () => {
  const userId = getUserId();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const placeTypes = [
    "Monument",
    "Religious Site",
    "Palace",
    "Castle",
    "Historical Place",
    "Museum",
  ];

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/governor/get/places/${userId}`);
        setPlaces(response.data.places);
        setFilteredPlaces(response.data.places); // Initialize with all places
        setLoading(false);
      } catch (err) {
        setError("Error fetching places data");
        setLoading(false);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:8000/tag/get");
        setTags(response.data.tags);
      } catch (err) {
        setError("Error fetching tags");
      }
    };

    fetchPlaces();
    fetchTags();
  }, []);

  // Filter places based on search term
  useEffect(() => {
    const filtered = places.filter((place) =>
      place.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlaces(filtered);
  }, [searchTerm, places]);

  const handleTagChange = (event) => {
    setSelectedTags(event.target.value);
  };

  // Filter function now runs on the frontend
  const handleFilter = () => {
    let filtered = [...places];

    // Filter by tags if any tag is selected
    if (selectedTags.length > 0) {
      filtered = filtered.filter((place) =>
        selectedTags.every((tag) => place.tags.includes(tag))
      );
    }

    // Filter by type if selected
    if (selectedType) {
      filtered = filtered.filter((place) => place.type === selectedType);
    }

    setFilteredPlaces(filtered);
  };

  const handleReset = () => {
    setSelectedType("");
    setSelectedTags([]);
    setSearchTerm("");
    setFilteredPlaces(places); // Reset to all places
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{ color: theme.palette.primary.main , marginTop: 8 }}
        >
          Historical Places
        </Typography>

        {/* Search and Filter Section */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
          <TextField
            label="Search by Name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 2, width: "300px" }}
          />

          <FormControl variant="outlined" sx={{ mr: 2, width: "200px" }}>
            <InputLabel>Type of Place</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              label="Type of Place"
            >
              <MenuItem value="">
                <em>Select Type</em>
              </MenuItem>
              {placeTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ width: "200px" }}>
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={selectedTags}
              onChange={handleTagChange}
              input={<OutlinedInput label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={tags.find((tag) => tag._id === value)?.name || value}
                    />
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
        </Box>

        <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFilter}
            sx={{ mr: 2 }}
          >
            Apply Filter
          </Button>
          <Button variant="contained" color="secondary" onClick={handleReset}>
            Reset Filters
          </Button>
        </Box>

        {/* Places Display Section */}
        <Grid container spacing={3}>
          {filteredPlaces.map((place) => (
            <Grid item xs={12} md={6} key={place._id}>
              <Card sx={{ display: "flex", justifyContent: "space-between" }}>
                <CardContent>
                  <Typography variant="h6" color="secondary">
                    {place.name}
                  </Typography>
                  <Typography>
                    <strong>Type:</strong> {place.type}
                  </Typography>
                  <Typography>
                    <strong>Description:</strong> {place.description}
                  </Typography>
                    <Button
                        component={Link}
                        to={`/tourism-governor/historical-places/details/${place.tourismGovernor}`}
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
      </Container>
    </ThemeProvider>
  );
};

export default GovernorHistoricalPlaces;
