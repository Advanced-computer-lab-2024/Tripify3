import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceForm = () => {
  const navigate = useNavigate();

  // State for each field in the place schema
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pictures, setPictures] = useState([""]); // Allow multiple pictures
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [ticketPrices, setTicketPrices] = useState({
    foreigner: "",
    native: "",
    student: "",
  });
  const [tags, setTags] = useState([]); // Initialize as an empty array
  const [openingHours, setOpeningHours] = useState([]);
  const [newOpeningHour, setNewOpeningHour] = useState({
    day: "",
    from: "",
    to: "",
  });
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleOpeningHoursChange = (index, field, value) => {
    const updatedOpeningHours = [...openingHours];
    updatedOpeningHours[index][field] = value;
    setOpeningHours(updatedOpeningHours);
  };

  const addOpeningHour = () => {
    if (newOpeningHour.day && newOpeningHour.from && newOpeningHour.to) {
      setOpeningHours([...openingHours, newOpeningHour]); // Add new opening hour
      setNewOpeningHour({ day: "", from: "", to: "" }); // Clear the input for next entry
    } else {
      setError("Please fill in all fields for opening hours.");
    }
  };

  const removeOpeningHour = (index) => {
    const updatedOpeningHours = openingHours.filter((_, i) => i !== index);
    setOpeningHours(updatedOpeningHours);
  };

  // Handler functions for form submission, inputs, etc.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (openingHours.length === 0) {
      setError("Please add at least one opening hour.");
      return;
    }

    // Create an object that matches the schema structure
    const newPlace = {
      name,
      description,
      pictures,
      location: {
        address,
        city,
        country,
      },
      openingHours,
      ticketPrices,
      tags,
    };
    console.log("New Place Payload:", newPlace);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/governor/addPlace`,
        newPlace
      );
      console.log("Backend Response:", response.data);
      navigate('/governor/placeslist')
    } catch (e) {
      console.error("Error submitting form:", e);
    }
  };

  const handleTagChange = (index, value) => {
    const updatedTags = [...tags];
    updatedTags[index] = value; // Update the specific tag
    setTags(updatedTags);
  };

  const addTag = () => {
    if (newTag.trim() !== "") {
      setTags([...tags, newTag.trim()]); // Add the new tag to the array
      setNewTag(""); // Clear the input field
    }
  };

  const removeTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index); // Remove the tag by index
    setTags(updatedTags);
  };

  const handlePictureChange = (index, value) => {
    const updatedPictures = [...pictures];
    updatedPictures[index] = value; // Update the specific picture URL
    setPictures(updatedPictures);
  };

  const addPicture = () => {
    setPictures([...pictures, ""]); // Add an empty string for a new picture URL input
  };

  const handleTicketPriceChange = (e) => {
    setTicketPrices({
      ...ticketPrices,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="form-container">
      <h2>Add New Place</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Place Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter place name"
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            required
          />
        </div>
        {pictures.map((picture, index) => (
          <div key={index} className="form-group">
            <label>Picture URL</label>
            <input
              type="text"
              value={picture}
              onChange={(e) => handlePictureChange(index, e.target.value)}
              placeholder="Enter picture URL"
            />
            <button type="button" onClick={addPicture}>
              Add Another Picture
            </button>
          </div>
        ))}
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
            required
          />
        </div>
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            required
          />
        </div>
        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter country"
            required
          />
        </div>
        <div className="form-group">
          <h3>Opening Hours</h3>
          {openingHours.length > 0 &&
            openingHours.map((hour, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <input
                  type="text"
                  value={hour.day}
                  onChange={(e) =>
                    handleOpeningHoursChange(index, "day", e.target.value)
                  }
                  placeholder="Day"
                  style={{ marginRight: "5px" }}
                />
                <input
                  type="time"
                  value={hour.from}
                  onChange={(e) =>
                    handleOpeningHoursChange(index, "from", e.target.value)
                  }
                  placeholder="From"
                  style={{ marginRight: "5px" }}
                />
                <input
                  type="time"
                  value={hour.to}
                  onChange={(e) =>
                    handleOpeningHoursChange(index, "to", e.target.value)
                  }
                  placeholder="To"
                  style={{ marginRight: "5px" }}
                />
                <button type="button" onClick={() => removeOpeningHour(index)}>
                  Remove
                </button>
              </div>
            ))}
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            <select
              value={newOpeningHour.day}
              onChange={(e) =>
                setNewOpeningHour({ ...newOpeningHour, day: e.target.value })
              }
              style={{ marginRight: "5px" }}
            >
              <option value="">Select day</option>
              {daysOfWeek
                .filter((day) => !openingHours.some((oh) => oh.day === day)) // Exclude already selected days
                .map((day, index) => (
                  <option key={index} value={day}>
                    {day}
                  </option>
                ))}
            </select>
            <input
              type="time"
              value={newOpeningHour.from}
              onChange={(e) =>
                setNewOpeningHour({ ...newOpeningHour, from: e.target.value })
              }
              placeholder="From"
              style={{ marginRight: "5px" }}
            />
            <input
              type="time"
              value={newOpeningHour.to}
              onChange={(e) =>
                setNewOpeningHour({ ...newOpeningHour, to: e.target.value })
              }
              placeholder="To"
              style={{ marginRight: "5px" }}
            />
            <button type="button" onClick={addOpeningHour}>
              Add Day
            </button>
          </div>
        </div>

        {/* Ticket Prices */}
        <div className="form-group">
          <label>Ticket Prices</label>
          <div>
            <label>Foreigner</label>
            <input
              type="number"
              name="foreigner"
              value={ticketPrices.foreigner}
              onChange={handleTicketPriceChange}
              placeholder="Enter price for foreigners"
              required
            />
          </div>
          <div>
            <label>Native</label>
            <input
              type="number"
              name="native"
              value={ticketPrices.native}
              onChange={handleTicketPriceChange}
              placeholder="Enter price for natives"
              required
            />
          </div>
          <div>
            <label>Student</label>
            <input
              type="number"
              name="student"
              value={ticketPrices.student}
              onChange={handleTicketPriceChange}
              placeholder="Enter price for students"
              required
            />
          </div>
        </div>

        {/* Tags */}
        <div className="form-group">
          <label>Tags</label>
          {tags.map((tag, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                placeholder="Enter tag"
              />
              <button type="button" onClick={() => removeTag(index)}>
                Remove
              </button>
            </div>
          ))}
          <div>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter a new tag"
            />
            <button type="button" onClick={addTag}>
              Add Tag
            </button>
          </div>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PlaceForm;
