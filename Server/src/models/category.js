import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  activities: [{  // Changed activity to activities (array of references)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  }],  // Array of references to the Activity model
  type: {
    type: String,
    required: true
  },  // Type of category
});

const category = mongoose.model('Category', categorySchema);

export default category;
