import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS setup
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || "http://localhost:3000",
  "http://localhost:8000",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev mode for flexibility
      }
    },
    credentials: true,
  })
);

// Express Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Auth Rate Limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many authentication requests, please try again later.",
  },
});

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CampusFix API server is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send("CampusFix API Server is active.");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `[CampusFix Server] Running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});
