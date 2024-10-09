import mongoose from "mongoose";
const Schema = mongoose.Schema;

const placeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Monument", "Religious Site", "Palace", "Historical Place", "Museum"], // Possible user roles
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pictures: [
      {
        type: String,  // Corrected type declaration for array elements
      },
    ],
    location: {
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
    },
    openingHours: [
      {
        day: {
          type: String,
          required: true, // Day of the week (e.g., Monday, Tuesday)
        },
        from: {
          type: String, // Opening time (e.g., 09:00)
          required: true,
        },
        to: {
          type: String, // Closing time (e.g., 18:00)
          required: true,
        },
      },
    ],
    ticketPrices: {
      foreigner: {
        type: Number,
        required: true
      },
      native: {
        type: Number,
        required: true
      },
      student: {
        type: Number,
        required: true
      },
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ], // Array of tags related to the place
    tourismGovernor: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
     // Array of tags related to the place
  },
  { timestamps: true }
);

const Place = mongoose.model("Place", placeSchema);  // Capitalized model name
export default Place;
