import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true
  },
  Age: {
    type: Number,
    required: true,
  },
  Phone_Number : {
    type: Number,
    required: true,
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;