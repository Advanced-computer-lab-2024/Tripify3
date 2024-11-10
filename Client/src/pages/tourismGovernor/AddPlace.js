import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box
} from "@mui/material";
import { clearUser, getUserId } from '../../utils/authUtils.js';

const CreatePlaceForm = () => {
  const navigate = useNavigate();
  const userId = getUserId(); // Replace with actual user ID function
  const [place, setPlace] = useState({
    name: "",
    description: "",
    pictures: [],
    location: {
      address: "",
      city: "",
      country: "",
    },
    openingHours: [],
    ticketPrices: {
      foreigner: "",
      native: "",
      student: "",
    },
    tags: [],
    type: "",
  });

  const [newPicture, setNewPicture] = useState("");
  const [newOpeningHour, setNewOpeningHour] = useState({ day: "", from: "", to: "" });
  const [newTagIds, setNewTagIds] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [placeTypes, setPlaceTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [showAddOpeningHour, setShowAddOpeningHour] = useState(false);
  const [showAddPicture, setShowAddPicture] = useState(false);

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  ];

  // Fetch available tags
  useEffect(() => {
    axios
      .get("http://localhost:8000/tag/get")
      .then((response) => {
        if (response.data.message === "Tags retrieved successfully") {
          setAvailableTags(response.data.tags);
        }
      })
      .catch((err) => {
        console.error("Error fetching tags:", err);
      });
  }, []);

  // Fetch available place types
  useEffect(() => {
    setPlaceTypes(["Monument", "Religious Site", "Palace", "Historical Place", "Museum"]);
  }, []);

  // Fetch countries and cities
  useEffect(() => {
    axios
      .get("https://countriesnow.space/api/v0.1/countries")
      .then((response) => {
        if (response.data.error === false) {
          setCountries(response.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching countries:", err);
      });
  }, []);

  // Handle country selection
  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const country = countries.find((c) => c.country === selectedCountry);
    setCities(country?.cities || []);
    setPlace((prevPlace) => ({
      ...prevPlace,
      location: {
        ...prevPlace.location,
        country: selectedCountry,
        city: "", // Reset city when country changes
      },
    }));
  };

  // Handle city selection
  const handleCityChange = (e) => {
    setPlace((prevPlace) => ({
      ...prevPlace,
      location: {
        ...prevPlace.location,
        city: e.target.value,
      },
    }));
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Check if it's a nested field like 'location.address'
    if (name.startsWith("location.")) {
      const fieldName = name.split('.')[1]; // Get the key like 'address'
      setPlace((prevPlace) => ({
        ...prevPlace,
        location: {
          ...prevPlace.location,
          [fieldName]: value,  // Dynamically update the field
        },
      }));
    } else if (name.startsWith("ticketPrices.")) {
      const ticketType = name.split(".")[1];
      setPlace((prevPlace) => ({
        ...prevPlace,
        ticketPrices: {
          ...prevPlace.ticketPrices,
          [ticketType]: value,
        },
      }));
    } else {
      setPlace((prevPlace) => ({
        ...prevPlace,
        [name]: value,
      }));
    }
  };


  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/place/create`, {
        ...place,
        tags: newTagIds,
        tourismGovernor: userId,
      })
      .then((response) => {
        console.log("Place added:", response.data);
        navigate(`/governor`);
      })
      .catch((err) => {
        console.error("Error adding place:", err);
      });
  };

  // Handle adding new picture
  const handleAddPicture = () => {
    setPlace((prevPlace) => ({
      ...prevPlace,
      pictures: [...prevPlace.pictures, newPicture],
    }));
    setNewPicture("");
    setShowAddPicture(false);
  };

  // Handle removing a picture
  const handleRemovePicture = (index) => {
    setPlace((prevPlace) => ({
      ...prevPlace,
      pictures: prevPlace.pictures.filter((_, i) => i !== index),
    }));
  };

  // Handle checkbox change for tags
  const handleTagChange = (tagId) => {
    setNewTagIds((prevIds) => {
      if (prevIds.includes(tagId)) {
        return prevIds.filter((id) => id !== tagId);
      } else {
        return [...prevIds, tagId];
      }
    });
  };

  // Handle opening hour change
  const handleOpeningHourChange = (e) => {
    const { name, value } = e.target;
    setNewOpeningHour((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle adding new opening hour
  const handleAddOpeningHour = () => {
    setPlace((prevPlace) => ({
      ...prevPlace,
      openingHours: [...prevPlace.openingHours, newOpeningHour],
    }));
    setNewOpeningHour({ day: "", from: "", to: "" });
    setShowAddOpeningHour(false);
  };

  // Handle removing an opening hour
  const handleRemoveOpeningHour = (index) => {
    setPlace((prevPlace) => ({
      ...prevPlace,
      openingHours: prevPlace.openingHours.filter((_, i) => i !== index),
    }));
  };

  // Get available days for the dropdown
  const getAvailableDays = () => {
    const selectedDays = place.openingHours.map((hour) => hour.day);
    return daysOfWeek.filter((day) => !selectedDays.includes(day));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3} sx={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ marginBottom: '20px', textAlign: 'center' }}>
            Create New Place
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Place Name"
            name="name"
            value={place.name}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: '16px' }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            name="description"
            value={place.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            sx={{ marginBottom: '16px' }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ marginBottom: '16px' }}>
            <InputLabel>Country</InputLabel>
            <Select value={place.location.country} onChange={handleCountryChange}>
              {countries.map((country) => (
                <MenuItem key={country.country} value={country.country}>
                  {country.country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ marginBottom: '16px' }}>
            <InputLabel>City</InputLabel>
            <Select
              value={place.location.city}
              onChange={handleCityChange}
              disabled={!place.location.country}
            >
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
        <TextField
  label="Address"
  name="location.address"
  value={place.location.address}  // Make sure this is linked to state
  onChange={handleChange}
  fullWidth
  sx={{ marginBottom: '16px' }}
/>


        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ marginBottom: '16px' }}>
            <InputLabel>Place Type</InputLabel>
            <Select
              value={place.type}
              name="type"
              onChange={handleChange}
              fullWidth
            >
              {placeTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* Ticket Prices */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Foreigner Price"
            name="ticketPrices.foreigner"
            value={place.ticketPrices.foreigner}
            onChange={handleChange}
            fullWidth
            type="number"
            sx={{ marginBottom: '16px' }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Native Price"
            name="ticketPrices.native"
            value={place.ticketPrices.native}
            onChange={handleChange}
            fullWidth
            type="number"
            sx={{ marginBottom: '16px' }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Student Price"
            name="ticketPrices.student"
            value={place.ticketPrices.student}
            onChange={handleChange}
            fullWidth
            type="number"
            sx={{ marginBottom: '16px' }}
          />
        </Grid>

        {/* Tags */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ marginBottom: '8px' }}>
            Tags
          </Typography>
          <FormGroup row>
            {availableTags.map((tag) => (
              <FormControlLabel
                key={tag._id}
                control={
                  <Checkbox
                    checked={newTagIds.includes(tag._id)}
                    onChange={() => handleTagChange(tag._id)}
                  />
                }
                label={tag.name}
              />
            ))}
          </FormGroup>
        </Grid>

        {/* Opening Hours */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ marginBottom: '8px' }}>
            Opening Hours
          </Typography>
          {place.openingHours.map((hour, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Typography variant="body1" sx={{ marginRight: '8px' }}>
                {hour.day}: {hour.from} - {hour.to}
              </Typography>
              <Button onClick={() => handleRemoveOpeningHour(index)}>Remove</Button>
            </Box>
          ))}
          {showAddOpeningHour && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Select
                name="day"
                value={newOpeningHour.day}
                onChange={handleOpeningHourChange}
                fullWidth
              >
                <MenuItem value="">Select Day</MenuItem>
                {getAvailableDays().map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                name="from"
                label="From"
                type="time"
                value={newOpeningHour.from}
                onChange={handleOpeningHourChange}
                fullWidth
              />
              <TextField
                name="to"
                label="To"
                type="time"
                value={newOpeningHour.to}
                onChange={handleOpeningHourChange}
                fullWidth
              />
              <Button onClick={handleAddOpeningHour}>Add Opening Hour</Button>
            </Box>
          )}
          <Button onClick={() => setShowAddOpeningHour(!showAddOpeningHour)}>
            {showAddOpeningHour ? "Cancel" : "Add Opening Hour"}
          </Button>
        </Grid>

        {/* Pictures */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ marginBottom: '8px' }}>
            Pictures
          </Typography>
          {place.pictures.map((picture, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Typography variant="body1" sx={{ marginRight: '8px' }}>
                {picture}
              </Typography>
              <Button onClick={() => handleRemovePicture(index)}>Remove</Button>
            </Box>
          ))}
          {showAddPicture && (
            <Box sx={{ display: 'flex', gap: '8px' }}>
              <TextField
                label="Add Picture URL"
                value={newPicture}
                onChange={(e) => setNewPicture(e.target.value)}
                fullWidth
              />
              <Button onClick={handleAddPicture}>Add Picture</Button>
            </Box>
          )}
          <Button onClick={() => setShowAddPicture(!showAddPicture)}>
            {showAddPicture ? "Cancel" : "Add Picture"}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '16px' }}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreatePlaceForm;
