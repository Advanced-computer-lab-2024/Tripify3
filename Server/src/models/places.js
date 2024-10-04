import mongoose from "mongoose";
const Schema = mongoose.Schema;

const placeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name field is required"],
    },
    description: {
      type: String,
      required: [true, "Description field is required"],
    },
    pictures: [
      {
        type: [String],
        required: [true, "Pictures field is required at least one picture"],
      },
    ],
    location: {
      address: {
        type: String,
        required: [true, "Address field is required"],
      },
      city: {
        type: String,
        required: [true, "City field is required"],
      },
      country: {
        type: String,
        required: [true, "Country field is required"],
      },
    },
    openingHours: {
      friday: {
        type: String,
        default: "Closed",
      },
      saturday: {
        type: String,
        default: "Closed",
      },
      sunday: {
        type: String,
        default: "Closed",
      },
      monday: {
        type: String,
        default: "Closed",
      },
      tuesday: {
        type: String,
        default: "Closed",
      },
      wednesday: {
        type: String,
        default: "Closed",
      },
      thursday: {
        type: String,
        default: "Closed",
      },
    },
    ticketPrices: {
      foreigner: {
        type: Number,
        required: [true, "Foreigner field is required"],
      },
      native: {
        type: Number,
        required: [true, "Native field is required"],
      },
      student: {
        type: Number,
        required: [true, "Student field is required"],
      },
    },
    type: {
      type: String,
      enum: ["Monument", "Religious Site", "Palace/Castle", "Museum", "Historical Place"],
      required: [true,"Please specify the type"],
    },
    historicalPeriod: {
      type: Number,
      required: [true, "Historical period field is required"],
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ], // Array of comments related to the activity
  },
  { timestamps: true }
);

const places = mongoose.model("places", placeSchema);
export default places;
