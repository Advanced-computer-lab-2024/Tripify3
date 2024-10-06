import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileView = ({ username }) => {
  const [profile, setProfile] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  // Fetch user profile when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/tourist/profile/${username}`
        ); // Replace with your endpoint
        setProfile(response.data.userProfile);
        setResponseMessage("");
      } catch (error) {
        setResponseMessage(
          error.response?.data?.message || "Failed to fetch profile."
        );
      }
    };

    fetchProfile();
  }, [username]);

  return (
    <div>
      <h2>User Profile</h2>
      {responseMessage && <p>{responseMessage}</p>}

      {profile ? (
        <div>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Phone Number:</strong> {profile.phoneNumber}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {new Date(profile.dateOfBirth).toLocaleDateString()}
          </p>
          <p>
            <strong>Occupation:</strong> {profile.occupation}
          </p>
          <p>
            <strong>Nationality:</strong> {profile.nationality}
          </p>
        </div>
      ) : (
        <p>No profile data available</p>
      )}
    </div>
  );
};

export default ProfileView;
