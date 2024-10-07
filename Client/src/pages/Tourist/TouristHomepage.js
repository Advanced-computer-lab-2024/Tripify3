import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { getProfile, updateProfile } from "../../services/tourist.js"; // Import the API functions
import { getUserId } from "../../utils/authUtils.js";

const TouristHomePage = () => {
  const userId = getUserId(); // Replace with dynamic user ID as necessary
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    nationality: "",
    birthDate: "",
    occupation: "",
  });

  const countries = [
    "USA",
    "Canada",
    "UK",
    "Germany",
    "France",
    "Australia",
    "Egypt",
    "Italy",
    "Spain",
    "Brazil",
    "Argentina",
    "Mexico",
    "India",
    "China",
    "Japan",
    "South Korea",
    "Russia",
    "South Africa",
    "Nigeria",
    "Kenya",
    "Turkey",
    "Saudi Arabia",
    "United Arab Emirates",
    "Sweden",
    "Norway",
    "Finland",
    "Denmark",
    "Netherlands",
    "Belgium",
    "Switzerland",
    "Austria",
    "Greece",
    "Portugal",
    "Czech Republic",
    "Ireland",
    "Iceland",
    "Palestine",
    "Chile",
    "Colombia",
    "Peru",
    "Panama",
    "Costa Rica",
    "Cuba",
    "Honduras",
    "El Salvador",
    "Paraguay",
    
  ];

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(userId);
        setUserProfile(response.data.userProfile);
        // Initialize formData with fetched profile data
        setFormData({
          phoneNumber: response.data.userProfile.phoneNumber,
          nationality: response.data.userProfile.nationality,
          birthDate: response.data.userProfile.birthDate,
          occupation: response.data.userProfile.occupation,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile(userId, formData);
      setUserProfile(response.data.userProfile); // Update local userProfile with the new data
      setIsEditing(false); // Stop editing mode
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Render profile card and edit form
  return (
    <div>
      <h1>Tourist Homepage</h1>

      {/* Profile Card */}
      {userProfile && (
        <div className="profile-card" style={{ border: "1px solid #ccc", padding: "20px", margin: "20px 0", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <h2>Profile</h2>
          <p>
            <strong>Username:</strong> {userProfile.username}
          </p>
          <p>
            <strong>Email:</strong> {userProfile.email}
          </p>
          <p>
            <strong>Phone Number:</strong>
            {isEditing ? (
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", margin: "5px 0", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            ) : (
              userProfile.phoneNumber
            )}
          </p>
          <p>
            <strong>Nationality:</strong>
            {isEditing ? (
              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", margin: "5px 0", borderRadius: "4px", border: "1px solid #ccc" }}
              >
                <option value="">Select your nationality</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            ) : (
              userProfile.nationality
            )}
          </p>
          <p>
            <strong>Birth Date:</strong>
            {isEditing ? (
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", margin: "5px 0", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            ) : (
              userProfile.birthDate
            )}
          </p>
          <p>
            <strong>Occupation:</strong>
            {isEditing ? (
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", margin: "5px 0", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            ) : (
              userProfile.occupation
            )}
          </p>
          {isEditing ? (
            <button onClick={handleSubmit} style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Save
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} style={{ padding: "10px 20px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Edit Profile
            </button>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-around", margin: "20px 0" }}>
        {["Activities", "Itineraries", "HistoricalPlaces", "Products"].map((text) => (
          <button key={text} style={{ padding: "15px 30px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            <Link to={`/tourist/${text.toLowerCase().replace(" ", "-")}`} style={{ textDecoration: "none", color: "white" }}>
              {text}
            </Link>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TouristHomePage;
