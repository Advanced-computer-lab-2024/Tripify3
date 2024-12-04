import React, { useEffect, useState } from "react";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LanguageIcon from "@mui/icons-material/Language";
import EventIcon from "@mui/icons-material/Event";

import { Box, Paper, Dialog, Slide, Rating, CardActions,TextField,Chip ,FormControl,InputLabel ,Select ,MenuItem ,Typography, Button, CircularProgress, Grid, Card, CardContent, Avatar, List, ListItem } from "@mui/material";
import { getItineraryById, getUserProfile } from "../../services/tourGuide";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Favorite } from "@mui/icons-material";
import { Close as CloseIcon, Link as LinkIcon, Email as EmailIcon } from "@mui/icons-material";
import ShareIcon from "@mui/icons-material/Share";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { getUserId, getUserType } from "../../utils/authUtils";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { useParams, useNavigate } from "react-router-dom";
import {getAllTags} from "../../services/advertiser.js";
import{getAllPlaces ,getAllActivities} from "../../services/tourGuide.js";
import { updateItinerary } from "../../services/tourGuide.js";

const TourGuideEditItinerary = () => {

    const languages = ["English", "Spanish", "French", "German", "Arabic", "Russian", "Japanese", "Korean", "Italian"];

   
    const [editMode, setEditMode] = useState(false);
    const [itinerary, setItinerary] = useState(null);
    const [title, setTitle] = useState("");
    const [language, setLanguage] = useState("");
    const [dropoffLocation, setDropoffLocation] = useState("");
    const [accessibility, setAccessibility] = useState("");
    const [startTime, setStartTime] = useState("");
    const [price, setPrice] = useState(0);

    const [endTime, setEndTime] = useState("");

    const [pickupLocation, setPickupLocation] = useState("");

    const [selectedPlaces, setSelectedPlaces] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState([]);

    const [selectedTags, setSelectedTags] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [places, setPlaces] = useState([]);
    const [activities, setActivities] = useState([]);

    const [error, setError] = useState(null);  // Define the error state here
    const [loading, setLoading] = useState(true);  // Optional loading state for better UX
    const { id } = useParams();
    const navigate = useNavigate();  // You need this for navigation

    useEffect(() => {
      const fetchItineraryData = async () => {
        try {
          const response = await getItineraryById(id);
          const itineraryData = response.data?.data?.itinerary || null;
    
          if (itineraryData) {
            setItinerary(itineraryData);
            setTitle(itineraryData?.name || "");
            setLanguage(itineraryData?.language || "");
            setDropoffLocation(itineraryData?.dropoffLocation || "");
            setPickupLocation(itineraryData?.pickupLocation || "");
            setAccessibility(itineraryData?.accessibility || "");
            if (itineraryData?.timeline?.startTime) {
              const date = new Date(itineraryData.timeline.startTime);
            
              // Format date to 'YYYY-MM-DDTHH:MM'
              const formattedDate = date.getFullYear() +
                "-" + String(date.getMonth() + 1).padStart(2, '0') +
                "-" + String(date.getDate()).padStart(2, '0') +
                "T" + String(date.getHours()).padStart(2, '0') +
                ":" + String(date.getMinutes()).padStart(2, '0');
            
              setStartTime(formattedDate);
            } else {
              setStartTime(""); // Default empty string if startTime is not present
            }
            
            console.log(startTime);
            
            console.log(startTime);
            setPrice(itineraryData?.price || 0);
            if (itineraryData?.timeline?.endTime) {
              const date = new Date(itineraryData.timeline.endTime);
            
              // Format date to 'YYYY-MM-DDTHH:MM'
              const formattedDate = date.getFullYear() +
                "-" + String(date.getMonth() + 1).padStart(2, '0') +
                "-" + String(date.getDate()).padStart(2, '0') +
                "T" + String(date.getHours()).padStart(2, '0') +
                ":" + String(date.getMinutes()).padStart(2, '0');
            
              setEndTime(formattedDate);
            } else {
              setEndTime(""); // Default empty string if endTime is not present
            }
            
            console.log(endTime);
            
            setSelectedPlaces(itineraryData?.places?.map((place) => place._id) || []);
            setSelectedActivities(itineraryData?.activities?.map((activity) => activity._id) || []);
            setSelectedTags(itineraryData?.tags?.map((tag) => tag._id) || []);
          } else {
            setError("Itinerary not found.");
          }
        } catch (error) {
          setError("Error fetching itinerary details");
        } finally {
          setLoading(false);  // Ensure loading is false even in case of error
        }
      };
      
        const fetchTags = async () => {
          try {
            const tagsResponse = await getAllTags();
            setTags(tagsResponse.data?.tags || []);
          } catch (error) {
            setError("Error fetching tags");
          }
        };

        const fetchPlaces = async () => {
            try {
              const placesResponse = await getAllPlaces();
              setPlaces(placesResponse.data?.places || []);
            } catch (error) {
              setError("Error fetching Places");
            }
          };

          const fetchActivities = async () => {
            try {
              const activitiesResponse = await getAllActivities();
              setActivities(activitiesResponse.data?.activities || []);
            } catch (error) {
              setError("Error fetching Activities");
            }
          };
      
        // Fetch data when the component is mounted or the `id` changes
        setLoading(true);  // Ensure loading is true when fetching starts
        fetchItineraryData();
        fetchTags();
        fetchPlaces();
        fetchActivities();
      }, [id]);
      

    const handleUpdateToggle = () => setEditMode((prev) => !prev);

    const handleSave = async () => {
      try {
        await updateItinerary(id, {
          name: title,
          language,
          dropoffLocation,
          pickupLocation,
          timeline: {startTime,endTime},
          price,
          places: selectedPlaces,
          activities: selectedActivities,
          tags: selectedTags,
        });
        alert("Activity updated successfully!");
        setEditMode(false); // Close edit mode
       
        
    navigate(`/tour-guide/itinerary/details/${id}`);
      } catch (error) {
        console.error("Error updating activity:", error);
      }
    };



return (
    <Box sx={{ p: 3, backgroundColor: "#F5F7FA", minHeight: "100vh", position: "relative" }}>
      <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ position: "absolute", top: 16, left: 16 }}>
        Go Back
      </Button>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", mt: 5 }}>
        <Card sx={{ width: "100%", maxWidth: "900px", borderRadius: 3, boxShadow: 5, padding: 4, minHeight: "500px" }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h4" color="#333" gutterBottom textAlign="center" sx={{ mb: 3 }}>
                {(
                  <TextField label="Itinerary Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth sx={{ mb: 2 }} />
                ) }
              </Typography>
            </Box>

           


            <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
          
            {
                 (
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Language</InputLabel>
                    <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    label="Language"
                    >
                    {languages.map((lang, index) => (
                        <MenuItem key={index} value={lang}>
                        {lang}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                )
            }
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" ,marginLeft:2  }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                    <Typography variant="h4" color="#333" gutterBottom sx={{ mb: 3 }}>
                        <TextField
                        label="Drop-Off Location"
                        value={dropoffLocation}
                        onChange={(e) => setDropoffLocation(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                        />
                    </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                    <Typography variant="h4" color="#333" gutterBottom sx={{ mb: 3 }}>
                        <TextField
                        label="Pick-Up Location"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                        />
                    </Typography>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" ,marginLeft:2  }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                    <Typography variant="h4" color="#333" gutterBottom sx={{ mb: 3 }}>
                        <TextField
                        label="Accessibility"
                        value={accessibility}
                        onChange={(e) => setAccessibility(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                        />
                    </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                    <Typography variant="h4" color="#333" gutterBottom sx={{ mb: 3 }}>
                    <TextField
                        label="Start Time"
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)} // Updates the startDateTime state
                        fullWidth
                        sx={{ mb: 2 }}
                        InputLabelProps={{
                        shrink: true, // Ensures the label stays above the input field
                        }}
                    />
                    </Typography>
                </Grid>
                </Grid>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" ,marginLeft:2  }}>
                <Grid container spacing={3}>


                    <Grid item xs={12} sm={6}>
                    <Typography variant="h4" color="#333" gutterBottom sx={{ mb: 3 }}>
                    <TextField
                        label="End Time"
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)} // Updates the startDateTime state
                        fullWidth
                        sx={{ mb: 2 }}
                        InputLabelProps={{
                        shrink: true, // Ensures the label stays above the input field
                        }}
                    />
                    </Typography>
                </Grid>


                <Grid item xs={12} sm={6}>
                <Typography variant="h4" color="#333" gutterBottom sx={{ mb: 3 }}>
                    <TextField
                    label="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    type="number" // Ensures only numeric input
                    />
                </Typography>
                </Grid>

                </Grid>
            </Box>
            

            <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: "#4A5568", fontWeight: 500, mb: 1 }}>
                  Tags
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {
                    tags.map((tag) => (
                        <Chip
                          key={tag._id}
                          label={tag.name}
                          clickable
                          onClick={() =>
                            setSelectedTags((prevTags) =>
                              prevTags.includes(tag._id) ? prevTags.filter((id) => id !== tag._id) : [...prevTags, tag._id]
                            )
                          }
                          color={selectedTags.includes(tag._id) ? "primary" : "default"}
                        />
                      ))
                      }
                </Box>
              </Grid>


              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: "#4A5568", fontWeight: 500, mb: 1 }}>
                  Places
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {
                    places.map((place) => (
                        <Chip
                          key={place._id}
                          label={place.name}
                          clickable
                          onClick={() =>
                            setSelectedPlaces((prevPlaces) =>
                                prevPlaces.includes(place._id) ? prevPlaces.filter((id) => id !== place._id) : [...prevPlaces, place._id]
                            )
                          }
                          color={selectedPlaces.includes(place._id) ? "primary" : "default"}
                        />
                      ))
                      }
                </Box>
              </Grid>


              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: "#4A5568", fontWeight: 500, mb: 1 }}>
                  Activities
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {
                    activities.map((activity) => (
                        <Chip
                          key={activity._id}
                          label={activity.name}
                          clickable
                          onClick={() =>
                            setSelectedActivities((prevActivities) =>
                                prevActivities.includes(activity._id) ? prevActivities.filter((id) => id !== activity._id) : [...prevActivities, activity._id]
                            )
                          }
                          color={selectedActivities.includes(activity._id) ? "primary" : "default"}
                        />
                      ))
                      }
                </Box>
              </Grid>


            </Grid>
          </CardContent>

          { (
            <CardActions sx={{ justifyContent: "flex-end", padding: "24px 32px" }}>
              <Button variant="contained" color="primary" onClick={handleSave} sx={{ px: 4 }}>
                Save Changes
              </Button>
            </CardActions>
          )}
        </Card>
      </Box>
    </Box>
  );
};
export default TourGuideEditItinerary;