import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TourGuideItinerary.css';

const ItineraryManager = () => {
  const [itineraries, setItineraries] = useState([]);
  const [activities, setActivities] = useState([]); // To store activities for dropdown
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    language: '',
    price: 0,
    startTime: '',
    endTime: '',
    budget: 0,
    pickupLocation: '',
    dropoffLocation: '',
    accessibility: '',
    preferences: '',
    availableDates: [],
    activities: [], // To hold selected activities
    locations: [],
    bookings: []
  });
  const [editingId, setEditingId] = useState(null);
  const [newAvailableDate, setNewAvailableDate] = useState({ date: '', startTime: '', endTime: '' });
  const [selectedActivity, setSelectedActivity] = useState(''); // State for selected activity
  const [selectedLocation, setSelectedLocation] = useState(''); // State for selected location

  useEffect(() => {
    fetchItineraries();
    fetchActivities(); // Fetch activities when component mounts
    fetchLocations();
  }, []);

  const fetchItineraries = async () => {
    try {
      const response = await axios.get('http://localhost:8000/itinerary/get');
      console.log(response.data);
      setItineraries(response.data);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:8000/activity/get'); // Adjust the URL based on your backend endpoint
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/location/get'); // Adjust the URL based on your backend endpoint
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Ensure at least one available date is selected
    if (formData.availableDates.length === 0) {
      alert("Please add at least one available date before submitting.");
      return;
    }
  
    const dataToSubmit = {
      ...formData,
      timeline: {
        startTime: formData.startTime,
        endTime: formData.endTime
      }
    };
  
    console.log('Data to Submit:', dataToSubmit);
  
    if (editingId) {
      axios.put(`http://localhost:8000/itinerary/update/${editingId}`, dataToSubmit)
        .then(() => {
          setEditingId(null);
          resetForm();
          fetchItineraries();
        })
        .catch(error => {
          console.error('Error updating itinerary:', error.response?.data || error.message);
        });
    } else {
      axios.post('http://localhost:8000/itinerary/create', dataToSubmit)
        .then(() => {
          resetForm();
          fetchItineraries();
        })
        .catch(error => {
          console.error('Error adding itinerary:', error.response?.data || error.message);
        });
    }
  };
  
  const resetForm = () => {
    setFormData({
      language: '',
      price: 0,
      startTime: '',
      endTime: '',
      budget: 0,
      pickupLocation: '',
      dropoffLocation: '',
      accessibility: '',
      preferences: '',
      availableDates: [],
      activities: [],
      locations: []
    });
    setNewAvailableDate({ date: '', startTime: '', endTime: '' });
    setSelectedActivity(''); // Reset selected activity
    setSelectedLocation(''); // Reset selected location
  };

  const handleEdit = (itinerary) => {
    setEditingId(itinerary._id);
    setFormData({
      language: itinerary.language,
      price: itinerary.price,
      startTime: itinerary.timeline.startTime,
      endTime: itinerary.timeline.endTime,
      budget: itinerary.budget,
      pickupLocation: itinerary.pickupLocation,
      dropoffLocation: itinerary.dropoffLocation,
      accessibility: itinerary.accessibility,
      preferences: itinerary.preferences,
      availableDates: itinerary.availableDates,
      activities: itinerary.activities,
      locations: itinerary.locations
    });
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
        console.error('Error deleting itinerary:', error.response ? error.response.data : error.message);
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
    if (newAvailableDate.date) {
      setFormData(prev => ({
        ...prev,
        availableDates: [...prev.availableDates, {
          date: newAvailableDate.date,
          times: [newAvailableDate.startTime, newAvailableDate.endTime]
        }]
      }));
      setNewAvailableDate({ date: '', startTime: '', endTime: '' });
    } else {
      alert("Please enter a valid date before adding.");
    }
  };

  const handleAddActivity = () => {
    if (selectedActivity) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, selectedActivity] // Add the selected activity to the activities array
      }));
      setSelectedActivity(''); // Reset selected activity
    } else {
      alert("Please select an activity before adding.");
    }
  };

  const handleAddLocation = () => {
    if (selectedLocation) {
      setFormData(prev => ({
        ...prev,
        locations: [...prev.locations, selectedLocation] // Add the selected location to the locations array
      }));
      setSelectedLocation(''); // Reset selected location
    } else {
      alert("Please select a location before adding.");
    }
  };
  return (
    <div>
      <h1>Itinerary Manager</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Language:
          <input type="text" name="language" value={formData.language} onChange={handleChange} required />
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
          Budget:
          <input type="number" name="budget" value={formData.budget} onChange={handleChange} required />
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
        <label>
          Preferences:
          <select name="preferences" value={formData.preferences} onChange={handleChange} required>
            <option value="">Select Preference</option>
            <option value="Historical Area">Historical Area</option>
            <option value="Beaches">Beaches</option>
            <option value="Family Friendly">Family Friendly</option>
            <option value="Shopping">Shopping</option>
          </select>
        </label>

        <h4>Add Available Dates</h4>
        <label>
          Date:
          <input type="date" name="date" value={newAvailableDate.date} onChange={handleAvailableDateChange} />
        </label>
        <label>
          Start Time:
          <input
            type="time"
            name="startTime"
            value={newAvailableDate.startTime}
            onChange={handleAvailableDateChange}
          />
        </label>
        <label>
          End Time:
          <input
            type="time"
            name="endTime"
            value={newAvailableDate.endTime}
            onChange={handleAvailableDateChange}
          />
        </label>
        <button type="button" onClick={handleAddAvailableDate}>Add Available Date</button>

        <h4>Add Activities</h4>
        <label>
          Select Activity:
          <select value={selectedActivity} onChange={(e) => setSelectedActivity(e.target.value)} required>
            <option value="">Select Activity</option>
            {activities.map((activity) => (
              <option key={activity._id} value={activity._id}>{activity.name}</option>
            ))}
          </select>
        </label>
        <button type="button" onClick={handleAddActivity}>Add Activity</button>

        <h4>Add Locations</h4>
        <label>
          Select Location:
          <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} required>
            <option value="">Select Location</option>
            {locations.map((location) => (
              <option key={location._id} value={location._id}>{location.location}</option>
            ))}
          </select>
        </label>
        <button type="button" onClick={handleAddLocation}>Add Location</button>

        <button type="submit">{editingId ? 'Update Itinerary' : 'Add Itinerary'}</button>
      </form>

      <h2>All Itineraries</h2>
      <ul>
        {itineraries.map(itinerary => (
          <li key={itinerary._id}>
            <h3>Language: {itinerary.language}</h3>
            <p>Price: ${itinerary.price}</p>
            <p>Timeline: {itinerary.timeline.startTime} to {itinerary.timeline.endTime}</p>
            <p>Budget: ${itinerary.budget}</p>
            <p>Pickup Location: {itinerary.pickupLocation}</p>
            <p>Dropoff Location: {itinerary.dropoffLocation}</p>
            <p>Accessibility: {itinerary.accessibility}</p>
            <p>Preferences: {itinerary.preferences}</p>
            <p>bookings: {itinerary.bookings.length}</p>
            <h4>Available Dates:</h4>
            <ul>
              {itinerary.availableDates.map((date, index) => (
                <li key={index}>{new Date(date.date).toISOString().split('T')[0]} (from {date.times[0]} to {date.times[1]})</li>
              ))}
            </ul>

            
            <h4>Activities:</h4>
            <ul>
              {itinerary.activities.map((activity, index) => (
                <li key={index} className="activity-item">
                <p><strong>Name:</strong> {activity.name}</p>
                <p><strong>Duration:</strong> {activity.duration} minutes</p>
                <p><strong>Rating:</strong> {activity.rating}</p>
              </li>

              ))}

            </ul>

            <h4>Locations:</h4>
<ul>
  {itinerary.locations.map((location, index) => (
    <li key={index}>
      <strong>Location:</strong> {location.location}
      <div>
        <strong>Tags:</strong>
        <ul>
          {location.tags.map((tag, tagIndex) => (
            <li key={tagIndex}>{tag}</li>
          ))}
        </ul>
      </div>
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
