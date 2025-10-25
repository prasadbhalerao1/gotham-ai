import mongoose from 'mongoose';
import logger from '../utils/logger.js';

// Cache the database connection for serverless
let cachedConnection = null;

const connectDB = async () => {
  // Return cached connection if available (serverless optimization)
  if (cachedConnection && mongoose.connection.readyState === 1) {
    logger.info('Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    // Optimized settings for Vercel serverless
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Increased for cold starts
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Limit connection pool
      minPoolSize: 1,
      maxIdleTimeMS: 10000,
      retryWrites: true,
      retryReads: true,
    });

    cachedConnection = conn;
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
      cachedConnection = null; // Clear cache on error
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
      cachedConnection = null; // Clear cache on disconnect
    });

    // Only set up process handlers in non-serverless environments
    if (process.env.NODE_ENV !== 'production') {
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      });
    }

    return conn;
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    cachedConnection = null;
    
    // Don't exit in serverless, just throw
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    process.exit(1);
  }
};

export default connectDB;
