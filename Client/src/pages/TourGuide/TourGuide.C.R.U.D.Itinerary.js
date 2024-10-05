import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal'; // Import the modal component
import './styles/TourGuide.C.R.U.D.Itinerary.css';

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
        preferences: []
    });
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);  // Modal visibility state
    const [availableDatesInput, setAvailableDatesInput] = useState({ date: '', times: '' }); // State for available dates input

    // Sample preferences list (you can replace this with dynamic data if needed)
    const preferencesOptions = ['Historical Area', 'Beaches', 'Family Friendly', 'Shopping'];

    useEffect(() => {
        fetchItineraries();
    }, []);

    const fetchItineraries = async () => {
        try {
            const response = await fetch('http://localhost:8000/itinerary/get');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setItineraries(data);
        } catch (error) {
            console.error('Error fetching itineraries:', error);
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
            setNewItinerary({
                ...newItinerary,
                [name]: value
            });
        }
    };

    const handleAddAvailableDate = () => {
        if (availableDatesInput.date && availableDatesInput.times) {
            setNewItinerary((prevState) => ({
                ...prevState,
                availableDates: [...prevState.availableDates, availableDatesInput]
            }));
            setAvailableDatesInput({ date: '', times: '' }); // Reset input after adding
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editMode && currentId) {
            try {
                await axios.put(`http://localhost:8000/itinerary/update/${currentId}`, newItinerary);
                fetchItineraries();
                setEditMode(false);
                resetForm();
            } catch (error) {
                console.error('Error updating itinerary:', error.response ? error.response.data : error.message);
            }
        } else {
            try {
                await axios.post('http://localhost:8000/itinerary/create', newItinerary);
                fetchItineraries();
            } catch (error) {
                console.error('Error creating itinerary:', error.response ? error.response.data : error.message);
            }
        }
        closeModal();  // Close modal after submission
    };

    const handleEdit = (itinerary) => {
        setNewItinerary(itinerary);
        setEditMode(true);
        setCurrentId(itinerary._id);
        openModal();  // Open modal for editing
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
            preferences: []
        });
        setAvailableDatesInput({ date: '', times: '' }); // Reset available dates input
        setEditMode(false); // Ensure the form is in 'create' mode
    };

    return (
        <div>
            <h1>Itinerary Management</h1>

            <button className="add-itinerary-btn" onClick={openModal}>Add New Itinerary</button> {/* Add new itinerary button */}

            <h2>Existing Itineraries</h2>
            <ul>
                {itineraries.map(itinerary => (
                    <li key={itinerary._id}>
                        <h3>Language: {itinerary.language}</h3>
                        <p>Price: ${itinerary.price}</p>
                        <p>Budget: ${itinerary.budget}</p> {/* Display budget */}
                        <p>Pickup Location: {itinerary.pickupLocation}</p>
                        <p>Dropoff Location: {itinerary.dropoffLocation}</p>
                        <p>Accessibility: {itinerary.accessibility}</p>
                        <p>Start Time: {new Date(itinerary.timeline.startTime).toLocaleString()}</p>
                        <p>End Time: {new Date(itinerary.timeline.endTime).toLocaleString()}</p>
                        <p>Preferences: {itinerary.preferences.join(', ')}</p> {/* Display preferences */}
                        <p>Available Dates: {itinerary.availableDates.map(date => (
                            <span key={date.date}>
                                {new Date(date.date).toLocaleDateString()} ({date.times.join(', ')})
                            </span>
                        ))}</p> {/* Display available dates */}
                        <button onClick={() => handleEdit(itinerary)}>Edit</button> {/* Edit Button */}
                    </li>
                ))}
            </ul>

            {/* Modal for editing/creating itinerary */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit}>
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
                    />
                    <input
                        type="text"
                        name="dropoffLocation"
                        placeholder="Dropoff Location"
                        value={newItinerary.dropoffLocation}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={newItinerary.price}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number" // Input for budget
                        name="budget"
                        placeholder="Budget"
                        value={newItinerary.budget}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="datetime-local"
                        name="startTime"
                        placeholder="Start Time"
                        value={newItinerary.timeline.startTime}
                        onChange={handleChange}
                    />
                    <input
                        type="datetime-local"
                        name="endTime"
                        placeholder="End Time"
                        value={newItinerary.timeline.endTime}
                        onChange={handleChange}
                    />

                    {/* Preferences selection */}
                    <label>Preferences:</label>
                    <select
                        name="preferences"
                        multiple
                        value={newItinerary.preferences}
                        onChange={handleChange}
                    >
                        {preferencesOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                    {/* Available Dates input */}
                    <div>
                        <h4>Add Available Date</h4>
                        <input
                            type="date"
                            value={availableDatesInput.date}
                            onChange={(e) => setAvailableDatesInput({ ...availableDatesInput, date: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Times (comma-separated)"
                            value={availableDatesInput.times}
                            onChange={(e) => setAvailableDatesInput({ ...availableDatesInput, times: e.target.value })}
                        />
                        <button type="button" onClick={handleAddAvailableDate}>Add Date</button>
                    </div>

                    <button type="submit">{editMode ? 'Update Itinerary' : 'Create Itinerary'}</button>
                </form>
            </Modal>
        </div>
    );
};

export default Itinerary;
