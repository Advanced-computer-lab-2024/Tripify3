import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import '../TourGuide/styles/TourGuideProfile.css';

// Fetch the profile based on ID
const fetchProfile = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/tourGuide/profile/${id}`); // Replace with your actual endpoint
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to fetch profile:', errorData.message);
      throw new Error(errorData.message);
    }
    return await response.json(); // Return the profile data
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

const updateProfile = async (id, updatedData) => {
  try {
    const response = await fetch(`http://localhost:8000/tourGuide/profile/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to update profile:', errorData.message);
      throw new Error(errorData.message);
    }
    return await response.json(); 
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const TourGuideProfile = () => {
  const { id } = useParams(); // Get ID from URL params

  // State for profile data
  const [profile, setProfile] = useState(null); // Initialize as null
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(profile);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchTourGuideProfile = async () => {
      try {
        const profileData = await fetchProfile(id);
        setProfile(profileData);
        setUpdatedProfile(profileData); // Set the updated profile state
      } catch (error) {
        console.error('Failed to fetch tour guide profile:', error);
      }
    };

    fetchTourGuideProfile();
  }, [id]); // Run effect when ID changes

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({
      ...updatedProfile,
      [name]: name === 'previousWork' ? value.split(',').map(item => item.trim()) : value,
    });
  };

  // Save changes
  const handleSave = async () => {
    try {
      const updatedData = await updateProfile(id, updatedProfile);
      setProfile(updatedData); // Update local state with new profile data
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile changes:', error);
    }
  };

  if (!profile) return <p>Loading...</p>; // Show loading while fetching

  return (
    <div className="profile-container">
      <h1>Tour Guide Profile</h1>
      <div className="profile-info">
        {isEditing ? (
          <>
            <label>Name:</label>
            <input type="text" name="name" value={updatedProfile.name} onChange={handleChange} />

            <label>Mobile:</label>
            <input type="text" name="mobile" value={updatedProfile.mobile} onChange={handleChange} />

            <label>Email:</label>
            <input type="email" name="email" value={updatedProfile.email} onChange={handleChange} />

            <label>Years of Experience:</label>
            <input type="number" name="yearsOfExperience" value={updatedProfile.experienceYears} onChange={handleChange} />

            <label>Previous Work:</label>
            <textarea name="previousWork" value={updatedProfile.previousWork.join(', ')} onChange={handleChange} />

            <label>description:</label>
            <textarea name="description" value={updatedProfile.description} onChange={handleChange} />

            <button onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Mobile:</strong> {profile.mobile}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Years of Experience:</strong> {profile.experienceYears}</p>
            <p><strong>Previous Work:</strong> {profile.previousWork.join(', ')}</p>
            <p><strong>description:</strong> {profile.description}</p>
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TourGuideProfile;
