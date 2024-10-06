import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/AdvertiserProfile.css';
import { getUserId } from "../../utils/authUtils.js";

const AdvertiserProfile = () => {
  const userId = getUserId();

  // State for profile data
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchAdvertiserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/advertiser/profile/${userId}`);
        setProfile(response.data.profile); // Set profile data directly
        setUpdatedProfile(response.data.profile); // Also set updated profile to the fetched profile
      } catch (error) {
        console.error('Failed to fetch advertiser profile:', error.response?.data?.message || error.message);
      }
    };

    fetchAdvertiserProfile();
  }, [userId]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save changes
  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/advertiser/profile/${userId}`, updatedProfile);
      setProfile(response.data.profile); // Update profile with response data
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile changes:', error.response?.data?.message || error.message);
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h1>Advertiser Profile</h1>
      <div className="profile-info">
        {isEditing ? (
          <>
            {/* Read-only inputs for email and username */}
            <label>Email:</label>
            <input type="email" name="email" value={updatedProfile.email || ''} onChange={handleChange} readOnly />

            <label>Username:</label>
            <input type="text" name="username" value={updatedProfile.username || ''} onChange={handleChange} readOnly />

            {/* Editable fields for the rest of the profile */}
            <label>Company Name:</label>
            <input type="text" name="companyName" value={updatedProfile.companyName || ''} onChange={handleChange} />

            <label>Website Link:</label>
            <input type="text" name="websiteLink" value={updatedProfile.websiteLink || ''} onChange={handleChange} />

            <label>Hotline:</label>
            <input type="text" name="hotline" value={updatedProfile.hotline || ''} onChange={handleChange} />

            <button onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Company Name:</strong> {profile.companyName}</p>
            <p><strong>Website Link:</strong> {profile.websiteLink}</p>
            <p><strong>Hotline:</strong> {profile.hotline}</p>
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdvertiserProfile;
