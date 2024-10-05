import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles/TourGuideProfile.css';
import { getUserId } from "../../utils/authUtils.js";

const TourGuideProfile = () => {
  const userId = getUserId();
  const { id } = useParams();

  // State for profile data
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchTourGuideProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8000/tourGuide/profile/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
        const profileData = await response.json();
        setProfile(profileData);
        setUpdatedProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch tour guide profile:', error);
      }
    };

    fetchTourGuideProfile();
  }, [id]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({
      ...prev,
      [name]: name === 'previousWork' ? value.split(',').map(item => item.trim()) : value,
    }));
  };

  // Save changes
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8000/tourGuide/profile/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const updatedData = await response.json();
      setProfile(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile changes:', error);
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h1>Tour Guide Profile</h1>
      <div className="profile-info">
        {isEditing ? (
          <>
            <label>Name:</label>
            <input type="text" name="name" value={updatedProfile.name || ''} onChange={handleChange} />

            <label>Mobile:</label>
            <input type="text" name="phoneNumber" value={updatedProfile.phoneNumber || ''} onChange={handleChange} />

            <label>Years of Experience:</label>
            <input type="number" name="experienceYears" value={updatedProfile.experienceYears || ''} onChange={handleChange} />

            <label>Previous Work:</label>
            <textarea name="previousWork" value={(updatedProfile.previousWork || []).join(', ')} onChange={handleChange} />

            <label>License Number:</label>
            <input type="text" name="licenseNumber" value={updatedProfile.licenseNumber || ''} onChange={handleChange} />

            <button onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Mobile:</strong> {profile.phoneNumber}</p>
            <p><strong>Years of Experience:</strong> {profile.experienceYears}</p>
            <p><strong>Previous Work:</strong> {profile.previousWork.join(', ')}</p>
            <p><strong>License Number:</strong> {profile.licenseNumber}</p>
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TourGuideProfile;
