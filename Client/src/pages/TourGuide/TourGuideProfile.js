import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // Import Axios
import { getUserId } from "../../utils/authUtils.js";
import { useNavigate } from "react-router-dom";

const TourGuideProfile = () => {
  const userId = getUserId();
  const navigate = useNavigate();

  // State for profile data
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchTourGuideProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/tourGuide/profile/${userId}`
        );
        setProfile(response.data);
        setUpdatedProfile(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch tour guide profile:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchTourGuideProfile();
  }, [userId]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({
      ...prev,
      [name]:
        name === "previousWork"
          ? value.split(",").map((item) => item.trim())
          : value,
    }));
  };

  const handlenextpage =  () => {
    navigate("/tourGuide/Itinerary");
  };

  // Save changes
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/tourGuide/profile/${userId}`,
        updatedProfile
      );
      setProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error(
        "Failed to save profile changes:",
        error.response?.data?.message || error.message
      );
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <style>
        {`
          .profile-container {
            width: 50%;
            margin: auto;
            background-color: #f4f4f4;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
          }

          .profile-info label {
            display: block;
            margin-top: 10px;
          }

          .profile-info input, .profile-info textarea {
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            border-radius: 5px;
            border: 1px solid #ccc;
          }

          .button {
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
        `}
      </style>

      <div className="profile-container">
        <h1>Tour Guide Profile</h1>
        <div className="profile-info">
          {isEditing ? (
            <>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={updatedProfile.name || ""}
                onChange={handleChange}
              />

              <label>Mobile:</label>
              <input
                type="text"
                name="phoneNumber"
                value={updatedProfile.phoneNumber || ""}
                onChange={handleChange}
              />

              <label>Years of Experience:</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={updatedProfile.yearsOfExperience || ""}
                onChange={handleChange}
              />

              <label>Previous Work:</label>
              <textarea
                name="previousWork"
                value={(updatedProfile.previousWork || []).join(", ")}
                onChange={handleChange}
              />

              <label>License Number:</label>
              <input
                type="text"
                name="licenseNumber"
                value={updatedProfile.licenseNumber || ""}
                onChange={handleChange}
              />

              <button className="button" onClick={handleSave}>
                Save
              </button>
           
            </>
          ) : (
            <>
              <p>
                <strong>Name:</strong> {profile.name}
              </p>
              <p>
                <strong>Mobile:</strong> {profile.phoneNumber}
              </p>
              <p>
                <strong>Years of Experience:</strong> {profile.yearsOfExperience}
              </p>
              <p>
                <strong>Previous Work:</strong> {profile.previousWork.join(", ")}
              </p>
              <p>
                <strong>License Number:</strong> {profile.licenseNumber}
              </p>
              <button className="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
              <button className="button" onClick={handlenextpage}>
                Itineraries
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourGuideProfile;
