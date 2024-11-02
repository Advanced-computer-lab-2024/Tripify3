import Tourist from "../../models/tourist.js";
import Complaint from "../../models/complaint.js";

export const createComplaint = async (req, res) => {
  try {
    console.log("reached here")
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
    console.error("Error filing complainttttttt:", error);
    res.status(500).json({ message: "Failed to file complainttttttt" });
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
