import mongoose from "mongoose";
import User from "./user.js";
// Define the Admin schema, inheriting from User but omitting the 'email' field
const adminSchema = new mongoose.Schema({});

// Create the Admin model by using the discriminator and removing the 'email' field
const Admin = User.discriminator(
  "Admin",
  adminSchema,
  { email: false } // Omitting the email field for Admin
);

export default Admin;
