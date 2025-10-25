import { z } from 'zod';
import { AppError } from './errorHandler.js';

// Contact form validation schema
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  email: z.string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),
  subject: z.string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject cannot exceed 200 characters')
    .trim(),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message cannot exceed 2000 characters')
    .trim(),
  phone: z.string()
    .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, 'Please provide a valid phone number')
    .optional()
    .or(z.literal('')),
});

// Validation middleware
export const validateContact = (req, res, next) => {
  try {
    const validatedData = contactSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message).join(', ');
      throw new AppError(errors, 400);
    }
    next(error);
  }
};
