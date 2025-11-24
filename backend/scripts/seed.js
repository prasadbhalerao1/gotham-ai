import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";
import Event from "../models/Event.js";
import Resource from "../models/Resource.js";
import Project from "../models/Project.js";
import logger from "../utils/logger.js";

// Import data from separate files
import { events } from "./data/events.js";
import { resources } from "./data/resources.js";
import { projects } from "./data/projects.js";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, "..", ".env") });

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("Connected to MongoDB");

    // Clear existing data
    await Event.deleteMany({});
    await Resource.deleteMany({});
    await Project.deleteMany({});
    logger.info("Cleared existing data");

    // Insert events
    await Event.insertMany(events);
    logger.info(`Inserted ${events.length} events`);

    // Insert resources
    await Resource.insertMany(resources);
    logger.info(`Inserted ${resources.length} resources`);

    await Project.insertMany(projects);
    logger.info(`Inserted ${projects.length} projects`);

    logger.info("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    logger.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
