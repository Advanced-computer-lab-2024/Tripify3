import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import initializeRoutes from "./routes/routes.js";
import cors from "cors";
import path from "path"; // Import path module
import { fileURLToPath } from "url"; // Import fileURLToPath for getting the directory name

dotenv.config(); // Load environment variables

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8000;
    this.DB = "mongodb+srv://ahmed:1hjIW2fvqI1VzdsR@tripify.wbf1o.mongodb.net/Tripify?retryWrites=true&w=majority&appName=Tripify"
    this.env = process.env.NODE_ENV || "development";

    this.__dirname = path.dirname(fileURLToPath(import.meta.url)); // Set __dirname
  }

  // Connect to MongoDB
  async connectToDatabase() {
    if (this.env === "development") {
      this.app.use(morgan("dev"));
    }
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
    // Enable CORS for all routes
    this.app.use(cors());
    this.app.use(express.json()); // Parse incoming JSON requests

    // Serve static files from the 'uploads' directory
    this.app.use("/uploads", express.static(path.join(this.__dirname, "uploads")));

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
