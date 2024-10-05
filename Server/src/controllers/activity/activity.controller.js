import Activity from '../../models/activity.js';
import Itinerary  from "../../models/itinerary.js"; // Assuming you have an Itinerary model


// Create a new activity
export const createActivity = async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all activities
export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().populate('location');
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single activity by ID
export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('location');
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an activity
export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.status(200).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an activity
export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addActivityToItinerary = async (req, res) => {
  const { id } = req.params; // Get the itinerary ID from the URL
  const { name, description, category, price, rating } = req.body; // Get activity details from request body

  try {
      // Find the itinerary by ID
      const itinerary = await Itinerary.findById(id);
      if (!itinerary) {
          return res.status(404).json({ message: 'Itinerary not found' });
      }

      // Create a new activity object
      const newActivity = {
          name,
          description,
          category,
          price,
          rating,
      };

      // Add the new activity to the itinerary's activities array
      itinerary.activities.push(newActivity);
      
      // Save the updated itinerary
      await itinerary.save();

      return res.status(201).json({ message: 'Activity added successfully', activity: newActivity });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
  }
};


