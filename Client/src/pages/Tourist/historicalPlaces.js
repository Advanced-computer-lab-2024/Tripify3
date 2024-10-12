import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from '@mui/material';

const HistoricalPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const placeTypes = ["Monument", "Religious Site", "Palace", "Castle", "Historical Place", "Museum"];

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('http://localhost:8000/places/get');
        setPlaces(response.data.data);
        setFilteredPlaces(response.data.data); // Initialize with all places
        setLoading(false);
      } catch (err) {
        setError('Error fetching places data');
        setLoading(false);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:8000/tag/get'); // Check if this is the correct URL
        setTags(response.data.tags);
      } catch (err) {
        setError('Error fetching tags');
      }
    };

    fetchPlaces();
    fetchTags();
  }, []);

  useEffect(() => {
    const filtered = places.filter(place =>
      place.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlaces(filtered);
  }, [searchTerm, places]);

  const handleTagChange = (event) => {
    const value = event.target.value;
    setSelectedTags(typeof value === 'string' ? value.split(',') : value);
  };

  const handleFilter = async () => {
    try {
      const tagQuery = selectedTags.join(',');
      const response = await axios.get(`http://localhost:8000/places/filter?tags=${tagQuery}&type=${selectedType}`);
      setFilteredPlaces(response.data.data);
    } catch (err) {
      setError('Error applying filter');
    }
  };

  const handleReset = () => {
    setSelectedType('');
    setSelectedTags([]);
    setSearchTerm('');
    setFilteredPlaces(places); // Reset to all places
  };

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  return (
    <Container>
      <Typography variant="h2" align="center" gutterBottom>
        Historical Places
      </Typography>

      <TextField
        label="Search by Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div style={{ marginBottom: '20px' }}>
        <Typography variant="h6">Filter Places</Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Type of Place</InputLabel>
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <MenuItem value=""><em>Select Type</em></MenuItem>
            {placeTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Tags</InputLabel>
          <Select
            multiple
            value={selectedTags}
            onChange={handleTagChange}
            renderValue={(selected) => (
              <div>
                {selected.map((value) => (
                  <Chip key={value} label={tags.find(tag => tag._id === value)?.name} />
                ))}
              </div>
            )}
          >
            {tags.map((tag) => (
              <MenuItem key={tag._id} value={tag._id}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleFilter}>
          Apply Filter
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset} style={{ marginLeft: '10px' }}>
          Reset Filter
        </Button>
      </div>

      <Grid container spacing={3}>
        {filteredPlaces.map((place) => (
          <Grid item xs={12} sm={6} md={4} key={place._id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{place.name}</Typography>
                <Typography variant="body2">{place.description}</Typography>
                <Typography variant="subtitle2">
                  <strong>Place Type:</strong> {place.type}
                </Typography>
                <Typography variant="subtitle2">
                  <strong>Location:</strong> {place.location.address}, {place.location.city}, {place.location.country}
                </Typography>
                <Typography variant="subtitle2">
                  <strong>Ticket Prices:</strong> Foreigner: {place.ticketPrices.foreigner} EGP, Native: {place.ticketPrices.native} EGP, Student: {place.ticketPrices.student} EGP
                </Typography>
                <div>
                  <strong>Opening Hours:</strong>
                  <ul>
                    {place.openingHours.map((hours) => (
                      <li key={hours._id}>
                        {hours.day}: {hours.from} - {hours.to}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Tags:</strong>
                  <ul>
                    {place.tags.map((tag) => (
                      <li key={tag._id}>{tag.name}</li>
                    ))}
                  </ul>
                </div>
                <Button variant="outlined" color="primary" onClick={() => alert(`Viewing details for ${place.name}`)}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HistoricalPlaces;
