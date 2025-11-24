## Content Authoring Guide

This project keeps events and resources in the backend database and exposes them through the REST API that the React frontend consumes. Follow the checklists below whenever you want to seed new entries or update existing ones.

---

### 1. Adding or Updating an Event

1. **Backend schema reference**
   - See `backend/models/Event.js` for the full list of fields.
   - Required: `title`, `slug`, `description`, `content`, `dateDisplay`, `time`, `location`, `image`.
   - Optional helpers:
     - `gallery`: array of image paths for the event detail carousel.
     - `speakers`: array of `{ name, title, bio, image }`. Any blank field is simply hidden on the UI.
     - `galleryOnly`: set to `true` when you want the “photo gallery only” detail layout.

2. **Seed data (development)**
   - Modify `backend/scripts/seed.js`.
   - Append a new object inside the `events` array. Use the existing entries as examples.
   - Keep `slug` unique and lowercase.
   - If you add new local images, place them under `frontend/public/img/` so both the frontend and backend can serve them.
   - Run `cd backend && node scripts/seed.js` to reseed your local Mongo instance.

3. **Deploying**
   - In production, add the document directly in your MongoDB instance (Atlas, Compass, etc.) or run the seed script with the production connection string.
   - No frontend changes are required—the Events components read straight from the API.

---

### 2. Adding or Updating a Resource

1. **Backend schema reference**
   - See `backend/models/Resource.js` for required fields.
   - Required: `title`, `slug`, `description`, `type`, `category`, `difficulty`, `image`, `url`.
   - Optional booleans: `featured`, `published`.
   - `tags`, `views`, and `likes` are optional and default gracefully.

2. **Seed data (development)**
   - Update the `resources` array in `backend/scripts/seed.js`.
   - As with events, keep `slug` unique and store any supporting images under `frontend/public/img/`.
   - Rerun the seed script to refresh your environment.

3. **Production updates**
   - Insert or edit the document in MongoDB through your preferred admin tool.
   - The Resources list automatically reflects the new data after the next fetch.

---

### 3. Frontend Considerations

- **Images**: because the frontend is built with Vite, any image placed under `frontend/public/` is served at `/img/…`. Reuse existing assets when possible to keep the bundle lean.
- **Optional fields**: all detail pages guard against missing data. If a field is absent in MongoDB, that section simply won’t render.
- **Testing**: after seeding or editing, run the backend (`npm run dev` inside `backend/`) and the frontend (`npm run dev` inside `frontend/`), then verify:
  - `/events` list shows the new card.
  - `/events/:slug` displays the expected layout (full detail vs. gallery-only).
  - `/resources` lists the new material and routing to `/resources/:slug` works.

Following this workflow keeps development, staging, and production environments in sync and avoids hardcoding event/resource data inside the React app.


