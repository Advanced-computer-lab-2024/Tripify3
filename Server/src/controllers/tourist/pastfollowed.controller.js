import Tourist from "../../models/tourist.js";
import TourGuide from "../../models/tourGuide.js"; // Ensure you import your TourGuide model

export const getFollowingTourGuides = async (req, res) => {
  try {
    // Extract the tourist ID from the request parameters
    const { touristId } = req.params;

    // Find the tourist by ID and populate the 'following' field to get the full details of the tour guides
    const tourist = await Tourist.findById(touristId);

    // Check if the tourist exists
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    return res.status(200).json({ message: "Successfully Found Following Tour Guides", following: tourist.following });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Error fetching following tour guides", error: error.message });
  }
};

export const followTourGuide = async (req, res) => {
  const { touristId, tourGuideId } = req.params; // Extract touristId and tourGuideId from parameters
  const { follow } = req.body; // Extract touristId and tourGuideId from parameters  

  try {
    // Check if the tourist exists
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    // Check if the tour guide exists
    const tourGuide = await TourGuide.findById(tourGuideId);
    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found." });
    }

    if (follow === true) {
      // Check if the tourist is already following the tour guide
      if (tourist.following.includes(tourGuideId)) {
        return res.status(400).json({ message: "You are already following this tour guide." });
      }

      // Add the tour guide ID to the following array
      tourist.following.push(tourGuideId);
    } else if (follow === false) {
      // Check if the tourist is currently following the tour guide
      const index = tourist.following.indexOf(tourGuideId);
      if (index === -1) {
        return res.status(400).json({ message: "You are not following this tour guide." });
      }

      // Remove the tour guide ID from the following array
      tourist.following.splice(index, 1);
    }

    // Save the updated tourist document
    await tourist.save();

    return res.status(200).json({ message: "Successfully followed the tour guide.", following: tourist.following });
  } catch (error) {
    console.error("Error following tour guide:", error);
    return res.status(500).json({ message: "Server error." });
  }
};
