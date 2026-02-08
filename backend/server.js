import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import "express-async-errors";

import connectDB from "./config/database.js";
import logger from "./utils/logger.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

import contactRoutes from "./routes/contactRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

const app = express();

// Log startup with visible console output
console.log("\n" + "=".repeat(60));
console.log("🚀 GOTHAM AI BACKEND STARTING...");
console.log("=".repeat(60));
console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
console.log(
  `🗄️  MongoDB URI: ${process.env.MONGODB_URI ? "✓ Configured" : "✗ MISSING"}`,
);
console.log(
  `🌐 Frontend Origin: ${process.env.FRONTEND_ORIGIN || "http://localhost:5173"}`,
);
console.log(
  `📧 Email: ${process.env.EMAIL_USER ? "✓ Configured" : "✗ MISSING"}`,
);
console.log("=".repeat(60) + "\n");

logger.info("🚀 Starting Gotham AI Backend...");
logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
logger.info(`MongoDB URI: ${process.env.MONGODB_URI ? "Set ✓" : "Missing ✗"}`);
logger.info(`Frontend Origin: ${process.env.FRONTEND_ORIGIN || "Not set"}`);

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    logger.error("Database connection failed:", error);
    // Set CORS headers on error
    res.setHeader(
      "Access-Control-Allow-Origin",
      req.headers.origin || "https://gotham-ai-two.vercel.app",
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(500).json({
      success: false,
      error: "Database connection failed",
    });
  }
});

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://gotham-ai-two.vercel.app",
  process.env.FRONTEND_ORIGIN,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions), (req, res) => {
  res.status(200).end();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    }),
  );
}

app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log("✓ Root endpoint hit");
  logger.info("Root endpoint hit");
  res.status(200).json({
    success: true,
    message: "🚀 Gotham AI Backend API",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      contact: "/api/contact",
      events: "/api/events",
      resources: "/api/resources",
      projects: "/api/projects",
    },
  });
});

app.get("/health", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  console.log(`✓ Health check - MongoDB: ${dbStatus}`);
  logger.info(`Health check endpoint hit - MongoDB: ${dbStatus}`);

  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    mongodb: dbStatus,
    uptime: process.uptime(),
  });
});

app.use(
  "/api/contact",
  (req, res, next) => {
    console.log(`→ Contact: ${req.method} ${req.path}`);
    logger.info(`Contact route: ${req.method} ${req.path}`);
    next();
  },
  contactRoutes,
);

app.use(
  "/api/events",
  (req, res, next) => {
    console.log(`→ Events: ${req.method} ${req.path}`);
    logger.info(`Events route: ${req.method} ${req.path}`);
    next();
  },
  eventRoutes,
);

app.use(
  "/api/resources",
  (req, res, next) => {
    console.log(`→ Resources: ${req.method} ${req.path}`);
    logger.info(`Resources route: ${req.method} ${req.path}`);
    next();
  },
  resourceRoutes,
);

app.use(
  "/api/projects",
  (req, res, next) => {
    console.log(`→ Projects: ${req.method} ${req.path}`);
    logger.info(`Projects route: ${req.method} ${req.path}`);
    next();
  },
  projectRoutes,
);

app.use(notFound);

app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log("\n" + "=".repeat(60));
    console.log(`✅ SERVER RUNNING ON PORT ${PORT}`);
    console.log(`📍 Mode: ${process.env.NODE_ENV || "development"}`);
    console.log(`🌐 Local: http://localhost:${PORT}`);
    console.log(`🏥 Health: http://localhost:${PORT}/health`);
    console.log("=".repeat(60) + "\n");

    logger.info(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    );
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err) => {
    logger.error("Unhandled Rejection:", err);
    server.close(() => process.exit(1));
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception:", err);
    process.exit(1);
  });
} else {
  console.log("🚀 Vercel serverless mode - app exported");
  logger.info("Running in Vercel serverless mode");
}

export default app;
