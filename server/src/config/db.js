import mongoose from "mongoose";
import dns from "dns";

// Force Node.js DNS to use Google Public DNS to resolve MongoDB Atlas SRV records cleanly on Windows
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // Ignore if custom DNS fallback fails
}

// Disable command buffering globally so queries fail immediately if MongoDB is not connected
mongoose.set("bufferCommands", false);

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campusfix";
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.warn("[MongoDB Info] Server is running without database connection. API requests requiring DB will return 503 until Mongo is connected.");
    return null;
  }
};

export const checkDBConnection = (req, res, next) => {
  // readyState 1 means connected
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message:
        "Database is not connected. If using MongoDB Atlas, check your internet connection and ensure 0.0.0.0/0 is allowed in MongoDB Atlas Network Access. If using local MongoDB, start the service (e.g. `mongod`).",
    });
  }
  next();
};
