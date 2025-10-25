import express from 'express';
import { submitContact, getAllContacts } from '../controllers/contactController.js';
import { validateContact } from '../middleware/validators.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: 'Too many contact submissions from this IP, please try again later.',
});

router.post('/', contactLimiter, validateContact, submitContact);
router.get('/', getAllContacts);

export default router;
