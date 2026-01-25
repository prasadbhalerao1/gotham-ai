import Project from "../models/Project.js";
import logger from "../utils/logger.js";
import { AppError } from "../middleware/errorHandler.js";

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const parseBoolean = (value, defaultValue) => {
  if (value === undefined) return defaultValue;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return defaultValue;
};

export const getAllProjects = async (req, res, next) => {
  try {
    const { status, featured, published } = req.query;

    const query = {
      published: parseBoolean(published, true),
    };
    if (status) query.status = status;
    const normalizedFeatured = parseBoolean(featured, undefined);
    if (normalizedFeatured !== undefined) {
      query.featured = normalizedFeatured;
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project by slug
// @route   GET /api/projects/:slug
// @access  Public
export const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
      published: true,
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};
