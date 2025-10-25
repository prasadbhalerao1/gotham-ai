# Gotham AI Backend

Backend API for the Gotham AI platform built with Node.js, Express, and MongoDB.

## Features

- 🔐 Secure API with CORS, Helmet, and rate limiting
- 📧 Email notifications using Nodemailer (Gmail)
- 🗄️ MongoDB with Mongoose ODM
- ✅ Request validation with Zod
- 📝 Structured logging with Winston
- 🚨 Comprehensive error handling
- 🎯 RESTful API design

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Email**: Nodemailer
- **Validation**: Zod
- **Logging**: Winston & Morgan
- **Security**: Helmet, CORS, Express Rate Limit

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Gmail account with App Password

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
```env
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend Configuration (update for production)
FRONTEND_ORIGIN=http://localhost:5173
# For production: FRONTEND_ORIGIN=https://gotham-ai-two.vercel.app

# Email Configuration
EMAIL_USER=your_gmail@gmail.com
EMAIL_APP_PASSWORD=your_app_password

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

### Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### Seeding the Database

To populate the database with sample events and resources:
```bash
npm run seed
```

## API Endpoints

### Contact

- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (admin)

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:slug` - Get event by slug
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### Resources

- `GET /api/resources` - Get all resources (with filters)
- `GET /api/resources/featured` - Get featured resources
- `GET /api/resources/:slug` - Get resource by slug
- `POST /api/resources` - Create resource (admin)

### Health Check

- `GET /health` - Server health check

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── contactController.js # Contact form logic
│   ├── eventController.js   # Event CRUD operations
│   └── resourceController.js # Resource CRUD operations
├── middleware/
│   ├── errorHandler.js      # Error handling middleware
│   └── validators.js        # Request validation
├── models/
│   ├── Contact.js           # Contact schema
│   ├── Event.js             # Event schema
│   └── Resource.js          # Resource schema
├── routes/
│   ├── contactRoutes.js     # Contact routes
│   ├── eventRoutes.js       # Event routes
│   └── resourceRoutes.js    # Resource routes
├── scripts/
│   └── seed.js              # Database seeding script
├── utils/
│   ├── emailService.js      # Email functionality
│   └── logger.js            # Winston logger configuration
├── logs/                    # Log files (auto-generated)
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── server.js                # Main application file
```

## Email Configuration

### Setting up Gmail App Password

1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification
4. Go to App Passwords
5. Generate a new app password for "Mail"
6. Use this password in your `.env` file

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `FRONTEND_ORIGIN` | Frontend URL for CORS | `http://localhost:5173` |
| `EMAIL_USER` | Gmail address | `your@gmail.com` |
| `EMAIL_APP_PASSWORD` | Gmail app password | `xxxx xxxx xxxx xxxx` |
| `JWT_SECRET` | JWT secret (future use) | `your_secret_key` |

## Error Handling

The API uses a centralized error handling system:

- Custom `AppError` class for operational errors
- Mongoose validation errors are caught and formatted
- All errors are logged with Winston
- Stack traces only shown in development mode

## Rate Limiting

Contact form submissions are rate-limited to prevent abuse:
- 3 submissions per 15 minutes per IP address

## Logging

- Development: Console logging with Morgan
- Production: File logging with Winston
  - `logs/error.log` - Error logs
  - `logs/combined.log` - All logs

## Security Features

- **Helmet**: Sets security-related HTTP headers
- **CORS**: Configured to only allow requests from frontend
- **Rate Limiting**: Prevents abuse of API endpoints
- **Input Validation**: All inputs validated with Zod
- **MongoDB Injection Protection**: Mongoose sanitizes queries

## 🚀 Deployment

### Live Deployment

**Backend API:** [https://gotham-backend.vercel.app/](https://gotham-backend.vercel.app/)

### Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Deploy backend to Vercel"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `backend` folder as root directory
   - Add environment variables:
     - `MONGODB_URI` - Your MongoDB Atlas connection string
     - `NODE_ENV` - `production`
     - `FRONTEND_ORIGIN` - Your frontend URL (e.g., `https://gotham-ai-two.vercel.app`)
     - `EMAIL_USER` - Your Gmail address
     - `EMAIL_APP_PASSWORD` - Your Gmail app password
     - `JWT_SECRET` - A secure random string
   - Click "Deploy"

3. **Configure MongoDB Atlas**
   - Go to MongoDB Atlas Dashboard
   - Navigate to Network Access
   - Add IP Address: `0.0.0.0/0` (allow access from anywhere for serverless)
   - Or add specific Vercel IP ranges

4. **Test the Deployment**
   ```bash
   curl https://gotham-backend.vercel.app/health
   ```

### Environment Variables for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `PORT` | Server port (auto-set by Vercel) | `5000` |
| `NODE_ENV` | Environment mode | `production` |
| `FRONTEND_ORIGIN` | Frontend URL for CORS | `https://gotham-ai-two.vercel.app` |
| `EMAIL_USER` | Gmail address | `your@gmail.com` |
| `EMAIL_APP_PASSWORD` | Gmail app password | `xxxx xxxx xxxx xxxx` |
| `JWT_SECRET` | JWT secret key | `your_secure_secret` |

### Vercel Configuration

The `vercel.json` file is configured with:
- Node.js runtime for serverless functions
- All routes directed to `server.js`
- Production environment variables

### Alternative Deployment Options

- **Render:** Free tier with persistent servers
- **Railway:** Easy Node.js deployment
- **Fly.io:** Global edge deployment
- **Heroku:** Classic PaaS platform

---

## Future Enhancements

- [ ] JWT authentication for admin routes
- [ ] File upload for event images
- [ ] Email queue with BullMQ
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] CI/CD pipeline

## License

MIT
