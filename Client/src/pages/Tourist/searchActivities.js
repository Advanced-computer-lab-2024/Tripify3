import React, { useState } from 'react';
import axios from 'axios';

const ActivitySearchPage = () => {
  const [searchField, setSearchField] = useState('');
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchField) {
      setError('Please enter a search term.');
      return;
    }

    setError(''); // Clear previous error
    try {
      const response = await axios.post('http://localhost:8000/activities/search', {
        searchField: searchField,
      });

      // Assuming the response structure is as described
      setActivities(response.data.Activities);
    } catch (err) {
      setError('Error fetching activities. Please try again.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Search Activities</h1>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <input
          type="text"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          placeholder="Enter activity name"
          style={{ padding: '10px', flex: '1' }}
        />
        <button onClick={handleSearch} style={{ padding: '10px', marginLeft: '10px' }}>
          Search
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <h3>{activity.name}</h3>
              <p><strong>Location:</strong> {activity.location}</p>
              <p><strong>Time:</strong> {activity.time}</p>
              <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
              <p><strong>Special Discount:</strong> {activity.specialDiscount}</p>
              <p><strong>Duration:</strong> {activity.duration} minutes</p>
              <p><strong>Rating:</strong> {activity.rating}</p>
              <p><strong>Price:</strong> ${activity.price}</p>
              <p><strong>Tags:</strong> {activity.tags.map(tag => tag.name).join(', ')}</p>
            </div>
          ))
        ) : (
          <p>No activities found.</p>
        )}
      </div>
    </div>
  );
};

export default ActivitySearchPage;
