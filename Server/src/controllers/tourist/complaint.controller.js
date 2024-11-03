import Tourist from "../../models/tourist.js";
import Complaint from "../../models/complaint.js";
import User from "../../models/user.js";
// controllers/complaintController.js
import { sendAdminReplyEmail } from '../../middlewares/sendEmail.middleware.js'; 

export const handleAdminReply = async (req, res) => {
  const { touristId, reply } = req.body;

  if (!touristId || !reply) {
    return res.status(400).json({ message: "Tourist ID and reply comment are required." });
  }

  try {
    // Find the user by touristId
    const user = await User.findById(touristId); // Adjust based on your user model
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Send the reply email
    await sendAdminReplyEmail(user, reply);

    // Respond with success
    return res.status(200).json({ message: "Reply sent successfully." });
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
      touristId,
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

export const getComplaintsByUser = async (req, res) => {
  try {
    const { userId } = req.body; 

    const complaints = await Complaint.find({ tourist: userId }).populate("tourist");

    if (!complaints.length) {
      return res.status(404).json({ message: "No complaints found for this user" });
    }

    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

// export const getTouristComplaints = async (req, res) => {
//   try {
//     const { touristId } = req.body; 

//     const complaints = await Complaint.find({ tourist: touristId }).populate("tourist");

//     if (!complaints.length) {
//       return res.status(404).json({ message: "No complaints found for this tourist" });
//     }

//     res.status(200).json(complaints);
//   } catch (error) {
//     console.error("Error fetching tourist complaints:", error);
//     res.status(500).json({ message: "Failed to fetch complaints" });
//   }
// };
