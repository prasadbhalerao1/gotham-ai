import nodemailer from 'nodemailer';
import logger from './logger.js';

// Create transporter with Gmail configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use false for STARTTLS; true for SSL on port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
};

// Send thank you email to user
export const sendThankYouEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Gotham AI Team" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Thank You for Contacting Gotham AI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚀 Gotham AI</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>Thank you for reaching out to Gotham AI. We've received your message and our team will get back to you as soon as possible.</p>
            <p>We're excited to connect with you and discuss how we can help you on your AI journey!</p>
            <p>In the meantime, feel free to explore our resources and upcoming events:</p>
            <a href="${process.env.FRONTEND_ORIGIN}/events" class="button">View Events</a>
            <a href="${process.env.FRONTEND_ORIGIN}/resources" class="button">Explore Resources</a>
            <p style="margin-top: 30px;">Best regards,<br><strong>The Gotham AI Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Gotham AI. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `Hello ${userName}!\n\nThank you for reaching out to Gotham AI. We've received your message and our team will get back to you as soon as possible.\n\nWe're excited to connect with you and discuss how we can help you on your AI journey!\n\nBest regards,\nThe Gotham AI Team`,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Thank you email sent to ${userEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending thank you email:', error);
    throw error;
  }
};

// Send notification email to admin
export const sendAdminNotification = async (contactData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Gotham AI Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${contactData.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: #1a202c;
              color: white;
              padding: 20px;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background: #f7fafc;
              padding: 20px;
              border: 1px solid #e2e8f0;
              border-radius: 0 0 5px 5px;
            }
            .field {
              margin-bottom: 15px;
              padding: 10px;
              background: white;
              border-radius: 5px;
            }
            .label {
              font-weight: bold;
              color: #4a5568;
              display: block;
              margin-bottom: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>📧 New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Name:</span>
              ${contactData.name}
            </div>
            <div class="field">
              <span class="label">Email:</span>
              ${contactData.email}
            </div>
            ${contactData.phone ? `
            <div class="field">
              <span class="label">Phone:</span>
              ${contactData.phone}
            </div>
            ` : ''}
            <div class="field">
              <span class="label">Subject:</span>
              ${contactData.subject}
            </div>
            <div class="field">
              <span class="label">Message:</span>
              ${contactData.message}
            </div>
            <div class="field">
              <span class="label">Submitted At:</span>
              ${new Date().toLocaleString()}
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Admin notification sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending admin notification:', error);
    throw error;
  }
};
