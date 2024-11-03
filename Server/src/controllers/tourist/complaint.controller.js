import Tourist from "../../models/tourist.js";
import Complaint from "../../models/complaint.js";

export const createComplaint = async (req, res) => {
  try {
    console.log("reached here")
    const { complainer, title, body, date } = req.body;
    const tourist = await Tourist.findById(complainer);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    const newComplaint = new Complaint({
      complainer: tourist,
      title,
      body,
      date,
    });

    await newComplaint.save();

    res.status(201).json({
      message: "Complaint filed successfully",
      complaint: newComplaint,
    });
  } catch (error) {
    console.error("Error filing complainttttttt:", error);
    res.status(500).json({ message: "Failed to file complainttttttt" });
  }
};

export const getComplaintsByUser = async (req, res) => {
  try {
    const { userId } = req.body; 

    const complaints = await Complaint.find({ complainer: userId }).populate("tourist");

    if (!complaints.length) {
      return res.status(404).json({ message: "No complaints found for this user" });
    }

    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};


export const getTouristComplaints = async (req, res) => {
  const { id } = req.params;

  try {
    // Find complaints associated with the tourist ID
    const complaints = await Complaint.find({ complainer: id }).populate('complainer');
    
    if (!complaints) {
      return res.status(404).json({ message: 'No complaints found for this tourist.' });
    }
    
    return res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};


export const getAllComplaints = async (req, res) => {
  try {
    // Fetch all complaints from the database
    const complaints = await Complaint.find().populate('complainer'); // Populate if you want to include complainer details

    // Respond with the list of complaints
    res.status(200).json({
      message: 'Complaints retrieved successfully',
      complaints,
    });
  } catch (error) {
    console.error("Error retrieving complaints:", error);
    res.status(500).json({ message: 'Failed to retrieve complaints' });
  }
};

export const getAllTourists = async (req, res) => {
  try {
    // Retrieve all tourists from the database
    const tourists = await Tourist.find().populate('complaints'); // Populate complaints if needed

    // Check if any tourists were found
    if (!tourists || tourists.length === 0) {
      return res.status(404).json({ message: 'No tourists found.' });
    }

    // Send back the list of tourists
    res.status(200).json({
      message: 'Tourists retrieved successfully',
      tourists,
    });
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error('Error fetching tourists:', error);
    res.status(500).json({ message: 'Error fetching tourists', error: error.message });
  }
};