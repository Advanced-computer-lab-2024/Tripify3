import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CircularProgress, List, ListItem, ListItemText, TextField, Button } from '@mui/material';
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

    const handleRatingSubmit = async (guideId) => {
        try {
            // Send both user ID and rating value
            await axios.post(`http://localhost:8000/tourist/rate/${guideId}`, { 
                user: userId,  // Include user ID
                value: rating   // The rating value
            });
            setRating(0); // Reset rating after submitting
        } catch (error) {
            console.error("Error submitting rating:", error);
        }
    };

    const handleCommentSubmit = async (guideId) => {
        try {
            await axios.post(`http://localhost:8000/tourist/comment/${guideId}`, { 
                user: userId,  // Include user ID
                content: commentContent // Content of the comment
            });
            setCommentContent(''); // Clear the input after submission
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="red">{error}</Typography>;
    }

    if (tourGuideProfiles.length === 0) {
        return <Typography>No followed tour guides found.</Typography>;
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Followed Tour Guides
            </Typography>
            {tourGuideProfiles.map(guide => (
                <Card key={guide._id} sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Typography variant="h5">{guide.name}</Typography>
                        <Typography variant="body2">Email:  {guide.email}</Typography>
                        <Typography variant="body2">Phone:  {guide.phoneNumber}</Typography>
                        <Typography variant="body2">Years of Experience: {guide.yearsOfExperience}</Typography>
                        <Typography variant="body1" sx={{ marginTop: 1 }}><strong>Previous Work:</strong></Typography>
                        <List>
                            {guide.previousWork && guide.previousWork.length > 0 ? (
                                guide.previousWork.map((work, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={work} />
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemText primary="No previous work listed." />
                                </ListItem>
                            )}
                        </List>

                        <Typography variant="body1" sx={{ marginTop: 2 }}><strong>Rate this Tour Guide:</strong></Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'start', marginBottom: 2 }}>
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <span key={starValue} onClick={() => handleRatingChange(starValue)} style={{ cursor: 'pointer' }}>
                                        {starValue <= rating ? <StarIcon color="primary" /> : <StarBorderIcon />}
                                    </span>
                                );
                            })}
                        </Box>
                        <Button variant="contained" onClick={() => handleRatingSubmit(guide._id)} disabled={rating === 0}>
                            Submit Rating
                        </Button>

                        <TextField
                            label="Comment"
                            value={commentContent}
                            onChange={handleCommentChange}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                        <Button variant="contained" onClick={() => handleCommentSubmit(guide._id)}>
                            Submit Comment
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default FollowedTourGuides;