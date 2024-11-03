import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ActivateDeactivateItinerary = () => {
  const { id: tourGuideId } = useParams(); // Extract the tour guide ID from the URL
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  // Fetch itineraries when component mounts
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/tour-guide/itineraries/${tourGuideId}`);
        setItineraries(response.data);
      } catch (error) {
        setError('Failed to fetch itineraries');
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [tourGuideId]);

  // Activate an itinerary
  const activateItinerary = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8000/itinerary/activate/${id}`);
      setItineraries((prevItineraries) =>
        prevItineraries.map((itinerary) =>
          itinerary._id === id ? { ...itinerary, status: 'Active' } : itinerary
        )
      );
      setActionMessage(response.data.message);
    } catch (error) {
      setActionMessage(error.response?.data?.message || 'Error activating itinerary');
    }
  };

  // Deactivate an itinerary
  const deactivateItinerary = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8000/itinerary/deactivate/${id}`);
      setItineraries((prevItineraries) =>
        prevItineraries.map((itinerary) =>
          itinerary._id === id ? { ...itinerary, status: 'Inactive' } : itinerary
        )
      );
      setActionMessage(response.data.message);
    } catch (error) {
      setActionMessage(error.response?.data?.message || 'Error deactivating itinerary');
    }
  };

  // Display loading state or error message
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>Manage Itineraries</h1>
      {itineraries.length === 0 ? (
        <p>No itineraries found for this tour guide.</p>
      ) : (
        itineraries.map((itinerary) => (
          <div key={itinerary._id} className="itinerary">
            <h2>{itinerary.name}</h2>
            <p>Status: {itinerary.status}</p>
            <p>Bookings: {itinerary.bookings.length}</p>

            {itinerary.status === 'Inactive' && (
              <button onClick={() => activateItinerary(itinerary._id)}>Activate</button>
            )}

            {itinerary.status === 'Active' && itinerary.bookings.length > 0 && (
              <button onClick={() => deactivateItinerary(itinerary._id)}>Deactivate</button>
            )}

            {itinerary.status === 'Active' && itinerary.bookings.length === 0 && (
              <p>This itinerary cannot be deactivated as it has no bookings.</p>
            )}
          </div>
        ))
      )}
      {actionMessage && <div>{actionMessage}</div>}
    </div>
  );
};

export default ActivateDeactivateItinerary;
