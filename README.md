# 🚀 Gotham AI Platform

<div align="center">

![Gotham AI](https://img.shields.io/badge/Gotham-AI-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

**A modern, full-stack AI community platform with beautiful animations and seamless user experience**

[Quick Start](#-quick-start) • [Features](#-features) • [Documentation](#-documentation) • [Demo](#-demo)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Gotham AI is a comprehensive platform designed to bring together AI enthusiasts, researchers, and learners. It features:

- **Dynamic Events System** - Showcase AI workshops, seminars, and tech talks
- **Resources Hub** - Curated AI/ML learning materials with advanced filtering
- **Contact System** - Beautiful form with email integration
- **Professional Animations** - GSAP and Framer Motion for smooth UX
- **Data-Driven** - Content managed through MongoDB, no code changes needed

---

## ✨ Features

### 🎯 Core Features

- **📅 Event Management**
  - Dynamic event listing fetched from database
  - Detailed event pages with photo galleries
  - Speaker profiles and event information
  - Status tracking (Live, Upcoming, Past)
  - "Learn More" pages for each event

- **📚 Resources Hub**
  - Searchable resource library
  - Advanced filtering (type, category, difficulty)
  - Resource types: Articles, Tutorials, Videos, Courses, Datasets, Tools
  - Categories: AI, ML, Deep Learning, NLP, Computer Vision, Robotics
  - Difficulty levels: Beginner, Intermediate, Advanced

- **📧 Contact System**
  - Beautiful animated modal form
  - Form validation with Zod
  - Automatic email notifications
  - Thank you emails to users
  - Admin notifications
  - MongoDB storage

- **🎨 Professional UI/UX**
  - Modern, gradient-based design
  - Smooth animations with GSAP
  - Page transitions with Framer Motion
  - Buttery-smooth scrolling with Lenis
  - Fully responsive (mobile, tablet, desktop)
  - Accessible (ARIA labels, keyboard navigation)

### 🔧 Technical Features

- **Backend**
  - RESTful API with Express.js
  - MongoDB with Mongoose ODM
  - Email service with Nodemailer
  - Comprehensive error handling
  - Request validation with Zod
  - Rate limiting and security
  - Structured logging with Winston

- **Frontend**
  - React 18 with Hooks
  - React Router for navigation
  - React Query for data fetching
  - Tailwind CSS for styling
  - Professional animations
  - Optimized performance

---

## 💻 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Email:** Nodemailer (Gmail)
- **Validation:** Zod
- **Logging:** Winston, Morgan
- **Security:** Helmet, CORS, Rate Limiting

### Frontend
- **Library:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State:** React Query (TanStack Query)
- **Styling:** Tailwind CSS
- **Animations:** GSAP, Framer Motion
- **Scrolling:** Lenis
- **Forms:** React Hook Form
- **Validation:** Zod
- **HTTP:** Axios
- **Icons:** Lucide React, React Icons

---

## ⚡ Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free tier works)
- Gmail account with App Password

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tarun-karn/Gotham-AI.git
   cd Gotham-AI
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   npm run seed
   npm run dev
   ```

3. **Set up Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   # .env is already configured
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

**That's it! 🎉**

For detailed setup instructions, see [START_HERE.md](START_HERE.md)

---

## 📁 Project Structure

```
Gotham-AI/
├── backend/                 # Node.js + Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Error handling, validation
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── scripts/            # Database seeding
│   ├── utils/              # Email service, logger
│   ├── server.js           # Main server file
│   └── package.json
│
├── frontend/               # React + Vite frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── config/        # Configuration
│   │   ├── App.jsx        # Main app
│   │   └── main.jsx       # Entry point
│   └── package.json
│
├── START_HERE.md          # Quick start guide
├── QUICK_START.md         # 5-minute setup
├── SETUP_GUIDE.md         # Detailed setup
├── IMPLEMENTATION_SUMMARY.md  # What was built
└── README.md              # This file
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [START_HERE.md](START_HERE.md) | **Start here!** Quick setup guide |
| [QUICK_START.md](QUICK_START.md) | 5-minute quick start |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Comprehensive setup instructions |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Complete feature list |
| [backend/README.md](backend/README.md) | Backend documentation |
| [frontend/README.md](frontend/README.md) | Frontend documentation |

---

## 🖼️ Screenshots

### Home Page
Beautiful hero section with smooth animations and event listings.

### Event Detail Page
Full event information with photo gallery, speakers, and registration.

### Resources Hub
Searchable and filterable resource library with advanced filters.

### Contact Modal
Beautiful animated form with validation and email integration.

---

## 🎯 Key Highlights

### Data-Driven Architecture
- Add content to MongoDB → Appears automatically on website
- No code changes needed for content updates
- Easy to maintain and scale

### Professional Animations
- GSAP for scroll-triggered animations
- Framer Motion for page transitions
- Lenis for smooth scrolling
- Not overwhelming, just perfect

### Email Integration
- Automatic thank you emails to users
- Admin notifications for new contacts
- Beautiful HTML email templates
- Powered by Nodemailer + Gmail

### Security & Performance
- Rate limiting on contact form
- Input validation on both ends
- CORS protection
- MongoDB injection protection
- React Query caching
- Optimized builds

---

## 🚀 API Endpoints

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

---

## 🌐 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, events, about, contact |
| `/events/:slug` | Event detail page with gallery and speakers |
| `/resources` | Resources hub with search and filters |
| `/resources/:slug` | Resource detail page with full information |

---

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173
EMAIL_USER=your_gmail@gmail.com
EMAIL_APP_PASSWORD=your_app_password
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Testing

### Test Contact Form
1. Click "Contact Us"
2. Fill out the form
3. Submit
4. Check email for confirmation
5. Check MongoDB for entry

### Test Events
1. Browse events on home page
2. Click "Learn More"
3. View event details
4. Check gallery and speakers

### Test Resources
1. Navigate to Resources page
2. Try search functionality
3. Use filters
4. Click on a resource

---

## 🚢 Deployment

### Live Deployment

- **Frontend:** [https://gotham-ai-two.vercel.app/](https://gotham-ai-two.vercel.app/)
- **Backend API:** [https://gotham-backend.vercel.app/](https://gotham-backend.vercel.app/)

### Deploy Your Own

#### Backend (Vercel)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Vercel deployment config"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `backend` folder as root directory
   - Add environment variables:
     - `MONGODB_URI` - Your MongoDB connection string
     - `NODE_ENV` - `production`
     - `FRONTEND_ORIGIN` - Your frontend URL (e.g., `https://gotham-ai-two.vercel.app`)
     - `EMAIL_USER` - Your Gmail address
     - `EMAIL_APP_PASSWORD` - Your Gmail app password
     - `JWT_SECRET` - A secure random string
   - Click "Deploy"

3. **Configure MongoDB Atlas**
   - Add Vercel's IP addresses to MongoDB Atlas Network Access
   - Or allow access from anywhere (0.0.0.0/0) for serverless deployments

#### Frontend (Vercel)

1. **Deploy to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as root directory
   - Add environment variable:
     - `VITE_API_URL` - Your backend API URL (e.g., `https://gotham-backend.vercel.app/api`)
   - Build command: `npm run build`
   - Output directory: `dist`
   - Click "Deploy"

2. **Update Backend CORS**
   - After frontend deployment, update `FRONTEND_ORIGIN` in backend environment variables
   - Redeploy backend if needed

### Database
- **MongoDB Atlas** (already cloud-based)
- Configure network access (allow Vercel IPs or 0.0.0.0/0)
- Set up database users
- Enable backups

### Alternative Deployment Options

#### Backend
- **Render:** Free tier available, easy setup
- **Railway:** Great for Node.js apps
- **Fly.io:** Global edge deployment

#### Frontend
- **Netlify:** Similar to Vercel
- **Cloudflare Pages:** Fast global CDN
- **GitHub Pages:** Free static hosting

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **React Team** - For the amazing library
- **Vercel** - For Vite and hosting
- **MongoDB** - For the database
- **GSAP** - For professional animations
- **Framer** - For Framer Motion
- **Tailwind Labs** - For Tailwind CSS

---

## 📧 Contact

**Project Maintainer:** Tarun Karn

**Email:** prasadbhalerao279@gmail.com

**GitHub:** [@tarun-karn](https://github.com/tarun-karn)

---

## 🌟 Star This Repository

If you find this project useful, please consider giving it a star! ⭐

---

<div align="center">

**Built with ❤️ for the AI Community**

[Report Bug](https://github.com/tarun-karn/Gotham-AI/issues) • [Request Feature](https://github.com/tarun-karn/Gotham-AI/issues)

</div>
