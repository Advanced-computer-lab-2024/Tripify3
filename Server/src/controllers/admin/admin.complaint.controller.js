import complaint from "../../models/complaint.js";

export const getComplaintById = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const complaintDetails = await complaint.findOne({ _id: complaintId });
    return res.status(200).json({
      message: "Complaint found successfully",
      complaint: complaintDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const markStatus = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const status = req.body.status;
    const complaintDetails = await complaint.findOne({ _id: complaintId });
    complaintDetails.status = status;
    await complaintDetails.save();
    return res.status(200).json({
      message: "Complaint updated successfully",
      complaint: complaintDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
