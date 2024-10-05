import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import initializeRoutes from "./routes/routes.js";
import cors from "cors";
dotenv.config(); // Load environment variables

class App {
  constructor() {
    this.app = express();
    this.port = 8000; // Set your desired port here
    this.DB = "mongodb+srv://ahmed:1hjIW2fvqI1VzdsR@tripify.wbf1o.mongodb.net/?retryWrites=true&w=majority&appName=Tripify"; // Directly use your MongoDB URI
    this.env = "development"; // You can set your environment directly
  }

  // Connect to MongoDB
  async connectToDatabase() {
    await mongoose
      .connect(this.DB)
      .then(() => {
        console.log("MongoDB connected successfully!");
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
      });
  }

  // Middlewares (CORS, JSON parsing, etc.)
  initializeMiddlewares() {
    //Intialize morgan for logging
    if (this.env === "development") {
      this.app.use(morgan("dev"));
    }
    // Enable CORS for all routes
    this.app.use(cors());
    this.app.use(express.json()); // Parse incoming JSON requests
    initializeRoutes(this.app); // Initialize routes
  }

  // Start the server
  listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server is running on port ${this.port}`);
    });
  }

  getServer() {
    return this.app;
  }
}

export default App;
