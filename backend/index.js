import express, { json } from "express";
import cors from "cors";
import { port } from "./src/constant/constant.js";
import errorMiddleware from "./src/middleware/errorMiddleware.js";
import connectToMongoDb from "./src/conectDB/connectToMongoDB.js";

// Import routes
import userRoutes from "./src/routes/userRoutes.js";
import collectionRoutes from "./src/routes/collectionRoutes.js";
import noteRoutes from "./src/routes/noteRoutes.js";

const expressApp = express();

// Middleware
expressApp.use(cors());
expressApp.use(json());

// Routes
expressApp.use("/api/users", userRoutes);
expressApp.use("/api/collections", collectionRoutes);
expressApp.use("/api/notes", noteRoutes);

// Error handling middleware
expressApp.use(errorMiddleware);

// Start server
expressApp.listen(port, () => {
  console.log(`Express app is listening at port ${port}`);
  connectToMongoDb();
});
