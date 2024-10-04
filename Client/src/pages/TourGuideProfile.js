// Profile.js
import React, { useState } from 'react';
import '../styles/TourGuideProfile.css';

const updateProfile = async (id, updatedData) => {
    try {
        const response = await fetch(`http://localhost:8000/update/${tourGuideId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProfileData),
          });
          
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to update profile:', errorData.message);
            throw new Error(errorData.message);
        }
        const data = await response.json();
        console.log('Profile updated successfully:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

  


const TourGuideProfile = () => {
  // State for profile data
  const [profile, setProfile] = useState({
    id: 'YOUR_TOUR_GUIDE_ID', // Replace with the actual ID
    name: 'John Doe',
    mobile: '+123456789',
    yearsOfExperience: 5,
    previousWork: ['Tour Guide at Historical Monuments', 'City Tour Operator'],
    bio: 'Enthusiastic tour guide with a passion for history and cultural heritage.',
    email: 'johndoe@example.com',
});



  // State for editing profile
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(profile);

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
    const tourGuideId = 'YOUR_TOUR_GUIDE_ID'; // Replace with the actual ID
    try {
        const updatedData = await updateProfile(tourGuideId, updatedProfile);
        setProfile(updatedData); // Update local state with new profile data
        setIsEditing(false);
    } catch (error) {
        console.error('Failed to save profile changes:', error);
    }
};

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
            <input type="number" name="yearsOfExperience" value={updatedProfile.yearsOfExperience} onChange={handleChange} />

            <label>Previous Work:</label>
            <textarea name="previousWork" value={updatedProfile.previousWork.join(', ')} onChange={handleChange} />

            <label>Bio:</label>
            <textarea name="bio" value={updatedProfile.bio} onChange={handleChange} />

            <button onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Mobile:</strong> {profile.mobile}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Years of Experience:</strong> {profile.yearsOfExperience}</p>
            <p><strong>Previous Work:</strong> {profile.previousWork.join(', ')}</p>
            <p><strong>Bio:</strong> {profile.bio}</p>
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TourGuideProfile;
