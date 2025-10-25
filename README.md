# 🚀 Gotham AI

**Gotham AI** is a student-driven community dedicated to exploring the transformative world of Artificial Intelligence.  
We connect learners, developers, and innovators through engaging events, workshops, and projects that foster creativity, collaboration, and technical growth.  

Our mission is to **empower the next generation of AI enthusiasts** to turn ideas into impact — shaping the intelligent future, together.


## 🌟 Overview

Gotham AI is a comprehensive platform designed to bring together AI enthusiasts, researchers, and learners. It features:

- **Dynamic Events System** - Showcase AI workshops, seminars, and tech talks
- **Resources Hub** - Curated AI/ML learning materials with advanced filtering
- **Contact System** - Beautiful form with email integration
- **Professional Animations** - GSAP and Framer Motion for smooth UX
- **Data-Driven** - Content managed through MongoDB, no code changes needed

---

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
└── README.md              # This file
```

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

## 🚀 Key API Endpoints

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

## 🌟 Star This Repository

If you find this project useful, please consider giving it a star! ⭐

---

<div align="center">

**Built with ❤️ for the Gotham AI Community**

</div>
