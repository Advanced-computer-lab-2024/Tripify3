import TourGuide from "../models/tourGuide.js";


export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await TourGuide.findOne({ username });
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
    const { username, email, password } = req.body;
    const existingUser = await TourGuide.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Create a new user instance
    const newTourGuide = new TourGuide({
      username,
      email,
      password,
    });

    // Save the user to the database
    await newTourGuide.save();

    // Respond with success message and user data
    res.status(201).json({ message: "User created successfully", user: newTourGuide });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


