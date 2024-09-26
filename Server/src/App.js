import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import initializeRoutes from "./routes/routes.js";

dotenv.config(); // Load environment variables

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8000;
    this.env = process.env.NODE_ENV || "development";  
    initializeRoutes(this.app); // Initialize routes
  }

  // Connect to MongoDB
  connectToDatabase() {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("MongoDB connected successfully!");
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
      });
  }

  // Middlewares (CORS, JSON parsing, etc.)
  initializeMiddlewares() {
    this.app.use(cors()); // Enable Cross-Origin Resource Sharing
    this.app.use(express.json()); // Parse incoming JSON requests
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
