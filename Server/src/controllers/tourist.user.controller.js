import tourist from "../models/tourist.js"; // Adjust the path as necessary
import bookings from "../models/bookings.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await tourist.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password." });
    }

    res.status(200).json({ message: "Login successful", user: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, dateOfBirth, phoneNumber, username, nationality, password, occupation } = req.body;

    const existingUser = await tourist.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Create a new user instance
    const newTourist = new tourist({
      name,
      username,
      email,
      dateOfBirth,
      phoneNumber,
      nationality,
      password,
      occupation,
    });

    // Save the user to the database
    await newTourist.save();

    // Respond with success message and user data
    res.status(201).json({ message: "User created successfully", user: newTourist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const cancelbooking = async (req,res)=>{
  const{bookingid,touristid}=req.body
  try{
    console.log(bookings.find({bookingid}))
  const existingbooking = await bookings.findByIdAndDelete({ bookingid });
    if (!existingbooking) {
      return res.status(400).json({ message: "booking is not avaliable." });
    }
    res.status(200).json({ message: 'booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting booking' });
  }
}

export const changePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    // Validate required fields
    if (!username || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find the user by username
    const user = await tourist.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the old password matches
    if (user.password !== oldPassword) {
      return res.status(401).json({ message: "Invalid old password." });
    }

    // Ensure new password is different from the old password
    if (oldPassword === newPassword) {
      return res.status(400).json({ message: "New password cannot be the same as the old password." });
    }

    // Update the password and save it to the database
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
