import React, { useState, useEffect } from "react";
import axios from "axios";

const ItineraryManager = () => {
  const [itineraries, setItineraries] = useState([]);
  const [activities, setActivities] = useState([]); // To store activities for dropdown
  const [places, setPlaces] = useState([]);
  const [formData, setFormData] = useState({
    language: "",
    name: "",
    price: 0,
    startTime: "",
    endTime: "",
    pickupLocation: "",
    dropoffLocation: "",
    accessibility: "",
    preferences: "",
    availableDates: [],
    bookings: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [newAvailableDate, setNewAvailableDate] = useState({ date: "", startTime: "", endTime: "" });
  const [selectedActivities, setSelectedActivities] = useState([]); // To hold selected activities
  const [selectedPlaces, setSelectedPlaces] = useState([]); // To hold selected locations

  useEffect(() => {
    fetchItineraries();
    fetchActivities(); // Fetch activities when component mounts
    fetchPlaces();
  }, []);

  const fetchItineraries = async () => {
    try {
      const response = await axios.get("http://localhost:8000/itinerary/get");
      console.log(response.data);
      setItineraries(response.data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:8000/activity/get"); // Adjust the URL based on your backend endpoint
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchPlaces = async () => {
    try {
      const response = await axios.get("http://localhost:8000/places/get"); // Adjust the URL based on your backend endpoint
      setPlaces(response.data.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation for start and end time
    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      alert("Start time must be before the end time.");
      return;
    }

    // Ensure at least one available date is selected
    if (formData.availableDates.length === 0) {
      alert("Please add at least one available date before submitting.");
      return;
    }

    const dataToSubmit = {
      ...formData,
      activities: selectedActivities, // Add selected activities
      places: selectedPlaces, // Add selected locations
      timeline: {
        startTime: formData.startTime,
        endTime: formData.endTime,
      },
    };

    console.log("Data to Submit:", dataToSubmit);

    if (editingId) {
      axios
        .put(`http://localhost:8000/itinerary/update/${editingId}`, dataToSubmit)
        .then(() => {
          setEditingId(null);
          resetForm();
          fetchItineraries();
        })
        .catch((error) => {
          console.error("Error updating itinerary:", error.response?.data || error.message);
        });
    } else {
      axios
        .post("http://localhost:8000/itinerary/create", dataToSubmit)
        .then(() => {
          resetForm();
          fetchItineraries();
        })
        .catch((error) => {
          console.error("Error adding itinerary:", error.response?.data || error.message);
        });
    }
  };

  const resetForm = () => {
    setFormData({
      language: "",
      name: "",
      price: 0,
      startTime: "",
      endTime: "",
      pickupLocation: "",
      dropoffLocation: "",
      accessibility: "",
      preferences: "",
      availableDates: [],
      bookings: [], // Reset bookings if needed
    });
    setNewAvailableDate({ date: "", startTime: "", endTime: "" });
    setSelectedActivities([]); // Reset selected activities to an empty array
    setSelectedPlaces([]); // Reset selected locations to an empty array
  };

  const handleEdit = (itinerary) => {
    setEditingId(itinerary._id);
    const formatDateForInput = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16); // Format to 'YYYY-MM-DDTHH:mm'
    };
    console.log(itinerary.timeline.startTime);
    console.log(itinerary.timeline.endTime);
    setFormData({
      language: itinerary.language,
      name: itinerary.name,
      price: itinerary.price,
      startTime: formatDateForInput(itinerary.timeline.startTime), // Format startTime
      endTime: formatDateForInput(itinerary.timeline.endTime), // Format endTime
      pickupLocation: itinerary.pickupLocation,
      dropoffLocation: itinerary.dropoffLocation,
      accessibility: itinerary.accessibility,
      preferences: itinerary.preferences,
      availableDates: itinerary.availableDates,
      bookings: itinerary.bookings, // Include bookings if needed
    });
    setSelectedActivities(itinerary.activities.map((activity) => activity._id)); // Set selected activities for editing
    setSelectedPlaces(itinerary.places.map((place) => place._id)); // Set selected locations for editing
  };

  const handleDelete = async (id, hasBookings) => {
    if (hasBookings) {
      alert("This itinerary cannot be deleted because there are existing bookings.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this itinerary?")) {
      try {
        await axios.delete(`http://localhost:8000/itinerary/delete/${id}`);
        fetchItineraries();
      } catch (error) {
        console.error("Error deleting itinerary:", error.response ? error.response.data : error.message);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvailableDateChange = (e) => {
    setNewAvailableDate({ ...newAvailableDate, [e.target.name]: e.target.value });
  };

  const handleAddAvailableDate = () => {
    // Validation to ensure start time is before end time in available dates
    if (newAvailableDate.startTime >= newAvailableDate.endTime) {
      alert("Available date start time must be before the end time.");
      return;
    }

    if (newAvailableDate.date) {
      setFormData((prev) => ({
        ...prev,
        availableDates: [
          ...prev.availableDates,
          {
            date: newAvailableDate.date,
            times: [newAvailableDate.startTime, newAvailableDate.endTime],
          },
        ],
      }));
      setNewAvailableDate({ date: "", startTime: "", endTime: "" });
    } else {
      alert("Please enter a valid date before adding.");
    }
  };

  const handleDeleteAvailableDate = (index) => {
    const updatedAvailableDates = [...formData.availableDates];
    updatedAvailableDates.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      availableDates: updatedAvailableDates,
    }));
  };

  const handleActivityChange = (e, activityId) => {
    if (e.target.checked) {
      setSelectedActivities([...selectedActivities, activityId]); // Add to selected activities
    } else {
      setSelectedActivities(selectedActivities.filter((id) => id !== activityId)); // Remove from selected activities
    }
  };

  const handlePlaceChange = (e, placeId) => {
    if (e.target.checked) {
      setSelectedPlaces([...selectedPlaces, placeId]); // Add to selected locations
    } else {
      setSelectedPlaces(selectedPlaces.filter((id) => id !== placeId)); // Remove from selected locations
    }
  };

  return (
    <div>
      <style>
        {`
          /* styles/TourGuideItinerary.css */

body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
}

h1, h2, h3, h4 {
    color: #333;
}

h1 {
    text-align: center;
    margin: 20px 0;
}

form {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 20px auto;
}

label {
    display: block;
    margin: 10px 0 5px;
}

input[type="text"],
input[type="number"],
input[type="datetime-local"],
input[type="date"],
input[type="time"],
select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box; /* Ensures padding is included in total width */
}

input[type="text"]:focus,
input[type="number"]:focus,
input[type="datetime-local"]:focus,
input[type="date"]:focus,
input[type="time"]:focus,
select:focus {
    border-color: #007BFF; /* Highlight on focus */
    outline: none;
}

button {
    background-color: #007BFF;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}

button:hover {
    background-color: #0056b3; /* Darken on hover */
}

h2 {
    text-align: center;
    margin: 30px 0 20px;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    background: #fff;
    margin: 10px 0;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

li h3 {
    margin: 0;
}

li button {
    margin-right: 10px;
}


/* Container for each checkbox and label */
.checkbox-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

/* Custom checkbox styling */
.custom-checkbox {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #007bff; /* Border color */
  border-radius: 4px; /* Rounded corners */
  margin-right: 8px;
  cursor: pointer;
  outline: none;
  position: relative;
  background-color: white;
}

/* Checkmark for the custom checkbox */
.custom-checkbox:checked::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 5px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  background-color: #007bff;
}

/* Change background color on checked */
.custom-checkbox:checked {
  background-color: #007bff;
  border-color: #007bff;
}

/* Label styling */
.checkbox-container label {
  cursor: pointer;
  font-size: 16px;
}

  

  
        `}
      </style>

      <h1>Itinerary Manager</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Language:
          <select name="language" value={formData.language} onChange={handleChange} required>
            <option value="">Select Language</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Arabic">Arabic</option>
            <option value="Russian">Russian</option>
            <option value="Japanese">Japanese</option>
            <option value="Korean">Korean</option>
            <option value="Italian">Italian</option>
          </select>
        </label>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Price:
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </label>
        <label>
          Start Time:
          <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} required />
        </label>
        <label>
          End Time:
          <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} required />
        </label>

        <label>
          Pickup Location:
          <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required />
        </label>
        <label>
          Dropoff Location:
          <input type="text" name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} required />
        </label>
        <label>
          Accessibility:
          <input type="text" name="accessibility" value={formData.accessibility} onChange={handleChange} required />
        </label>
        {/* <label>
          Preferences:
          <select name="preferences" value={formData.preferences} onChange={handleChange} required>
            <option value="">Select Preference</option>
            <option value="Historical Area">Historical Area</option>
            <option value="Beaches">Beaches</option>
            <option value="Family Friendly">Family Friendly</option>
            <option value="Shopping">Shopping</option>
          </select>
        </label> */}

        <h4>Add Available Dates</h4>
        <label>
          Date:
          <input type="date" name="date" value={newAvailableDate.date} onChange={handleAvailableDateChange} />
        </label>
        <label>
          Start Time:
          <input type="time" name="startTime" value={newAvailableDate.startTime} onChange={handleAvailableDateChange} />
        </label>
        <label>
          End Time:
          <input type="time" name="endTime" value={newAvailableDate.endTime} onChange={handleAvailableDateChange} />
        </label>
        <button type="button" onClick={handleAddAvailableDate}>
          Add Available Date
        </button>

        <h4>Current Available Dates:</h4>
        <ul>
          {formData.availableDates.map((date, index) => (
            <li key={index}>
              {new Date(date.date).toISOString().split("T")[0]} (from {date.times[0]} to {date.times[1]})
              <button type="button" onClick={() => handleDeleteAvailableDate(index)}>
                Delete
              </button>
            </li>
          ))}
        </ul>

        <h4>Select Activities:</h4>
        {activities.map((activity) => (
          <div key={activity._id} className="checkbox-container">
            <input
              type="checkbox"
              id={activity._id}
              className="custom-checkbox"
              value={activity._id}
              checked={selectedActivities.includes(activity._id)} // Checks if the activity is already selected
              onChange={(e) => handleActivityChange(e, activity._id)} // Handles the checkbox change
            />
            <label htmlFor={activity._id}>{activity.name}</label>
          </div>
        ))}

        <h4>Select Places:</h4>
        {places.map((place) => (
          <div key={place._id} className="checkbox-container">
            <input
              type="checkbox"
              id={place._id}
              className="custom-checkbox"
              value={place._id}
              checked={selectedPlaces.includes(place._id)} // Check if the location is already selected
              onChange={(e) => handlePlaceChange(e, place._id)} // Handle the checkbox change
            />
            <label htmlFor={place._id}>{place.name}</label>
          </div>
        ))}

        <button type="submit">{editingId ? "Update Itinerary" : "Add Itinerary"}</button>
      </form>

      <h2>All Itineraries</h2>
      <ul>
        {itineraries.map((itinerary) => (
          <li key={itinerary._id}>
            <h3>Language: {itinerary.language}</h3>
            <p>Name: {itinerary.name}</p>
            <p>Price: {itinerary.price}$</p>
            <p>
              Timeline: {itinerary.timeline.startTime} to {itinerary.timeline.endTime}
            </p>

            <p>Pickup Location: {itinerary.pickupLocation}</p>
            <p>Dropoff Location: {itinerary.dropoffLocation}</p>
            <p>Accessibility: {itinerary.accessibility}</p>
            <p>Preferences: {itinerary.preferences}</p>
            <p>Bookings: {itinerary.bookings.length}</p>

            <h4>Available Dates:</h4>
            <ul>
              {itinerary.availableDates.map((date, index) => (
                <li key={index}>
                  {new Date(date.date).toISOString().split("T")[0]} (from {date.times[0]} to {date.times[1]})
                </li>
              ))}
            </ul>

            <h4>Activities:</h4>
            <ul>
              {itinerary.activities.map((activity, index) => (
                <li key={index} className="activity-item">
                  <p>
                    <strong>Name:</strong> {activity.name}
                  </p>
                  <p>
                    <strong>Duration:</strong> {activity.duration} minutes
                  </p>
                  <p>
                    <strong>Rating:</strong> {activity.rating}
                  </p>
                  <p>
                    <strong>Price:</strong> {activity.price}
                  </p>
                </li>
              ))}
            </ul>

            <h4>Tags:</h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {itinerary.tags.map((tag, index) => (
                <li key={index} style={{ display: "inline", marginRight: "10px" }}>
                  #{tag}
                </li>
              ))}
            </ul>

            <h4>Places:</h4>
            <ul>
              {itinerary.places.map((place, index) => (
                <li key={index} className="activity-item">
                  <p>
                    <strong>Name: </strong> {place.name}
                  </p>
                  <p>
                    {" "}
                    <strong> Description: </strong> {place.description}
                  </p>
                </li>
              ))}
            </ul>

            <button onClick={() => handleEdit(itinerary)}>Edit</button>
            <button onClick={() => handleDelete(itinerary._id, itinerary.bookings.length > 0)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItineraryManager;
