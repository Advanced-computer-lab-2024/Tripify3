import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";

const Itinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const [newItinerary, setNewItinerary] = useState({
    activities: [],
    locations: [],
    price: "",
    budget: "",
    language: "",
    timeline: {
      startTime: "",
      endTime: "",
    },
    availableDates: [],
    pickupLocation: "",
    dropoffLocation: "",
    accessibility: "",
    preferences: [],
    bookings: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [availableDatesInput, setAvailableDatesInput] = useState({
    date: "",
    times: "",
  });
  const [newActivity, setNewActivity] = useState({
    name: "",
    description: "",
    duration: "",
    date: "",
  });
  const [selectedItineraryId, setSelectedItineraryId] = useState([]);

  const preferencesOptions = [
    "Historical Area",
    "Beaches",
    "Family Friendly",
    "Shopping",
  ];

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const response = await fetch("http://localhost:8000/itinerary/get");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setItineraries(
        data.map((itinerary) => ({
          ...itinerary,
          bookingsCount: itinerary.bookings ? itinerary.bookings.length : 0,
        }))
      );
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "startTime" || name === "endTime") {
      setNewItinerary((prevState) => ({
        ...prevState,
        timeline: {
          ...prevState.timeline,
          [name]: value,
        },
      }));
    } else if (name === "preferences") {
      const selectedPreferences = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setNewItinerary((prevState) => ({
        ...prevState,
        preferences: selectedPreferences,
      }));
    } else {
      setNewItinerary((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleAddAvailableDate = () => {
    if (availableDatesInput.date && availableDatesInput.times) {
      setNewItinerary((prevState) => ({
        ...prevState,
        availableDates: [...prevState.availableDates, availableDatesInput],
      }));
      setAvailableDatesInput({ date: "", times: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && currentId) {
        await axios.put(
          `http://localhost:8000/itinerary/update/${currentId}`,
          newItinerary
        );
      } else {
        await axios.post(
          "http://localhost:8000/itinerary/create",
          newItinerary
        );
      }
      fetchItineraries();
      closeModal();
    } catch (error) {
      console.error(
        "Error saving itinerary:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleEdit = (itinerary) => {
    setNewItinerary(itinerary);
    setEditMode(true);
    setCurrentId(itinerary._id);
    openModal();
  };

  const handleDelete = async (id, hasBookings) => {
    if (hasBookings) {
      alert(
        "This itinerary cannot be deleted because there are existing bookings."
      );
      return;
    }

    if (window.confirm("Are you sure you want to delete this itinerary?")) {
      try {
        await axios.delete(`http://localhost:8000/itinerary/delete/${id}`);
        fetchItineraries();
      } catch (error) {
        console.error(
          "Error deleting itinerary:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewItinerary({
      activities: [],
      locations: [],
      price: "",
      budget: "",
      language: "",
      timeline: { startTime: "", endTime: "" },
      availableDates: [],
      pickupLocation: "",
      dropoffLocation: "",
      accessibility: "",
      preferences: [],
      bookings: [],
    });
    setAvailableDatesInput({ date: "", times: "" });
    setEditMode(false);
  };

  const openActivityModal = (itineraryId) => {
    setSelectedItineraryId(itineraryId);
    setNewActivity({ name: "", description: "", duration: "", date: "" });
    setIsActivityModalOpen(true);
  };

  const closeActivityModal = () => {
    setIsActivityModalOpen(false);
    setNewActivity({ name: "", description: "", duration: "", date: "" });
  };

  const handleSubmitActivity = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8000/itinerary/${selectedItineraryId}/addActivity`,
        newActivity
      );
      closeActivityModal();
      fetchItineraries();
    } catch (error) {
      console.error(
        "Error adding activity:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div>
      <style>
        {`
          /* General styles */
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
          }

          h1, h2 {
              color: #333;
          }

          /* Itinerary management styles */
          .add-itinerary-btn {
              background-color: #4CAF50; /* Green */
              color: white;
              padding: 10px 15px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              margin-bottom: 20px;
              font-size: 16px;
          }

          .add-itinerary-btn:hover {
              background-color: #45a049;
          }

          /* Itinerary list styles */
          ul {
              list-style-type: none;
              padding: 0;
          }

          li {
              background-color: white;
              margin: 10px 0;
              padding: 15px;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }

          h3 {
              margin: 0 0 10px 0;
          }

          /* Button styles for edit and delete */
          button {
              background-color: #007BFF; /* Blue */
              color: white;
              padding: 8px 12px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              margin-right: 10px;
          }

          button:hover {
              background-color: #0056b3;
          }

          /* Modal styles */
          .ReactModal__Overlay {
              background: rgba(0, 0, 0, 0.75);
          }

          .ReactModal__Content {
              background: white;
              border-radius: 8px;
              padding: 20px;
              max-width: 600px;
              margin: auto;
          }

          input[type="text"],
          input[type="number"],
          input[type="datetime-local"],
          select {
              width: 100%;
              padding: 10px;
              margin: 10px 0;
              border: 1px solid #ccc;
              border-radius: 5px;
          }

          input[type="text"]:focus,
          input[type="number"]:focus,
          input[type="datetime-local"]:focus,
          select:focus {
              border-color: #007BFF;
              outline: none;
          }

          button[type="submit"],
          button[type="button"] {
              width: 100%;
              margin-top: 10px;
          }
        `}
      </style>

      <h1>Itinerary Management</h1>

      <button className="add-itinerary-btn" onClick={openModal}>
        Add New Itinerary
      </button>

      <h2>Existing Itineraries</h2>
      <ul>
        {itineraries.map((itinerary) => (
          <li key={itinerary._id}>
            <h3>Language: {itinerary.language}</h3>
            <p>Price: ${itinerary.price}</p>
            <p>Budget: ${itinerary.budget}</p>
            <p>Pickup Location: {itinerary.pickupLocation}</p>
            <p>Dropoff Location: {itinerary.dropoffLocation}</p>
            <p>Accessibility: {itinerary.accessibility}</p>
            <p>Bookings Count: {itinerary.bookingsCount}</p>
            <button onClick={() => handleEdit(itinerary)}>Edit</button>
            <button onClick={() => handleDelete(itinerary._id, itinerary.bookings.length > 0)}>Delete</button>
            <button onClick={() => openActivityModal(itinerary._id)}>Add Activity</button>
          </li>
        ))}
      </ul>

      {/* Modal for adding/editing itineraries */}
      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
        <h2>{editMode ? "Edit Itinerary" : "Add Itinerary"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Language:
            <input
              type="text"
              name="language"
              value={newItinerary.language}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={newItinerary.price}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Budget:
            <input
              type="number"
              name="budget"
              value={newItinerary.budget}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Pickup Location:
            <input
              type="text"
              name="pickupLocation"
              value={newItinerary.pickupLocation}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Dropoff Location:
            <input
              type="text"
              name="dropoffLocation"
              value={newItinerary.dropoffLocation}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Accessibility:
            <input
              type="text"
              name="accessibility"
              value={newItinerary.accessibility}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Start Time:
            <input
              type="datetime-local"
              name="startTime"
              value={newItinerary.timeline.startTime}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            End Time:
            <input
              type="datetime-local"
              name="endTime"
              value={newItinerary.timeline.endTime}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Preferences:
            <select
              name="preferences"
              multiple
              value={newItinerary.preferences}
              onChange={handleChange}
            >
              {preferencesOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <div>
            <h3>Available Dates</h3>
            <input
              type="date"
              value={availableDatesInput.date}
              onChange={(e) =>
                setAvailableDatesInput({
                  ...availableDatesInput,
                  date: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Times (comma separated)"
              value={availableDatesInput.times}
              onChange={(e) =>
                setAvailableDatesInput({
                  ...availableDatesInput,
                  times: e.target.value,
                })
              }
            />
            <button type="button" onClick={handleAddAvailableDate}>
              Add Available Date
            </button>
            <ul>
              {newItinerary.availableDates.map((dateObj, index) => (
                <li key={index}>
                  {dateObj.date} - {dateObj.times}
                </li>
              ))}
            </ul>
          </div>
          <button type="submit">{editMode ? "Update" : "Create"}</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </form>
      </Modal>

      {/* Modal for adding activities */}
      <Modal isOpen={isActivityModalOpen} onRequestClose={closeActivityModal}>
        <h2>Add Activity</h2>
        <form onSubmit={handleSubmitActivity}>
          <label>
            Name:
            <input
              type="text"
              value={newActivity.name}
              onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
              required
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={newActivity.description}
              onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
              required
            />
          </label>
          <label>
            Duration:
            <input
              type="text"
              value={newActivity.duration}
              onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
              required
            />
          </label>
          <label>
            Date:
            <input
              type="date"
              value={newActivity.date}
              onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
              required
            />
          </label>
          <button type="submit">Add Activity</button>
          <button type="button" onClick={closeActivityModal}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default Itinerary;
