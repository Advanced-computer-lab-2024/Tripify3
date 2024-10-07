import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUserId } from "../../utils/authUtils.js";

function AddPlace() {
  const navigate = useNavigate();
  const userId = getUserId();
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
    type: "",
  });

  const [newPicture, setNewPicture] = useState("");
  const [newOpeningHour, setNewOpeningHour] = useState({ day: "", from: "", to: "" });
  const [newTagIds, setNewTagIds] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [placeTypes, setPlaceTypes] = useState([]);

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
    setPlaceTypes(["Monument", "Religious Site", "Palace", "Historical Place", "Museum"]);
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("ticketPrices.")) {
      const ticketType = name.split(".")[1]; // Extract the type (foreigner, native, student)
      setPlace((prevPlace) => ({
        ...prevPlace,
        ticketPrices: {
          ...prevPlace.ticketPrices,
          [ticketType]: value,
        },
      }));
    } else {
      setPlace((prevPlace) => ({
        ...prevPlace,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/governor/addPlace`, {
        ...place,
        tags: newTagIds,
        tourismGovernor: userId
      })
      .then((response) => {
        console.log("Place added:", response.data);
        navigate(`/governor`);
      })
      .catch((err) => {
        console.error("Error adding place:", err);
      });
  };

  // Handle adding new picture
  const handleAddPicture = () => {
    setPlace((prevPlace) => ({
      ...prevPlace,
      pictures: [...prevPlace.pictures, newPicture],
    }));
    setNewPicture("");
    setShowAddPicture(false);
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
        return prevIds.filter((id) => id !== tagId);
      } else {
        return [...prevIds, tagId];
      }
    });
  };

  // Handle opening hour change
  const handleOpeningHourChange = (e) => {
    const { name, value } = e.target;
    setNewOpeningHour((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle adding new opening hour
  const handleAddOpeningHour = () => {
    setPlace((prevPlace) => ({
      ...prevPlace,
      openingHours: [...prevPlace.openingHours, newOpeningHour],
    }));
    setNewOpeningHour({ day: "", from: "", to: "" });
    setShowAddOpeningHour(false);
  };

  // Handle removing an opening hour
  const handleRemoveOpeningHour = (index) => {
    setPlace((prevPlace) => ({
      ...prevPlace,
      openingHours: prevPlace.openingHours.filter((_, i) => i !== index),
    }));
  };

  // Get available days for the dropdown
  const getAvailableDays = () => {
    const selectedDays = place.openingHours.map((hour) => hour.day);
    return daysOfWeek.filter((day) => !selectedDays.includes(day));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Place</h2>
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
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
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
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
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
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
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
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
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
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
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
                value={newOpeningHour.from}
                onChange={handleOpeningHourChange}
                required
              />
              <input
                type="time"
                name="to"
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
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
          />
          <label>Native</label>
          <input
            type="text"
            name="ticketPrices.native"
            value={place.ticketPrices.native}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
          />
          <label>Student</label>
          <input
            type="text"
            name="ticketPrices.student"
            value={place.ticketPrices.student}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
          />
        </div>

        {/* Pictures */}
        <div>
          <h3>Pictures</h3>
          {place.pictures.length > 0 ? (
            <ul>
              {place.pictures.map((picture, index) => (
                <li key={index}>
                  <span>{picture}</span>
                  <button type="button" onClick={() => handleRemovePicture(index)}>Remove</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pictures added.</p>
          )}
          {showAddPicture ? (
            <div>
              <input
                type="text"
                value={newPicture}
                onChange={(e) => setNewPicture(e.target.value)}
                placeholder="Picture URL"
                required
              />
              <button type="button" onClick={handleAddPicture}>Add Picture</button>
              <button type="button" onClick={() => setShowAddPicture(false)}>Cancel</button>
            </div>
          ) : (
            <button type="button" onClick={() => setShowAddPicture(true)}>Add Picture</button>
          )}
        </div>

        {/* Tags */}
        <div>
          <h3>Tags</h3>
          {availableTags.map((tag) => (
            <div key={tag._id}>
              <label>
                <input
                  type="checkbox"
                  checked={newTagIds.includes(tag._id)}
                  onChange={() => handleTagChange(tag._id)}
                />
                {tag.name}
              </label>
            </div>
          ))}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddPlace;
