import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileEdit = ({ username }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    occupation: "",
    nationality: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  // Fetch user profile to populate the form when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/tourist/profile/${username}`
        ); // Replace with your endpoint
        const userProfile = response.data.userProfile;
        setFormData({
          name: userProfile.name || "",
          email: userProfile.email || "",
          phoneNumber: userProfile.phoneNumber || "",
          dateOfBirth: userProfile.dateOfBirth
            ? new Date(userProfile.dateOfBirth).toISOString().substr(0, 10)
            : "",
          occupation: userProfile.occupation || "",
          nationality: userProfile.nationality || "",
        });
        setIsProfileLoaded(true);
      } catch (error) {
        setResponseMessage(
          error.response?.data?.message || "Failed to fetch profile."
        );
      }
    };

    fetchProfile();
  }, [username]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for updating the profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:8000/access/profile/${username}`,
        formData
      );
      setResponseMessage("Profile updated successfully.");
    } catch (error) {
      setResponseMessage(
        error.response?.data?.message || "Failed to update profile."
      );
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>

      {!isProfileLoaded ? (
        <p>Loading profile...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Occupation:</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Nationality:</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Update Profile</button>
        </form>
      )}

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default ProfileEdit;
