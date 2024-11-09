import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress, Grid, Card, CardContent, CardActions, IconButton, TextField, Select, MenuItem, FormControl, InputLabel, InputAdornment, Divider } from "@mui/material";
import { LocationOn as LocationOnIcon, Edit as EditIcon } from "@mui/icons-material";
import axios from "axios";
import { getUserId, getUserType } from "../../utils/authUtils";

const GovernorHistoricalPlaceDetails = () => {
  const { id } = useParams();
  const userType = getUserType();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlace, setEditedPlace] = useState({
    name: "",
    description: "",
    location: { address: "", city: "", country: "" },
    openingHours: [],
    tags: [],
    ticketPrices: { foreigner: 0, native: 0, student: 0 }
  });

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/governor/get/places/${id}`);
        setPlace(response.data.place[0]);
        setEditedPlace(response.data.place[0]);
        setTags(await fetchTags());
        setLoading(false);
      } catch (error) {
        setError("Error fetching place details");
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);

  const fetchTags = async () => {
    try {
      const response = await axios.get("http://localhost:8000/tag/get");
      return response.data.tags;
    } catch (error) {
      console.error("Error fetching tags", error);
      return [];
    }
  };

  const handleTagSelect = (tagId) => {
    setSelectedTags(prevSelectedTags =>
      prevSelectedTags.includes(tagId)
        ? prevSelectedTags.filter(tag => tag !== tagId)
        : [...prevSelectedTags, tagId]
    );
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleFieldChange = (e, field) => {
    const { name, value } = e.target;
    setEditedPlace(prevPlace => ({
      ...prevPlace,
      [name]: value,
    }));
  };

  const handleSubmitEdit = async () => {
    const updatedPlace = { ...editedPlace, tags: selectedTags };
    try {
      const response = await axios.put(`http://localhost:8000/governor/get/places/${id}`, updatedPlace);
      alert(response.data.message);
      setPlace(updatedPlace);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating place details", error);
    }
  };

  const BookPlace = async () => {
    const tourist = getUserId();
    const booking = { tourist, price: totalPrice, type: "Place", itemId: place._id, tickets: ticketCount };

    try {
      const response = await axios.post(`http://localhost:8000/tourist/booking/create`, booking);
      alert(response.data.message);
    } catch (error) {
      console.error("Error sending booking:", error);
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
    <Box sx={{ p: 3, backgroundColor: "#F5F7FA", minHeight: "100vh" }}>
      <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ position: "absolute", top: 16, left: 16, fontSize: "1rem", fontWeight: 500 }}>
        Go Back
      </Button>

      <Grid container justifyContent="center" sx={{ mt: 5 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ width: "100%", borderRadius: 3, boxShadow: 5, padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                <IconButton onClick={handleEditToggle} sx={{ color: "#5A67D8" }}>
                  <EditIcon />
                </IconButton>
              </Box>

              <Typography variant="h4" color="#333" gutterBottom textAlign="center" sx={{ mb: 3 }}>
                {isEditing ? (
                  <TextField value={editedPlace.name} name="name" onChange={(e) => handleFieldChange(e, "name")} variant="outlined" fullWidth sx={{ mb: 2 }} />
                ) : (
                  place.name
                )}
              </Typography>

              {isEditing ? (
                <TextField
                  value={editedPlace.description}
                  name="description"
                  onChange={(e) => handleFieldChange(e, "description")}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography variant="body1" color="#4A5568" sx={{ mb: 2 }}>
                  {place.description}
                </Typography>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOnIcon sx={{ color: "#5A67D8", mr: 1 }} />
                    {isEditing ? (
                      <>
                        <TextField
                          value={editedPlace.location.address}
                          name="address"
                          onChange={(e) => handleFieldChange(e, "address")}
                          variant="outlined"
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          value={editedPlace.location.city}
                          name="city"
                          onChange={(e) => handleFieldChange(e, "city")}
                          variant="outlined"
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          value={editedPlace.location.country}
                          name="country"
                          onChange={(e) => handleFieldChange(e, "country")}
                          variant="outlined"
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                      </>
                    ) : (
                      <Typography variant="body1" sx={{ color: "#4A5568", fontWeight: 500 }}>
                        {place.location.address}, {place.location.city}, {place.location.country}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" color="#333" sx={{ mt: 2 }}>
                    Ticket Prices:
                  </Typography>
                  <Grid container spacing={2}>
                    {["foreigner", "native", "student"].map((type) => (
                      <Grid item xs={4} key={type}>
                        <TextField
                          label={`${type.charAt(0).toUpperCase() + type.slice(1)} Price`}
                          value={editedPlace.ticketPrices[type]}
                          onChange={(e) => handleFieldChange(e, "ticketPrices")}
                          name={`ticketPrices[${type}]`}
                          type="number"
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" color="#333" sx={{ mt: 2 }}>
                    Tags:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {tags.map((tag) => (
                      <Button
                        key={tag._id}
                        variant={selectedTags.includes(tag._id) ? "contained" : "outlined"}
                        onClick={() => handleTagSelect(tag._id)}
                        sx={{
                          color: selectedTags.includes(tag._id) ? "#fff" : "#5A67D8",
                          backgroundColor: selectedTags.includes(tag._id) ? "#5A67D8" : "transparent",
                        }}
                      >
                        {tag.name}
                      </Button>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>

            <CardActions sx={{ width: "100%", justifyContent: "space-between", pt: 2 }}>
              {isEditing ? (
                <Button variant="contained" color="primary" onClick={handleSubmitEdit}>
                  Save Changes
                </Button>
              ) : (
                <Button variant="outlined" onClick={BookPlace}>
                  Book This Place
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GovernorHistoricalPlaceDetails;
