import Activity from "../../models/activity.js";
import Itinerary from "../../models/itinerary.js";
import Tourist from "../../models/tourist.js";


export const toggleBookmark = async (req, res) => {
    const { userId, itemId, itemType } = req.body;
  
    try {
      // Validate the user
      const tourist = await Tourist.findById(userId);
      if (!tourist) {
        return res.status(404).json({ message: "Tourist not found" });
      }
  
      // Validate itemType
      if (!["itinerary", "activity"].includes(itemType.toLowerCase())) {
        return res.status(400).json({ message: "Invalid item type. Must be 'itinerary' or 'activity'." });
      }
  
      // Validate the item
      let item;
      if (itemType.toLowerCase() === "itinerary") {
        item = await Itinerary.findById(itemId);
      } else if (itemType.toLowerCase() === "activity") {
        item = await Activity.findById(itemId);
      }
  
      if (!item) {
        return res.status(404).json({ message: `${itemType} not found` });
      }
  
      let message;
  
      // Toggle logic for itineraries
      if (itemType.toLowerCase() === "itinerary") {
        const index = tourist.userBookmarkedItineraries.indexOf(itemId);
        if (index > -1) {
          // If exists, remove
          tourist.userBookmarkedItineraries.splice(index, 1);
          message = "Itinerary removed from bookmarks";
        } else {
          // If not, add
          tourist.userBookmarkedItineraries.push(itemId);
          message = "Itinerary added to bookmarks";
        }
      }
  
      // Toggle logic for activities
      if (itemType.toLowerCase() === "activity") {
        const index = tourist.userBookmarkedActivities.indexOf(itemId);
        if (index > -1) {
          // If exists, remove
          tourist.userBookmarkedActivities.splice(index, 1);
          message = "Activity removed from bookmarks";
        } else {
          // If not, add
          tourist.userBookmarkedActivities.push(itemId);
          message = "Activity added to bookmarks";
        }
      }
  
      await tourist.save(); // Save updated tourist document
  
      return res.status(200).json({
        message,
        bookmarks: {
          itineraries: tourist.userBookmarkedItineraries,
          activities: tourist.userBookmarkedActivities,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred", error: error.message });
    }
  };
  