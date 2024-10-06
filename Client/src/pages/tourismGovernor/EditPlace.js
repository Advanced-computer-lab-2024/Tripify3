import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditPlace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState({
    name: "",
    description: "",
    pictures: [],
    location: {
      address: "",
      city: "",
      country: "",
    },
    openingHours: [],
    ticketPrices: {
      foreigner: "",
      native: "",
      student: "",
    },
    tags: [],
    type: "", // New state to hold place type
  });

  const [newPicture, setNewPicture] = useState("");
  const [newOpeningHour, setNewOpeningHour] = useState({ day: "", from: "", to: "" });
  const [newTagIds, setNewTagIds] = useState([]); // Store selected tag IDs
  const [availableTags, setAvailableTags] = useState([]); // Store available tags
  const [placeTypes, setPlaceTypes] = useState([]); // Store place types

  const [showAddOpeningHour, setShowAddOpeningHour] = useState(false);
  const [showAddPicture, setShowAddPicture] = useState(false);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Fetch place data to edit
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/governor/getPlace/${id}`)
      .then((response) => {
        if (response.data.status === "succeeded") {
          setPlace(response.data.data.place);
          setNewTagIds(response.data.data.place.tags.map(tag => tag._id));
          // Optionally set place type from the response
          setPlace(prevPlace => ({
            ...prevPlace,
            type: response.data.data.place.type
          }));
        }
      })
      .catch((err) => {
        console.error("Error fetching place data:", err);
      });
  }, [id]);

  // Fetch available tags
  useEffect(() => {
    axios
      .get("http://localhost:8000/getTags")
      .then((response) => {
        if (response.data.message === "Tags retrieved successfully") {
          setAvailableTags(response.data.tags);
        }
      })
      .catch((err) => {
        console.error("Error fetching tags:", err);
      });
  }, []);

  // Fetch available place types
  useEffect(() => {
    // Assuming you fetch place types from the same or another API
    // Here we're assuming the types are hard-coded as per your request
    setPlaceTypes(["Historical Place", "Museum"]);
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlace((prevPlace) => ({
      ...prevPlace,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(place);
    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/governor/${id}`, {
        ...place,
        tags: newTagIds, // Send the selected tag IDs
      })
      .then((response) => {
        console.log("Place updated:", response.data);
        navigate(`/governor`);
      })
      .catch((err) => {
        console.error("Error updating place:", err);
      });
  };

  // Handle adding new picture
  const handleAddPicture = () => {
    setPlace((prevPlace) => ({
      ...prevPlace,
      pictures: [...prevPlace.pictures, newPicture],
    }));
    setNewPicture(""); // Clear input after adding
    setShowAddPicture(false); // Hide the input field
  };

  // Handle removing a picture
  const handleRemovePicture = (index) => {
    setPlace((prevPlace) => ({
      ...prevPlace,
      pictures: prevPlace.pictures.filter((_, i) => i !== index),
    }));
  };

  // Handle checkbox change for tags
  const handleTagChange = (tagId) => {
    setNewTagIds((prevIds) => {
      if (prevIds.includes(tagId)) {
        return prevIds.filter((id) => id !== tagId); // Remove tag ID if already selected
      } else {
        return [...prevIds, tagId]; // Add tag ID if not already selected
      }
    });
  };

  // Get available days for the dropdown
  const getAvailableDays = () => {
    const selectedDays = place.openingHours.map(hour => hour.day);
    return daysOfWeek.filter(day => !selectedDays.includes(day));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Place</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={place.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }} // Style changes
          />
        </div>

        {/* Description */}
        <div>
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={place.description}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }} // Style changes
          />
        </div>

        {/* Place Type Dropdown */}
        <div>
          <label>Place Type</label>
          <select
            name="type"
            value={place.type}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
          >
            <option value="" disabled>Select Place Type</option>
            {placeTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label>Address</label>
          <input
            type="text"
            name="location.address"
            value={place.location.address}
            onChange={(e) =>
              setPlace({
                ...place,
                location: { ...place.location, address: e.target.value },
              })
            }
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }} // Style changes
          />
          <label>City</label>
          <input
            type="text"
            name="location.city"
            value={place.location.city}
            onChange={(e) =>
              setPlace({
                ...place,
                location: { ...place.location, city: e.target.value },
              })
            }
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }} // Style changes
          />
          <label>Country</label>
          <input
            type="text"
            name="location.country"
            value={place.location.country}
            onChange={(e) =>
              setPlace({
                ...place,
                location: { ...place.location, country: e.target.value },
              })
            }
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }} // Style changes
          />
        </div>

        {/* Opening Hours */}
        <div>
          <h3>Opening Hours</h3>
          {place.openingHours.length > 0 ? (
            <ul>
              {place.openingHours.map((hour, index) => (
                <li key={index}>
                  <span>{hour.day}:</span>
                  <span>{hour.from} - {hour.to}</span>
                  <button type="button" onClick={() => handleRemoveOpeningHour(index)}>Remove</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No opening hours added.</p>
          )}
          {showAddOpeningHour ? (
            <div>
              <select
                name="day"
                value={newOpeningHour.day}
                onChange={handleOpeningHourChange}
              >
                <option value="" disabled>Select Day</option>
                {getAvailableDays().map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <input
                type="time"
                name="from"
                placeholder="From"
                value={newOpeningHour.from}
                onChange={handleOpeningHourChange}
                required
              />
              <input
                type="time"
                name="to"
                placeholder="To"
                value={newOpeningHour.to}
                onChange={handleOpeningHourChange}
                required
              />
              <button type="button" onClick={handleAddOpeningHour}>Add Opening Hour</button>
              <button type="button" onClick={() => setShowAddOpeningHour(false)}>Cancel</button>
            </div>
          ) : (
            <button type="button" onClick={() => setShowAddOpeningHour(true)}>Add Opening Hour</button>
          )}
        </div>

        {/* Ticket Prices */}
        <div>
          <h3>Ticket Prices</h3>
          <label>Foreigner</label>
          <input
            type="text"
            name="ticketPrices.foreigner"
            value={place.ticketPrices.foreigner}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }} // Style changes
          />
          <label>Native</label>
          <input
            type="text"
            name="ticketPrices.native"
            value={place.ticketPrices.native}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }} // Style changes
          />
          <label>Student</label>
          <input
            type="text"
            name="ticketPrices.student"
            value={place.ticketPrices.student}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }} // Style changes
          />
        </div>

        {/* Tags */}
        <div>
          <h3>Tags</h3>
          {availableTags.map((tag) => (
            <div key={tag._id}>
              <input
                type="checkbox"
                checked={newTagIds.includes(tag._id)}
                onChange={() => handleTagChange(tag._id)}
              />
              <label>{tag.name}</label>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button type="submit">Update Place</button>
      </form>
    </div>
  );
}

export default EditPlace;
