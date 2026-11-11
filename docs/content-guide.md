## Content Authoring Guide

All site content lives in plain JavaScript files in `frontend/src/data/`. There is
no database or CMS: you edit a file, the build checks it, and every page that uses
it is rebuilt as static HTML (good for speed and for search engines).

| What | File |
| --- | --- |
| Events | `frontend/src/data/events.js` |
| Projects | `frontend/src/data/projects.js` |
| Resources | `frontend/src/data/resources.js` |
| Community info, domains, FAQ, social links | `frontend/src/data/site.js` |

Each data file starts with a commented **TEMPLATE** listing every field.

---

### Add an event

1. Put the photos in a new folder, e.g. `frontend/public/img/hackathon-2026/`.
   Landscape JPGs around 1600px wide work best. `.mp4` clips are fine in `gallery` too.
2. Open `frontend/src/data/events.js`, copy the TEMPLATE into the `events` array and fill it in.
   - `slug` becomes the URL (`/events/<slug>`): lowercase words joined by hyphens.
   - `date` must include the IST offset: `"2026-08-21T10:00:00+05:30"`. Add `endDate` for multi-day events.
   - `summary` is one or two sentences. It is used on cards, in Google results and in link previews.
   - `highlights` are three short punchy lines; `sections` hold the longer write-up.
   - `agenda`, `speakers`, `attendees` and `registrationLink` are optional. Leave them out rather than guessing.
3. Run `npm run check:content` inside `frontend/`. It reports missing fields, bad dates and image paths that don't exist.
4. Run `npm run dev` and open `/events/<slug>` to check it.

The event automatically appears on the home page, in `/events`, on the timeline, in
the sitemap, in `llms.txt` and in the structured data Google reads. Order doesn't
matter, because everything is sorted by date. While the date is in the future, it is
marked **Upcoming** and the Register button is shown if you set `registrationLink`.

### Add a project

1. Optional: add screenshots to `frontend/public/img/<project>/`.
2. Copy the TEMPLATE in `frontend/src/data/projects.js`.
   - Keep `title` short (e.g. "FAAMS") and put the long name in `tagline`.
   - `overview` is an array of paragraphs; `capabilities` is a list.
   - `cover` is optional. Without one, the site renders a clean typographic cover.
   - Add `links` (GitHub, demo, etc.) to show buttons on the project page.
3. Run `npm run check:content`.

### Hide something

Set `published: false`. It disappears from every page, the sitemap and search data.

### Speakers and people

The speaker count on the home page is built automatically from every event's `speakers`.
People are matched by name, so "Dr. Deepali Bhavale" and "Deepali Bhavale" count once.

### Things to fill in

- `site.socials` in `site.js` currently points at platform home pages. Replace these with
  the real Gotham AI profile URLs. They are also used for Google's knowledge panel (`sameAs`).
- `resources.js` still holds placeholder entries (example.com links) from the old site.

### Before you push

```bash
cd frontend
npm run lint
npm run build   # runs check:content, builds, prerenders every page
```
