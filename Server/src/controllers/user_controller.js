
import user from "../models/user.js"

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await user.findOne({ username });
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
    const {Type,name, email, dateOfBirth, phoneNumber, username, nationality, password, occupation } = req.body;

    const existingUser = await user.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Create a new user instance
    const newTourist = new user({
      Type,
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
export const addBooking = async (req, res) => {
    const { username, tourName, date, price, status } = req.body;
    
    try {
        // Find the user by username
        const foundUser = await user.findOne({ username: username });
        
        if (!foundUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create a new booking object
        const newBooking = {
            tourName: tourName,
            date: date,
            price: price,
            status: status,
        };

        // Add the booking to the user's bookings array
        foundUser.bookings.push(newBooking);
        
        // Save the updated user document
        const updatedUser = await foundUser.save();

        // Respond with the updated user document
        res.status(201).json(updatedUser);
    } catch (error) {
        console.error('Error creating booking:', error.message);
        res.status(400).json({ error: 'Error creating booking', details: error.message });
    }
};
export const changePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    // Validate required fields
    if (!username || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find the user by username
    const user = await user.findOne({ username });
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


///////////////////////////////////////
export const book = async (req, res) => {
    const {Tourname,date,price,status } = req.body;
    try {
      const newBooking = new bookings({
        Tourname,
        date,
        price,
        status
      })
      await newBooking.save();
      res.status(201).json(newBooking);
    }
   catch (error) {
      res.status(400).json({ error: 'Error creating booking', details: error });
    }
  }

  ////////////////////////////////
 