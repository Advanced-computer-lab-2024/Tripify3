import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../TourGuide/styles/TourGuide.C.R.U.D.Itinerary.css';

const Itinerary = () => {
    const [itineraries, setItineraries] = useState([]);
    const [newItinerary, setNewItinerary] = useState({
        activities: [],
        locations: [],
        price: '',
        budget: '',
        language: '',
        timeline: {
            startTime: '',
            endTime: ''
        },
        availableDates: [],
        pickupLocation: '',
        dropoffLocation: '',
        accessibility: '',
        preferences: [],
        bookings: []
    });
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [availableDatesInput, setAvailableDatesInput] = useState({ date: '', times: '' });
    const [newActivity, setNewActivity] = useState({ name: '', description: '', advertiser: '', duration: '' });
    const [selectedItineraryId, setSelectedItineraryId] = useState(null);
    const [advertisers, setAdvertisers] = useState([]);

    const preferencesOptions = ['Historical Area', 'Beaches', 'Family Friendly', 'Shopping'];

    useEffect(() => {
        fetchItineraries();
        fetchAdvertisers();
    }, []);

    const fetchItineraries = async () => {
        try {
            const response = await fetch('http://localhost:8000/itinerary/get');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setItineraries(data.map(itinerary => ({
                ...itinerary,
                bookingsCount: itinerary.bookings ? itinerary.bookings.length : 0
            })));
        } catch (error) {
            console.error('Error fetching itineraries:', error);
        }
    };

    const fetchAdvertisers = async () => {
        try {
            const response = await fetch('http://localhost:8000/advertiser/get');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAdvertisers(data);
        } catch (error) {
            console.error('Error fetching advertisers:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'startTime' || name === 'endTime') {
            setNewItinerary((prevState) => ({
                ...prevState,
                timeline: {
                    ...prevState.timeline,
                    [name]: value
                }
            }));
        } else if (name === 'preferences') {
            const selectedPreferences = Array.from(e.target.selectedOptions, option => option.value);
            setNewItinerary((prevState) => ({
                ...prevState,
                preferences: selectedPreferences
            }));
        } else {
            setNewItinerary((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleAddAvailableDate = () => {
        if (availableDatesInput.date && availableDatesInput.times) {
            setNewItinerary((prevState) => ({
                ...prevState,
                availableDates: [...prevState.availableDates, availableDatesInput]
            }));
            setAvailableDatesInput({ date: '', times: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode && currentId) {
                await axios.put(`http://localhost:8000/itinerary/update/${currentId}`, newItinerary);
            } else {
                await axios.post('http://localhost:8000/itinerary/create', newItinerary);
            }
            fetchItineraries();
            closeModal();
        } catch (error) {
            console.error('Error saving itinerary:', error.response ? error.response.data : error.message);
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
            price: '',
            budget: '',
            language: '',
            timeline: { startTime: '', endTime: '' },
            availableDates: [],
            pickupLocation: '',
            dropoffLocation: '',
            accessibility: '',
            preferences: [],
            bookings: []
        });
        setAvailableDatesInput({ date: '', times: '' });
        setEditMode(false);
    };

    const openActivityModal = (itineraryId) => {
        setSelectedItineraryId(itineraryId);
        setNewActivity({ name: '', description: '', advertiser: '', duration: '' });
        setIsActivityModalOpen(true);
    };

    const closeActivityModal = () => {
        setIsActivityModalOpen(false);
        setNewActivity({ name: '', description: '', advertiser: '', duration: '' });
    };

    const handleSubmitActivity = async (e) => {
        e.preventDefault();
        try {
            // Send newActivity to backend to get an Activity ObjectId
            const activityResponse = await axios.post(`http://localhost:8000/activity/create`, newActivity);
            
            // Get the activity ObjectId (assuming your backend returns it)
            const activityId = activityResponse.data._id;
            
            // Now send this ObjectId to the itinerary for associating the activity
            await axios.post(`http://localhost:8000/itinerary/${selectedItineraryId}/addActivity`, { activityId });
            closeActivityModal();
            fetchItineraries();
        } catch (error) {
            console.error('Error adding activity:', error.response ? error.response.data : error.message);
        }
    };
    
    return (
        <div>
            <h1>Itinerary Management</h1>

            <button className="add-itinerary-btn" onClick={openModal}>Add New Itinerary</button>

            <h2>Existing Itineraries</h2>
            <ul>
                {itineraries.map(itinerary => (
                    <li key={itinerary._id}>
                        <h3>Language: {itinerary.language}</h3>
                        <p>Price: ${itinerary.price}</p>
                        <p>Budget: ${itinerary.budget}</p>
                        <p>Pickup Location: {itinerary.pickupLocation}</p>
                        <p>Dropoff Location: {itinerary.dropoffLocation}</p>
                        <p>Accessibility: {itinerary.accessibility}</p>
                        <p>Start Time: {new Date(itinerary.timeline.startTime).toLocaleString()}</p>
                        <p>End Time: {new Date(itinerary.timeline.endTime).toLocaleString()}</p>
                        <p>Preferences: {itinerary.preferences.join(', ')}</p>
                        <p>Available Dates: {itinerary.availableDates.map((date, index) => (
                            <span key={`${date.date}-${index}`}>
                                {new Date(date.date).toLocaleDateString()} ({date.times})
                            </span>
                        ))}</p>
                        <p>Number of Bookings: {itinerary.bookingsCount}</p>
                        <button onClick={() => handleEdit(itinerary)}>Edit</button>
                        <button onClick={() => handleDelete(itinerary._id, itinerary.bookings.length > 0)}>Delete</button>
                        <button onClick={() => openActivityModal(itinerary._id)}>Add Activity</button>

                        {/* View Activities */}
                        <h4>Activities:</h4>
                        <ul>
                            {itinerary.activities.map((activity, index) => (
                                <li key={`${activity.id}-${index}`}>
                                    {activity.name}: {activity.description}, Duration: {activity.duration}
                                </li>
                            ))}
                        </ul>

                        {/* View Locations */}
                        <h4>Locations:</h4>
                        <ul>
                            {itinerary.locations.map((location, index) => (
                                <li key={`${location.id}-${index}`}>
                                    {location.name}: {location.description}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            {/* Modal for editing/creating itinerary */}
            <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
                <form onSubmit={handleSubmit}>
                    <h2>{editMode ? 'Edit Itinerary' : 'Add New Itinerary'}</h2>
                    <input
                        type="text"
                        name="price"
                        placeholder="Price"
                        value={newItinerary.price}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="budget"
                        placeholder="Budget"
                        value={newItinerary.budget}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="language"
                        placeholder="Language"
                        value={newItinerary.language}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="pickupLocation"
                        placeholder="Pickup Location"
                        value={newItinerary.pickupLocation}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="dropoffLocation"
                        placeholder="Dropoff Location"
                        value={newItinerary.dropoffLocation}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="accessibility"
                        placeholder="Accessibility"
                        value={newItinerary.accessibility}
                        onChange={handleChange}
                        required
                    />

                    <label>Start Time</label>
                    <input
                        type="datetime-local"
                        name="startTime"
                        value={newItinerary.timeline.startTime}
                        onChange={handleChange}
                        required
                    />

                    <label>End Time</label>
                    <input
                        type="datetime-local"
                        name="endTime"
                        value={newItinerary.timeline.endTime}
                        onChange={handleChange}
                        required
                    />

                    <label>Preferences</label>
                    <select
                        multiple
                        name="preferences"
                        value={newItinerary.preferences}
                        onChange={handleChange}
                        required
                    >
                        {preferencesOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                    <h4>Add Available Dates</h4>
                    <input
                        type="date"
                        value={availableDatesInput.date}
                        onChange={(e) => setAvailableDatesInput({ ...availableDatesInput, date: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Available Times"
                        value={availableDatesInput.times}
                        onChange={(e) => setAvailableDatesInput({ ...availableDatesInput, times: e.target.value })}
                    />
                    <button type="button" onClick={handleAddAvailableDate}>Add Date</button>

                    <button type="submit">{editMode ? 'Update Itinerary' : 'Add Itinerary'}</button>
                    <button type="button" onClick={closeModal}>Cancel</button>
                </form>
            </Modal>

            {/* Modal for adding activity */}
            <Modal isOpen={isActivityModalOpen} onRequestClose={closeActivityModal}>
                <form onSubmit={handleSubmitActivity}>
                    <h2>Add New Activity</h2>

                    <input
                        type="text"
                        placeholder="Activity Name"
                        value={newActivity.name}
                        onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                        required
                    />

                    <textarea
                        placeholder="Activity Description"
                        value={newActivity.description}
                        onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Activity Duration (e.g., 2 hours)"
                        value={newActivity.duration || ''}
                        onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                        required
                    />

                    <select
                        value={newActivity.advertiser}
                        onChange={(e) => setNewActivity({ ...newActivity, advertiser: e.target.value })}
                        required
                    >
                        <option value="">Select Advertiser</option>
                        {advertisers.map(advertiser => (
                            <option key={advertiser._id} value={advertiser._id}>
                                {advertiser.username}
                            </option>
                        ))}
                    </select>

                    <button type="submit">Add Activity</button>
                    <button type="button" onClick={closeActivityModal}>Cancel</button>
                </form>
            </Modal>
        </div>
    );
};

export default Itinerary;
