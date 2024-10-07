import Place from '../../models/place.js';
import Itinerary from '../../models/itinerary.js';
import Activity from '../../models/activity.js';
import Tag from '../../models/tag.js'; // Import your Tag model

export const searchActivities = async (req, res) => {
    try {
        const { searchField } = req.body;
        const activities = await Activity.find({}).populate({
            path: "tags",
            select: "name",
        });

        const filteredActivities = activities.filter((activity) => {
            // Check if activity name starts with the searchField
            if (activity.name.toLowerCase().startsWith(searchField.toLowerCase())) {
                return true;
            }
            // Check if any tag name starts with the searchField
            return activity.tags.some(tag => 
                tag.name.toLowerCase().startsWith(searchField.toLowerCase())
            );
        });

        res.status(200).json({
            Activities: filteredActivities,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message, // Use error.message for better readability
        });
    }
};


export const searchPlaces = async (req, res) => {
    try {
      const { searchField } = req.body;
      const Places = await Place.find({}).populate({
        path: "tags",
        select: "name",
      });
  
      const filteredPlaces = Places.filter((place) => {
        if (place.name.toLowerCase().startsWith(searchField.toLowerCase())) {
          return true;
        }
        return place.tags.some((tag) => tag.name.toLowerCase().startsWith(searchField.toLowerCase()));
      });
  
      res.status(200).json({
        Places: filteredPlaces,
      });
    } catch (error) {
      res.status(400).json({
        error: error,
      });
    }
  };

  


  export const searchItineraries = async (req, res) => {
    try {
        const { searchField } = req.body;

        // Retrieve itineraries with lookup for locations and activities
        const filteredItineraries = await Itinerary.aggregate([
            {
                $match: {
                    name: { $regex: `^${searchField}`, $options: 'i' } // Case-insensitive search
                }
            },
            {
                $lookup: {
                    from: 'locations', // Name of the locations collection
                    localField: 'locations',
                    foreignField: '_id',
                    as: 'locationDetails'
                }
            },
            {
                $lookup: {
                    from: 'activities', // Name of the activities collection
                    localField: 'activities',
                    foreignField: '_id',
                    as: 'activityDetails'
                }
            }
        ]);

        res.status(200).json({
            itineraries: filteredItineraries,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
