import express from "express";
import {
  getAllResources,
  getResourceBySlug,
  getFeaturedResources,
} from "../controllers/resourceController.js";

const router = express.Router();

router.get("/", getAllResources);
router.get("/featured", getFeaturedResources);
router.get("/:slug", getResourceBySlug);

export default router;
