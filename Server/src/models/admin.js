import mongoose from "mongoose";
import User from "./user.js";

// Define the Admin schema, inheriting from User but omitting the 'email' field
const adminSchema = new mongoose.Schema({});

// Modify the User schema to make 'email' optional for Admin
const Admin = User.discriminator(
  "Admin",
  adminSchema,
  {
    email: {
      type: String,
      required: [function() { return this.type !== 'Admin'; }, 'Email is required for non-admin users.'],
    },
  }
);

export default Admin;
