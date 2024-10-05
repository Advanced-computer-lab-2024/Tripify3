import React, { useEffect, useState } from 'react';
import './styles/TourGuideItinerary.css';

const Itinerary = () => {
    const [itineraries, setItineraries] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [newItinerary, setNewItinerary] = useState({
        activities: [],
        timeline: {
            startTime: '',
            endTime: '',
        },
        dropoffLocation: '',
        pickupLocation: '',
        accessibility: '',
        availableDates: [],
        preferences: [],
    });
    const [availableDatesInput, setAvailableDatesInput] = useState({ date: '', times: '' });
    const [newActivity, setNewActivity] = useState({ name: '', description: '', duration: '', date: '' });
    const [editMode, setEditMode] = useState(false);
    const [currentItineraryIndex, setCurrentItineraryIndex] = useState(null);

    const closeModal = () => {
        setIsModalOpen(false);
        resetItinerary();
    };

    const closeActivityModal = () => {
        setIsActivityModalOpen(false);
        setNewActivity({ name: '', description: '', duration: '', date: '' });
    };

    const resetItinerary = () => {
        setNewItinerary({
            activities: [],
            timeline: {
                startTime: '',
                endTime: '',
            },
            dropoffLocation: '',
            pickupLocation: '',
            accessibility: '',
            availableDates: [],
            preferences: [],
        });
        setEditMode(false);
        setCurrentItineraryIndex(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'preferences') {
            const options = e.target.selectedOptions;
            const values = Array.from(options).map(option => option.value);
            setNewItinerary({ ...newItinerary, preferences: values });
        } else {
            setNewItinerary({ ...newItinerary, [name]: value });
        }
    };

    const handleAddAvailableDate = () => {
        if (availableDatesInput.date && availableDatesInput.times) {
            setNewItinerary(prevState => ({
                ...prevState,
                availableDates: [...prevState.availableDates, availableDatesInput],
            }));
            setAvailableDatesInput({ date: '', times: '' });
        }
    };

    const handleSubmitItinerary = (e) => {
        e.preventDefault();
        if (editMode) {
            const updatedItineraries = itineraries.map((itinerary, index) =>
                index === currentItineraryIndex ? newItinerary : itinerary
            );
            setItineraries(updatedItineraries);
        } else {
            setItineraries([...itineraries, newItinerary]);
        }
        closeModal();
    };

    const handleSubmitActivity = (e) => {
        e.preventDefault();
        setNewItinerary(prevState => ({
            ...prevState,
            activities: [...prevState.activities, newActivity],
        }));
        closeActivityModal();
    };

    const preferencesOptions = ['Historical', 'Beaches', 'Family-Friendly', 'Shopping'];

    return (
        <div>
            <h2>Itineraries</h2>
            <button onClick={() => setIsModalOpen(true)}>Create Itinerary</button>
            <ul>
                {itineraries.map((itinerary, index) => (
                    <li key={index}>
                        {itinerary.pickupLocation} to {itinerary.dropoffLocation}
                        <button onClick={() => {
                            setEditMode(true);
                            setCurrentItineraryIndex(index);
                            setNewItinerary(itinerary);
                            setIsModalOpen(true);
                        }}>Edit</button>
                    </li>
                ))}
            </ul>

            {/* Modal for creating/editing itineraries */}
            <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
                <form onSubmit={handleSubmitItinerary}>
                    <h2>{editMode ? 'Edit Itinerary' : 'Create Itinerary'}</h2>
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
                    />
                    <input
                        type="date"
                        name="startTime"
                        placeholder="Start Time"
                        value={newItinerary.timeline.startTime}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="endTime"
                        placeholder="End Time"
                        value={newItinerary.timeline.endTime}
                        onChange={handleChange}
                        required
                    />
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
                    <h4>Available Dates</h4>
                    <input
                        type="date"
                        value={availableDatesInput.date}
                        onChange={(e) => setAvailableDatesInput({ ...availableDatesInput, date: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Times (e.g., 9 AM - 5 PM)"
                        value={availableDatesInput.times}
                        onChange={(e) => setAvailableDatesInput({ ...availableDatesInput, times: e.target.value })}
                    />
                    <button type="button" onClick={handleAddAvailableDate}>Add Available Date</button>
                    <ul>
                        {newItinerary.availableDates.map((date, index) => (
                            <li key={index}>{date.date} ({date.times})</li>
                        ))}
                    </ul>
                    <button type="submit">{editMode ? 'Update Itinerary' : 'Create Itinerary'}</button>
                    <button type="button" onClick={closeModal}>Cancel</button>
                </form>
            </Modal>

            {/* Modal for adding activities */}
            <Modal isOpen={isActivityModalOpen} onRequestClose={closeActivityModal}>
                <form onSubmit={handleSubmitActivity}>
                    <h2>Add Activity</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Activity Name"
                        value={newActivity.name}
                        onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={newActivity.description}
                        onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    />
                    <input
                        type="text"
                        name="duration"
                        placeholder="Duration"
                        value={newActivity.duration}
                        onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                        required
                    />
                    <input
                        type="date"
                        name="date"
                        value={newActivity.date}
                        onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                        required
                    />
                    <button type="submit">Add Activity</button>
                    <button type="button" onClick={closeActivityModal}>Cancel</button>
                </form>
            </Modal>
        </div>
    );
};

export default Itinerary;
