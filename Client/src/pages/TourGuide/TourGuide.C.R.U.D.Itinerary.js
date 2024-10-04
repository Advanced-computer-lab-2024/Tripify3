import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Itinerary = () => {
    const [itineraries, setItineraries] = useState([]);
    const [newItinerary, setNewItinerary] = useState({
        activities: [],
        locations: [],
        price: '',
        budget: '',  // Add budget here
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
        } else {
            setNewItinerary({
                ...newItinerary,
                [name]: value
            });
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('New Itinerary Data:', JSON.stringify(newItinerary, null, 2)); // Log the data in a readable format
        try {
            await axios.post('http://localhost:8000/itinerary/create', newItinerary);
            fetchItineraries();
        } catch (error) {
            console.error('Error creating itinerary:', error.response ? error.response.data : error.message);
        }
    };
    
    

    return (
        <div>
            <h1>Itinerary Management</h1>
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
                <button type="submit">Create Itinerary</button>
            </form>

            <h2>Existing Itineraries</h2>
            <ul>
                {itineraries.map(itinerary => (
                    <li key={itinerary._id}>
                        <h3>Language: {itinerary.language}</h3>
                        <p>Price: ${itinerary.price}</p>
                        <p>Pickup Location: {itinerary.pickupLocation}</p>
                        <p>Dropoff Location: {itinerary.dropoffLocation}</p>
                        <p>Accessibility: {itinerary.accessibility}</p>
                        <p>Start Time: {new Date(itinerary.timeline.startTime).toLocaleString()}</p>
                        <p>End Time: {new Date(itinerary.timeline.endTime).toLocaleString()}</p>
                        <p>Preferences: {itinerary.preferences.join(', ')}</p>
                        <p>Available Dates: {itinerary.availableDates.map(date => (
                            <span key={date.date}>
                                {new Date(date.date).toLocaleDateString()} ({date.times.join(', ')})
                            </span>
                        ))}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Itinerary;
