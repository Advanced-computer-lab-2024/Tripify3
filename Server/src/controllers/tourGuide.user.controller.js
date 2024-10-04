import TourGuide from '../models/tourGuide.js'; // Import your Tour Guide model

// Update Tour Guide Profile
export const updateTourGuideProfile = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the tour guide ID is sent in the URL
    const updateData = req.body; // Get the updated profile data from the request body

    // Find the tour guide by ID and update their profile
    const updatedProfile = await TourGuide.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Tour guide not found' });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error); // Enhanced error logging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new tour guide
export const createTourGuide = async (req, res) => {
  const {
    licenseNumber,
    experienceYears,
    regionSpecialization,
    previousWork,
    adminLevel,
    department,
    companyName,
    adBudget,
    description,
    website,
    hotline,
    tourGuideID,
    tourGuideCertificate,
    advertiserID,
    advertiserTaxCard,
    sellerID,
    sellerTaxCard,
  } = req.body;

  try {
    // Create a new tour guide instance
    const newTourGuide = new TourGuide({
      licenseNumber,
      experienceYears,
      regionSpecialization,
      previousWork,
      adminLevel,
      department,
      companyName,
      adBudget,
      description,
      website,
      hotline,
      tourGuideID,
      tourGuideCertificate,
      advertiserID,
      advertiserTaxCard,
      sellerID,
      sellerTaxCard,
    });

    // Save the tour guide to the database
    const savedTourGuide = await newTourGuide.save();

    // Send a response back to the client
    res.status(201).json({
      message: 'Tour Guide created successfully',
      data: savedTourGuide,
    });
  } catch (error) {
    // Handle errors
    console.error('Error creating tour guide:', error);
    res.status(500).json({
      message: 'Error creating tour guide',
      error: error.message,
    });
  }
};
