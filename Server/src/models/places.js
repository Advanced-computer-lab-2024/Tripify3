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
        type: String,  // Corrected type declaration for array elements
        required: [true, "At least one picture is required"],
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
        required: [true, "Foreigner price is required"],
      },
      native: {
        type: Number,
        required: [true, "Native price is required"],
      },
      student: {
        type: Number,
        required: [true, "Student price is required"],
      },
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ], // Array of tags related to the place
  },
  { timestamps: true }
);

const places = mongoose.model("Place", placeSchema);  // Capitalized model name
export default places;
