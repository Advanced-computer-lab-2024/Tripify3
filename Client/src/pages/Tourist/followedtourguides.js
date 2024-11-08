import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    TextField,
    Button,
} from '@mui/material';
import { Star as StarIcon, StarBorder as StarBorderIcon } from '@mui/icons-material';
import { getUserId } from "../../utils/authUtils.js";

const FollowedTourGuides = () => {
    const userId = getUserId(); // Get the tourist's user ID
    const [followedGuideIds, setFollowedGuideIds] = useState([]);
    const [tourGuideProfiles, setTourGuideProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [rating, setRating] = useState(0);
    const [commentContent, setCommentContent] = useState('');

    useEffect(() => {
        const fetchFollowedGuides = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/tourist/following/get/${userId}`);
                setFollowedGuideIds(response.data.following || []);
                console.log(response.data.following);
            } catch (error) {
                console.error("Error fetching followed tour guides:", error);
                setError("Couldn't fetch followed guides. Please try again later.");
            }
        };

        fetchFollowedGuides();
    }, [userId]);

    useEffect(() => {
        const fetchTourGuideProfiles = async () => {
            if (followedGuideIds.length === 0) return;

            try {
                const profiles = await Promise.all(
                    followedGuideIds.map(id =>
                        axios.get(`http://localhost:8000/tourguide/profile/${id}`)
                    )
                );

                const profilesData = profiles.map(profile => profile?.data?.userProfile).filter(Boolean);
                setTourGuideProfiles(profilesData);
            } catch (error) {
                console.error("Error fetching tour guide profiles:", error);
                setError("Couldn't fetch tour guide profiles. Please try again later.");
            } finally {
                setLoading(false);     
            }
        };

        fetchTourGuideProfiles();
    }, [followedGuideIds]);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleCommentChange = (event) => {
        setCommentContent(event.target.value);
    };

    const handleReviewSubmit = async (guideId) => {
        try {
            await axios.post(`http://localhost:8000/tourist/review`, { 
                trip: null, // Add trip ID if applicable, or set it to null
                tourGuide: guideId,
                activity: null, // Add activity ID if applicable, or set it to null
                itinerary: null, // Add itinerary ID if applicable, or set it to null
                product: null, // Add product ID if applicable, or set it to null
                touristId: userId,
                rating,
                comment: commentContent
            });
            // Reset the rating and comment input fields after submission
            setRating(0);
            setCommentContent('');
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };
    if (tourGuideProfiles.length === 0) {
        return <Typography>No followed tour guides found.</Typography>;
    }
    if (error) {
        return <Typography color="red">{error}</Typography>;
    }
    if (loading) {
        return <CircularProgress />;
    }

    

   

    return (
        <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                Followed Tour Guides
            </Typography>
            {tourGuideProfiles.map(guide => (
                <Card key={guide._id} sx={{ marginBottom: 3, elevation: 3, borderRadius: 2, boxShadow: 3 }}>
                    <CardContent sx={{ backgroundColor: '#fff', borderRadius: 2 }}>
                        <Typography variant="h5" sx={{ color: '#3f51b5', marginBottom: 1 }}>{guide.name}</Typography>
                        <Typography variant="body2" color="textSecondary">Email:  {guide.email}</Typography>
                        <Typography variant="body2" color="textSecondary">Phone:  {guide.phoneNumber}</Typography>
                        <Typography variant="body2" color="textSecondary">Years of Experience: {guide.yearsOfExperience}</Typography>

                        <Typography variant="h6" sx={{ marginTop: 2, fontWeight: 'bold' }}>Previous Work:</Typography>
                        <List>
                            {guide.previousWork && guide.previousWork.length > 0 ? (
                                guide.previousWork.map((work, index) => (
                                    <ListItem key={index} sx={{ padding: 0 }}>
                                        <ListItemText primary={work} />
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem sx={{ padding: 0 }}>
                                    <ListItemText primary="No previous work listed." />
                                </ListItem>
                            )}
                        </List>

                        <Typography variant="h6" sx={{ marginTop: 2, fontWeight: 'bold' }}>Rate this Tour Guide:</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'start', marginBottom: 2 }}>
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <span key={starValue} onClick={() => handleRatingChange(starValue)} style={{ cursor: 'pointer', marginRight: 0.5 }}>
                                        {starValue <= rating ? (
                                            <StarIcon color="primary" fontSize="large" />
                                        ) : (
                                            <StarBorderIcon fontSize="large" />
                                        )}
                                    </span>
                                );
                            })}
                        </Box>
                        <Button 
                            variant="contained" 
                            onClick={() => handleReviewSubmit(guide._id)} 
                            disabled={rating === 0 || commentContent.trim() === ""}
                            sx={{ marginBottom: 2, backgroundColor: '#3f51b5', '&:hover': { backgroundColor: '#303f9f' } }}
                        >
                            Submit Review
                        </Button>

                        <TextField
                            label="Comment"
                            value={commentContent}
                            onChange={handleCommentChange}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            sx={{ marginBottom: 2 }}
                        />
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default FollowedTourGuides;