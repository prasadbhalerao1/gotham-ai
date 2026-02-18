# 🚀 Gotham AI Frontend

Modern, animated React frontend for the Gotham AI platform with beautiful UI/UX, professional animations, and seamless backend integration.

## ✨ Features

- 🎨 **Beautiful UI/UX:** Modern design with Tailwind CSS, custom components, and professional animations
- ✨ **Professional Animations:** GSAP, Framer Motion, and smooth scroll with Lenis
- 📱 **Fully Responsive:** Mobile-first design that works on all devices
- 🎯 **Data-Driven:** Dynamic events and resources fetched from backend API
- 📧 **Contact Modal:** Beautiful form with validation and email integration
- 🖼️ **Image Galleries:** React Image Gallery for event photos
- 🔍 **Advanced Filtering:** Search and filter resources by type, category, and difficulty
- ⚡ **Optimized Performance:** React Query for caching and Vite for fast builds
- 🎭 **Smooth Navigation:** React Router with animated page transitions

---

## 💻 Tech Stack

### Core

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Query (TanStack Query)** - Data fetching and caching

### Styling & UI

- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **GSAP** - Professional animations
- **Lenis** - Smooth scrolling
- **Lucide React** - Icon library
- **React Icons** - Additional icons

### Forms & Validation

- **React Hook Form** - Form management
- **Zod** - Schema validation
- **@hookform/resolvers** - Form validation integration

### Additional Libraries

- **Axios** - HTTP client
- **React Image Gallery** - Image carousel
- **React Masonry CSS** - Masonry layouts
- **Clsx** - Conditional classnames
- **Date-fns** - Date formatting

---

## 🚀 Getting Started

Follow these simple steps to get a local copy up and running.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

- **npm**
  ```sh
  npm install npm@latest -g
  ```

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/tarun-karn/Gotham-AI.git
    cd Gotham-AI/frontend
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Set up environment variables**

    ```bash
    cp .env.example .env
    ```

    Update `.env` with your backend API URL:

    ```env
    # For local development
    VITE_API_URL=http://localhost:5000/api

    # For production (use your deployed backend URL)
    # VITE_API_URL=https://gotham-backend.vercel.app/api
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

5.  **Build for production**
    ```bash
    npm run build
    npm run preview
    ```

---

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
│   ├── img/            # Images
│   └── audio/          # Audio files
├── src/
│   ├── components/     # Reusable components
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ContactModal.jsx
│   │   └── ...
│   ├── pages/          # Page components
│   │   ├── HomePage.jsx
│   │   ├── EventsPage.jsx
│   │   ├── EventDetailPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── ProjectDetailPage.jsx
│   │   ├── ResourcesPage.jsx
│   │   └── ResourceDetailPage.jsx
│   ├── services/       # API service functions
│   │   ├── eventService.js
│   │   ├── projectService.js
│   │   ├── resourceService.js
│   │   └── contactService.js
│   ├── config/         # Configuration files
│   │   └── api.js
│   ├── data/           # Static data (fallback)
│   ├── assets/         # Images, fonts, etc.
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── .env.example        # Environment variables template
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🎨 Key Features Explained

### Event System

- **Event Listing:** Dynamic grid of events fetched from backend
- **Event Details:** Full event page with image gallery and registration
- **Learn More:** Each event has a dedicated detail page with rich content

### Resources Hub

- **Searchable:** Real-time search across titles and descriptions
- **Filterable:** Filter by type (article, video, course, etc.), category, and difficulty
- **Resource Details:** Dedicated pages for each resource with full information

### Contact Modal

- **Form Validation:** Client-side validation with Zod
- **Email Integration:** Automatic thank-you emails via backend
- **Beautiful UI:** Animated modal with professional design
- **Error Handling:** Clear error messages and loading states

### Animations

- **GSAP:** Scroll-triggered animations, stagger effects, and timeline animations
- **Framer Motion:** Page transitions, hover effects, and micro-interactions
- **Lenis:** Buttery-smooth scrolling experience
- **Optimized:** Respects `prefers-reduced-motion` for accessibility

---

## 🔧 Configuration

### API Integration

The app connects to the backend API. Configure the API URL in `.env`:

```env
# Local development
VITE_API_URL=http://localhost:5000/api

# Production (Vercel)
VITE_API_URL=https://gotham-backend.vercel.app/api
```

### React Query

Configured with sensible defaults:

- 5-minute stale time
- No refetch on window focus
- 1 retry on failure

---

## 📱 Pages

### Home (`/`)

- Hero section with animated title
- Events listing
- About section
- Contact CTA

### Event Detail (`/events/:slug`)

- Event header with image
- Date, time, location, attendees
- Full event description
- Photo gallery
- Speakers section
- Registration CTA

### Resources (`/resources`)

- Search bar
- Advanced filters
- Resource grid

### Resource Detail (`/resources/:slug`)

- Resource header with category, type, and difficulty badges
- Full description
- External link to resource

---

## 🎯 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🚀 Deployment

### Live Deployment

**Frontend:** [https://gotham-ai-two.vercel.app/](https://gotham-ai-two.vercel.app/)

### Deploy to Vercel

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Deploy on Vercel**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as root directory
   - Add environment variable:
     - `VITE_API_URL` = `https://gotham-backend.vercel.app/api`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Framework preset: Vite
   - Click "Deploy"

3. **Verify Deployment**
   - Check the deployment URL
   - Test all features
   - Verify API connectivity

### Environment Variables for Production

```env
VITE_API_URL=https://gotham-backend.vercel.app/api
```

### Build Configuration

The `vercel.json` file is already configured with:

- SPA routing (all routes redirect to index.html)
- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

We welcome contributions from everyone!
