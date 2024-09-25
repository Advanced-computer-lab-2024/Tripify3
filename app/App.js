import dotenv from "dotenv";
dotenv.config({ path: "app/.env" });
import express from "express";
import mongoose from "mongoose";

import initializeRoutes from "./routes/routes.js";

// Load environment variables from the .env file

const app = express();
const port = process.env.PORT || 8000;

// Middleware for parsing JSON
app.use(express.json());

// Initialize all routes
initializeRoutes(app);

// MongoDB connection using the environment variable from .env
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB is now connected!");

    // Start the server
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
      console.log("Server up and running!");
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
