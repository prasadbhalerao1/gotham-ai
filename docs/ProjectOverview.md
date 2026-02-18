# Gotham AI — Project Overview

Gotham AI is a community-driven platform built around artificial intelligence education and collaboration, created at **JSPM RSCOE, Tathawade** in partnership with **Versanix Technologies**.

---

## What This Project Does

The platform serves as a hub for the Gotham AI community:

- **Events** — Browse workshops, tech talks, gaming nights, and seminars. Each event has full details, image galleries, and registration links.
- **Projects** — Showcase AI/ML projects built by members with industry partners. Includes team info, capabilities, and galleries.
- **Resources** — A curated library of articles, tutorials, videos, courses, and books on AI/ML topics, filterable by type, difficulty, and category.
- **Contact** — A contact form with email notifications to both the admin and the sender.

---

## Tech Stack

| Layer      | Technology                                 |
| ---------- | ------------------------------------------ |
| Frontend   | React 18, Vite, Tailwind CSS               |
| Backend    | Node.js, Express.js                        |
| Database   | MongoDB Atlas (via Mongoose)               |
| Animations | GSAP, Framer Motion, Lenis (smooth scroll) |
| Email      | Nodemailer (Gmail SMTP)                    |
| Hosting    | Vercel (both frontend and backend)         |

---

## Architecture

```
┌────────────────────┐         ┌───────────────────────┐
│   React Frontend   │ ──────▶ │   Express Backend     │
│   (Vercel Static)  │  REST   │  (Vercel Serverless)  │
└────────────────────┘         └────────┬──────────────┘
                                        │
                                        ▼
                               ┌────────────────────┐
                               │  MongoDB Atlas     │
                               └────────────────────┘
```

**Frontend** — A single-page React app with lazy-loaded routes. Fetches data via Axios through a service layer. Uses React Query for caching. Heavy use of GSAP and Framer Motion for animations.

**Backend** — Express REST API with 4 route groups: Contact, Events, Projects, Resources. Uses Zod validation, rate limiting, Helmet security headers, and Winston logging. Sends email notifications on contact form submission.

**Database** — MongoDB Atlas with 4 collections: contacts, events, projects, resources. Each has a Mongoose schema with validation, indexes, and auto-generated timestamps.

---

## How to Run Locally

```bash
# Backend
cd backend
npm install
npm run dev          # Starts on http://localhost:5000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev          # Starts on http://localhost:5173
```

Both need `.env` files — see the READMEs in `backend/` and `frontend/` for required variables.

To populate the database with sample data:

```bash
cd backend
npm run seed
```

---

## Key Routes

| URL                | What it shows                                 |
| ------------------ | --------------------------------------------- |
| `/`                | Homepage — Hero video, About, Events, Contact |
| `/events`          | All events with search and category filters   |
| `/events/:slug`    | Event detail with gallery                     |
| `/projects`        | All projects with search                      |
| `/projects/:slug`  | Project detail with team and capabilities     |
| `/resources`       | Resource library with search                  |
| `/resources/:slug` | Resource detail with external link            |

---

## API Endpoints

| Method | Path                      | Description                  |
| ------ | ------------------------- | ---------------------------- |
| POST   | `/api/contact`            | Submit contact form          |
| GET    | `/api/events`             | List all events              |
| GET    | `/api/events/:slug`       | Get event by slug            |
| GET    | `/api/projects`           | List all projects            |
| GET    | `/api/projects/:slug`     | Get project by slug          |
| GET    | `/api/resources`          | List resources (with search) |
| GET    | `/api/resources/featured` | Get featured resources       |
| GET    | `/api/resources/:slug`    | Get resource by slug         |

---

## Deployment

Both frontend and backend are deployed to **Vercel**:

- Frontend: Static build (`npm run build` → `dist/`)
- Backend: Serverless function (single `server.js` entry)
- Environment variables set in Vercel dashboard

See the root [README.md](../README.md) for step-by-step deployment instructions.
