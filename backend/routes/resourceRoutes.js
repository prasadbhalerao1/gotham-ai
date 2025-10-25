import express from 'express';
import {
  getAllResources,
  getResourceBySlug,
  getFeaturedResources,
  createResource,
} from '../controllers/resourceController.js';

const router = express.Router();

router.get('/', getAllResources);
router.get('/featured', getFeaturedResources);
router.get('/:slug', getResourceBySlug);
router.post('/', createResource);

export default router;
