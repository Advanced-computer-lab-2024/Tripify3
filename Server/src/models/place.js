import mongoose from "mongoose";
const Schema = mongoose.Schema;

const placeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 5,
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
        filename: String,
        filepath: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    location: {
      type: String,
      required: true,
    },
    openingDays: [
      {
        type: String,
        required: true, // e.g., 'Monday', 'Tuesday'
      },
    ],
    openingHours: [
      {
        from: {
          type: String, // e.g., '09:00'
          required: true,
        },
        to: {
          type: String, // e.g., '18:00'
          required: true,
        },
      },
    ],
    ticketPrices: {
      foreigner: {
        type: Number,
        required: true,
      },
      native: {
        type: Number,
        required: true,
      },
      student: {
        type: Number,
        required: true,
      },
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ], // Array of tags related to the place
    tourismGovernor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Array of tags related to the place
  },
  { timestamps: true }
);

const Place = mongoose.model("Place", placeSchema); // Capitalized model name
export default Place;
