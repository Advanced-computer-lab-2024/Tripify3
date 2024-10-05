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
  });

  const [newPicture, setNewPicture] = useState("");
  const [newOpeningHour, setNewOpeningHour] = useState({ day: "", from: "", to: "" });
  const [newTag, setNewTag] = useState("");

  const [showAddOpeningHour, setShowAddOpeningHour] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);
  const [showAddPicture, setShowAddPicture] = useState(false);

  const daysOfWeek = [
    "Monday", 
    "Tuesday", 
    "Wednesday", 
    "Thursday", 
    "Friday", 
    "Saturday", 
    "Sunday"
  ];

  // Fetch place data to edit
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/governor/${id}`)
      .then((response) => {
        setPlace(response.data.data.place);
      })
      .catch((err) => {
        console.error("Error fetching place data:", err);
      });
  }, [id]);

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
    console.log(place)
    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/governor/${id}`, place)
      .then((response) => {
        console.log("Place updated:", response.data);
        navigate(`/governor/${id}`);
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

  // Handle adding new opening hour
  const handleAddOpeningHour = () => {
    setPlace((prevPlace) => ({
      ...prevPlace,
      openingHours: [...prevPlace.openingHours, newOpeningHour],
    }));
    setNewOpeningHour({ day: "", from: "", to: "" }); // Clear input after adding
    setShowAddOpeningHour(false); // Hide the input field
  };

  // Handle adding new tag
  const handleAddTag = () => {
    if (newTag.trim() !== "") { 
      axios.post(`${process.env.REACT_APP_API_BASE_URL}/governor/createTag`, { name: newTag })
        .then((response) => {
          console.log("Tag created:", response);
          if (response.data && response.data.data && response.data.data.tag) {
            setPlace((prevPlace) => ({
              ...prevPlace,
              tags: [...prevPlace.tags, response.data.data.tag], // Use the tag from the response
            }));
            console.log("Place after adding tag:", place);
          }
        })
        .catch((err) => {
          console.log(err);
          // Optionally handle the error and provide user feedback
        });
        
      // Clear input after adding
      setNewTag(""); 
      setShowAddTag(false); // Hide the input field
    }
  };

  // Handle removing a picture
  const handleRemovePicture = (index) => {
    setPlace((prevPlace) => ({
      ...prevPlace,
      pictures: prevPlace.pictures.filter((_, i) => i !== index),
    }));
  };

  // Handle removing an opening hour
  const handleRemoveOpeningHour = (index) => {
    setPlace((prevPlace) => ({
      ...prevPlace,
      openingHours: prevPlace.openingHours.filter((_, i) => i !== index),
    }));
  };

  // Handle removing a tag
  const handleRemoveTag = (index) => {
    setPlace((prevPlace) => ({
      ...prevPlace,
      tags: prevPlace.tags.filter((_, i) => i !== index),
    }));
  };

  // Handle input change for new opening hour
  const handleOpeningHourChange = (e) => {
    const { name, value } = e.target;
    setNewOpeningHour((prevHour) => ({
      ...prevHour,
      [name]: value,
    }));
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
          />
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
          <label>Foreigner Ticket</label>
          <input
            type="number"
            name="ticketPrices.foreigner"
            value={place.ticketPrices.foreigner}
            onChange={(e) =>
              setPlace({
                ...place,
                ticketPrices: {
                  ...place.ticketPrices,
                  foreigner: e.target.value,
                },
              })
            }
          />
          <label>Native Ticket</label>
          <input
            type="number"
            name="ticketPrices.native"
            value={place.ticketPrices.native}
            onChange={(e) =>
              setPlace({
                ...place,
                ticketPrices: { ...place.ticketPrices, native: e.target.value },
              })
            }
          />
          <label>Student Ticket</label>
          <input
            type="number"
            name="ticketPrices.student"
            value={place.ticketPrices.student}
            onChange={(e) =>
              setPlace({
                ...place,
                ticketPrices: { ...place.ticketPrices, student: e.target.value },
              })
            }
          />
        </div>

        {/* Tags */}
        <div>
          <h3>Tags</h3>
          {place.tags.length > 0 ? (
            <ul>
              {place.tags.map((tag, index) => (
                <li key={index}>
                  <span>{tag.name}</span>
                  <button type="button" onClick={() => handleRemoveTag(index)}>Remove</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tags added.</p>
          )}
          {showAddTag ? (
            <div>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="New Tag"
              />
              <button type="button" onClick={handleAddTag}>Add Tag</button>
              <button type="button" onClick={() => setShowAddTag(false)}>Cancel</button>
            </div>
          ) : (
            <button type="button" onClick={() => setShowAddTag(true)}>Add Tag</button>
          )}
        </div>

        {/* Pictures */}
        <div>
          <h3>Pictures</h3>
          {place.pictures.length > 0 ? (
            <ul>
              {place.pictures.map((picture, index) => (
                <li key={index}>
                  <input
                    type="text"
                    value={picture}
                    onChange={(e) => {
                      const updatedPictures = [...place.pictures];
                      updatedPictures[index] = e.target.value;
                      setPlace({ ...place, pictures: updatedPictures });
                    }}
                  />
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
                placeholder="New Picture URL"
              />
              <button type="button" onClick={handleAddPicture}>Add Picture</button>
              <button type="button" onClick={() => setShowAddPicture(false)}>Cancel</button>
            </div>
          ) : (
            <button type="button" onClick={() => setShowAddPicture(true)}>Add Picture</button>
          )}
        </div>

        <button type="submit">Update Place</button>
      </form>
    </div>
  );
}

export default EditPlace;
