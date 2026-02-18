## Content Authoring Guide

This project keeps events, projects, and resources in the backend database and exposes them through the REST API that the React frontend consumes. Follow the checklists below whenever you want to seed new entries or update existing ones.

> For detailed schema documentation, see the backend model files in `backend/models/`.

---

### 1. Adding or Updating an Event

1. **Backend schema reference**
   - See `backend/models/Event.js` for the full list of fields.
   - Required: `title`, `slug`, `description`, `content`, `dateDisplay`, `location`, `image`.
   - Optional helpers:
     - `gallery`: array of image paths for the event detail carousel.
     - `speakers`: array of `{ name, title, bio, image }`. Any blank field is simply hidden on the UI.
     - `galleryOnly`: set to `true` when you want the "photo gallery only" detail layout.
     - `time`, `date`, `category`, `attendees`, `registrationLink`: all optional.

2. **Seed data (development)**
   - Edit `backend/scripts/data/events.js`.
   - Append a new object inside the `events` array. Use the existing entries as examples.
   - Keep `slug` unique and lowercase.
   - If you add new local images, place them under `frontend/public/img/` so both the frontend and backend can serve them.
   - Run `cd backend && npm run seed` to reseed your local Mongo instance.

3. **Deploying**
   - In production, add the document directly in your MongoDB instance (Atlas, Compass, etc.) or run the seed script with the production connection string.
   - No frontend changes are required — the Events components read straight from the API.

---

### 2. Adding or Updating a Project

1. **Backend schema reference**
   - See `backend/models/Project.js` for the full list of fields.
   - Required: `title`, `slug`, `shortDescription`, `overview`, `industryPartner`, `source`.
   - Optional helpers:
     - `keyCapabilities`: array of strings describing what the project can do.
     - `projectTeam`: array of `{ name, role }`.
     - `gallery`: array of image paths for project photos.
     - `disableDetail`: set to `true` to prevent clicking through to a detail page.
     - `heroImage`: background image for the detail page header (defaults to `/img/about.webp`).

2. **Seed data (development)**
   - Edit `backend/scripts/data/projects.js`.
   - Append a new object. Keep `slug` unique and lowercase.
   - Run `cd backend && npm run seed` to reseed.

3. **Deploying**
   - Same as events — add directly to MongoDB in production.

---

### 3. Adding or Updating a Resource

1. **Backend schema reference**
   - See `backend/models/Resource.js` for required fields.
   - Required: `title`, `slug`, `description`, `type`, `category`.
   - Optional fields: `difficulty` (defaults to "Beginner"), `image`, `url`, `content`, `author`, `featured`, `published`.

2. **Seed data (development)**
   - Edit `backend/scripts/data/resources.js`.
   - Keep `slug` unique and store any supporting images under `frontend/public/img/`.
   - Run `cd backend && npm run seed` to reseed.

3. **Production updates**
   - Insert or edit the document in MongoDB through your preferred admin tool.
   - The Resources list automatically reflects the new data after the next fetch.

---

### 4. Frontend Considerations

- **Images**: because the frontend is built with Vite, any image placed under `frontend/public/` is served at `/img/…`. Reuse existing assets when possible to keep the bundle lean.
- **Optional fields**: all detail pages guard against missing data. If a field is absent in MongoDB, that section simply won't render.
- **Testing**: after seeding or editing, run the backend (`npm run dev` inside `backend/`) and the frontend (`npm run dev` inside `frontend/`), then verify:
  - `/events` list shows the new card.
  - `/events/:slug` displays the expected layout (full detail vs. gallery-only).
  - `/projects` list shows the new card.
  - `/projects/:slug` displays project details, team, and capabilities.
  - `/resources` lists the new material and routing to `/resources/:slug` works.

Following this workflow keeps development, staging, and production environments in sync and avoids hardcoding content inside the React app.
