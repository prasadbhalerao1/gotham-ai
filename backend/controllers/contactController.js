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

    logger.info(`New contact submission from ${email}`);

    // Saving a copy is best-effort: the email is what matters, so a database
    // outage must not lose the message.
    let contact = null;
    if (req.dbAvailable !== false) {
      try {
        contact = await Contact.create({ name, email, subject, message, phone, ipAddress });
      } catch (dbError) {
        logger.error("Could not store contact submission:", dbError);
      }
    }

    // Await the notification before replying — on serverless hosts work left
    // running after the response can be cut off, so the email would never send.
    try {
      await sendAdminNotification({ name, email, subject, message, phone });
    } catch (mailError) {
      logger.error("Contact notification failed:", mailError);
      return next(new AppError("We couldn't send your message right now. Please try again in a moment.", 502));
    }

    // The visitor's confirmation is nice-to-have; don't fail the request over it.
    await sendThankYouEmail(email, name).catch((e) => logger.error("Thank-you email failed:", e));

    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We will get back to you soon.",
      data: { id: contact?._id ?? null, name, email },
    });
  } catch (error) {
    next(error);
  }
};
