import Contact from "../models/Contact.js";
import {
  sendThankYouEmail,
  sendAdminNotification,
} from "../utils/emailService.js";
import logger from "../utils/logger.js";
import { AppError } from "../middleware/errorHandler.js";

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message, phone } = req.body;

    // Get IP address
    const ipAddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Create contact entry
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      phone,
      ipAddress,
    });

    logger.info(`New contact submission from ${email}`);

    // Send emails asynchronously (don't wait for them)
    Promise.all([
      sendThankYouEmail(email, name),
      sendAdminNotification({ name, email, subject, message, phone }),
    ]).catch((error) => {
      logger.error("Error sending emails:", error);
    });

    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We will get back to you soon.",
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
