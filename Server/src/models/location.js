import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Monument", "Religious Site", "Palace/Castle", "Museum", "Historical Place"],
    required: true,
  }, // Type of location
  description: {
    type: String,
    required: true,
  }, // Description of the location
  pictures: {
    type: [String],
    required: true,
  }, // Array of picture URLs
  location: {
    type: String,
    required: true,
  }, // Geographical location
  openingHours: {
    type: String,
    required: true,
  }, // Opening hours of the location
  ticketPrices: {
    foreigner: { type: Number, required: true },
    student: { type: Number, required: true },
    native: { type: Number, required: true },
  }, // Ticket prices based on category
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ], 
});

const Location = mongoose.model("Location", locationSchema);

export default Location;
