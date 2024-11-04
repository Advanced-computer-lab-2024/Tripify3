import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { getUserId } from "../../utils/authUtils.js";  // Adjust the import path as necessary

const FollowedTourGuides = () => {
    const userId = getUserId(); // Get the tourist's user ID
    const [followedGuideIds, setFollowedGuideIds] = useState([]);
    const [tourGuideProfiles, setTourGuideProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

                // Logging received profiles for debugging
                console.log(profiles);
    
                // Using optional chaining and filtering out undefined values
                const profilesData = profiles.map(profile => profile?.data?.userProfile).filter(Boolean);
                
                setTourGuideProfiles(profilesData);
            } catch (error) {
                console.error("Error fetching tour guide profiles:", error);
                setError("Couldn't fetch tour guide profiles. Please try again later.");
            } finally {
                setLoading(false); // Ensure loading state is managed correctly
            }
        };
    
        fetchTourGuideProfiles();
    }, [followedGuideIds]);

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
                        <Typography variant="subtitle1">{guide.username}</Typography>
                        <Typography variant="body2">{guide.email}</Typography>
                        <Typography variant="body2">Phone: {guide.phoneNumber}</Typography>
                        <Typography variant="body2">Years of Experience: {guide.yearsOfExperience}</Typography>
                        <Typography variant="body2">Status: {guide.status}</Typography>
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
                       
                        <List>
                            {guide.comments && Array.isArray(guide.comments) && guide.comments.length > 0 ? (
                                guide.comments.map((comment, index) => (
                                    <ListItem key={comment._id || index}>
                                        <ListItemText primary={`Comment ID: ${comment._id || comment}`} />
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>
                                   
                                </ListItem>
                            )}
                        </List>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default FollowedTourGuides;