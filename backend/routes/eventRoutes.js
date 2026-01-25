import express from "express";
import {
  getAllEvents,
  getEventBySlug,
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:slug", getEventBySlug);

export default router;
