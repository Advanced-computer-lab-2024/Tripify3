import Tourist from "../../models/tourist.js";
import Complaint from "../../models/complaint.js";
import User from "../../models/user.js";
// controllers/complaintController.js
import { sendAdminReplyEmail } from '../../middlewares/sendEmail.middleware.js'; 

export const handleAdminReply = async (req, res) => {
  const { touristId, complaintId, reply } = req.body;

  if (!touristId || !complaintId || !reply) {
    return res.status(400).json({ message: "Tourist ID, complaint ID, and reply comment are required." });
  }

  try {
    // Find the user by touristId
    const user = await User.findById(touristId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the complaint by complaintId
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    // Add the reply to the complaint's adminReplies array
    complaint.adminReplies.push(reply);

    // Save the updated complaint
    await complaint.save();

    // Send the reply email
    await sendAdminReplyEmail(user, reply);

    // Respond with success
    return res.status(200).json({ message: "Reply sent and added to complaint successfully." });
  } catch (error) {
    console.error("Error handling admin reply:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export const createComplaint = async (req, res) => {
  try {
    const { touristId, title, body, date } = req.body;
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    const newComplaint = new Complaint({
      tourist: touristId,
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
    res.status(500).json({ message: "Failed to file complaint" });
  }
};


export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate({
      path: 'tourist',  // Adjust this if the field name differs in your Complaint model
      select: 'username'   // Only retrieve the username field from the Tourist model
    });

    return res.status(200).json({
      message: "Complaints found successfully",
      complaints: complaints,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};




export const getComplaintsForTourist = async (req, res) => {
  const { id } = req.params; // Extract the tourist ID from the request params

  try {
    // Find complaints for the specified tourist
    const complaints = await Complaint.find({ tourist: id })
      .sort({ date: -1 })  // Sort complaints by date, most recent first
      .populate('tourist', 'name email'); // Optionally populate tourist data (e.g., name and email)

    // Return the complaints in the response
    return res.status(200).json({
      message: complaints.length > 0 ? "Complaints found successfully" : "No complaints found for this tourist",
      data: complaints, // Return the complaints, or an empty array if none exist
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Error fetching complaints' });
  }
};

