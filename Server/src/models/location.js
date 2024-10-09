// import mongoose from "mongoose";

// const locationSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     enum: ["Monument", "Religious Site", "Palace", "Museum", "Historical Place"],
//     required: true,
//   }, // Type of location
//   description: {
//     type: String,
//     required: true,
//   }, // Description of the location
//   location: {
//     type: String,
//     required: true,
//   }, // Geographical location
//   openingHours: {
//     type: String,
//     required: true,
//   }, // Opening hours of the location
//   tags: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Tag",
//     },
//   ], 
// });

// const Location = mongoose.model("Location", locationSchema);

// export default Location;
