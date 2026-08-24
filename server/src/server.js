import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { connectDB, checkDBConnection } from "./config/db.js";
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
  process.env.CLIENT_ORIGIN,
  "https://rgukt-mini-project.netlify.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
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

// Routes with DB connection check
app.use("/api/auth", checkDBConnection, authLimiter, authRoutes);
app.use("/api/complaints", checkDBConnection, complaintRoutes);
app.use("/api/admin", checkDBConnection, adminRoutes);

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
