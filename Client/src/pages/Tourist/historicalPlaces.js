import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
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
  CardActions
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { Link } from "react-router-dom";
import { getUserId, getUserType } from "../../utils/authUtils";
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

const HistoricalPlaces = () => {
  const userType = getUserType();
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
        let response;

        if (userType === "Tourism Governor") {
          response = await axios.get(`http://localhost:8000/places/get`);
          setPlaces(response.data.places);
          setFilteredPlaces(response.data.places); // Initialize with all places
        } else {
          response = await axios.get("http://localhost:8000/places/get");
          setPlaces(response.data.places);
          setFilteredPlaces(response.data.places); // Initialize with all places
        }

        console.log(response.data);

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

  // Filter function to display places that match any selected tag based on tag _id
  const handleFilter = () => {
    let filtered = [...places];

    // Filter by tags if any tag is selected
    if (selectedTags.length > 0) {
      filtered = filtered.filter((place) =>
        place.tags.some((tag) => selectedTags.includes(tag._id))
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
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <AppBar position="static" color="primary" sx={{ mb: 4, marginTop: 1 }}>
          <Toolbar sx={{ justifyContent: "center" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              Historical Places
            </Typography>
          </Toolbar>
        </AppBar>
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
                      label={
                        tags.find((tag) => tag._id === value)?.name || value
                      }
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
          {/* {userType === "Tourism Governor" && (
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/tourism-governor/historical-places/add"
              sx={{ ml: "auto" }}
            >
              Add Place
            </Button>
          )} */}
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
    <Grid item xs={12} sm={6} key={place._id}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: 2,
          boxShadow: 4,
          padding: 2,
          backgroundColor: "#F7F9FC",
        }}
      >
        <CardContent>
          {/* Centered Name */}
          <Typography
            variant="h5"
            color="#2D3748"
            gutterBottom
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            📍 {place.name}
          </Typography>

          <Grid container spacing={2}>
            {/* Type */}
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ color: "#4A5568" }}>
                🏷️ <strong>Type:</strong> {place.type}
              </Typography>
            </Grid>

            {/* Tags */}
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ color: "#4A5568" }}>
                🔖 <strong>Tags:</strong> {place.tags.map((tag) => tag.name).join(", ")}
              </Typography>
            </Grid>

            {/* Opening Hours Across Two Columns */}
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ color: "#4A5568", mt: 2 }}>
                🕒 <strong>Opening Hours:</strong>
              </Typography>
            </Grid>
           
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ color: "#4A5568", mt: 2  }}>
              <Box sx={{ mt: 1 }}>
                {place.openingHours.map((hours, index) => (
                  <Typography key={index} variant="body1" sx={{ color: "#718096" }}>
                    {hours.from} - {hours.to}
                  </Typography>
                ))}
              </Box>
              </Typography>
            </Grid>

          </Grid>
        </CardContent>

        <CardActions sx={{ justifyContent: "center", paddingTop: 0 }}>
          <Button
            component={Link}
            to={`/historical-places/${place._id}`}
            variant="contained"
            color="primary"
            sx={{
              fontSize: "1rem",
              fontWeight: "bold",
              padding: "8px 16px",
              borderRadius: 2,
            }}
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    </Grid>
  ))}
</Grid>


      </Container>
    </ThemeProvider>
  );
};

export default HistoricalPlaces;