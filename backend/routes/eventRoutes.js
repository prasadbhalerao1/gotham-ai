import express from 'express';
import {
  getAllEvents,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:slug', getEventBySlug);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
