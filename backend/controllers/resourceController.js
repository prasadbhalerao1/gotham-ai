import Resource from '../models/Resource.js';
import logger from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
export const getAllResources = async (req, res, next) => {
  try {
    const { 
      type, 
      category, 
      difficulty, 
      featured, 
      search,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { published: true };
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (featured) query.featured = featured === 'true';
    
    // Search in title, description, and tags
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (page - 1) * limit;

    const resources = await Resource.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Resource.countDocuments(query);

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resource by slug
// @route   GET /api/resources/:slug
// @access  Public
export const getResourceBySlug = async (req, res, next) => {
  try {
    const resource = await Resource.findOneAndUpdate(
      { slug: req.params.slug, published: true },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured resources
// @route   GET /api/resources/featured
// @access  Public
export const getFeaturedResources = async (req, res, next) => {
  try {
    const resources = await Resource.find({ 
      published: true, 
      featured: true 
    })
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create resource (admin)
// @route   POST /api/resources
// @access  Private (future implementation)
export const createResource = async (req, res, next) => {
  try {
    const resource = await Resource.create(req.body);

    logger.info(`New resource created: ${resource.title}`);

    res.status(201).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};
