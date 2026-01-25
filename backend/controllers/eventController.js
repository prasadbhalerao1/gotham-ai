import Event from "../models/Event.js";
import logger from "../utils/logger.js";
import { AppError } from "../middleware/errorHandler.js";

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getAllEvents = async (req, res, next) => {
  try {
    const { status, category, published = true } = req.query;

    const query = { published };
    if (status) query.status = status;
    if (category) query.category = category;

    const events = await Event.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by slug
// @route   GET /api/events/:slug
// @access  Public
export const getEventBySlug = async (req, res, next) => {
  try {
    const event = await Event.findOne({
      slug: req.params.slug,
      published: true,
    });

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};
