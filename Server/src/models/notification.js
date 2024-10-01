import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  readStatus: { type: Boolean, default: false },
});

const notification = mongoose.model('Notification', notificationSchema);

export default notification;
