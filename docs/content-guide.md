## Content Authoring Guide

All site content lives in `frontend/src/content/`, **one file per item**. There is no
database or CMS: you add a file, the build checks it, and every page that uses it is
rebuilt as static HTML (good for speed, search engines and AI search).

| What | Folder | URL |
| --- | --- | --- |
| Events | `frontend/src/content/events/` | `/events/<file-name>` |
| Projects | `frontend/src/content/projects/` | `/projects/<file-name>` |
| Resources | `frontend/src/content/resources/` | `/resources/<file-name>` |
| Team ("Led by") | `frontend/src/content/team/` | — (no page) |
| Community info, email, focus areas, FAQ, social links | `frontend/src/data/site.js` | — |
| What search can find | `frontend/src/data/search.js` | — |

Each folder has a `_template.js`. **Copy it, rename it to the URL you want**
(lowercase words joined by hyphens, e.g. `ai-hackathon-2026.js`) and fill it in.
Files starting with `_` are ignored. You never edit a list — new files are picked up automatically.

### Add an event

1. Put the photos in a new folder, e.g. `frontend/public/img/hackathon-2026/`.
   Landscape JPGs around 1600px wide work best. `.mp4` clips are fine in `gallery` too.
2. Copy `frontend/src/content/events/_template.js` to `frontend/src/content/events/<your-event>.js` and fill it in.
   - The file name becomes the URL (`/events/<your-event>`).
   - `date` must include the IST offset: `"2026-08-21T10:00:00+05:30"`. Add `endDate` for multi-day events.
   - `summary` is one or two sentences. It is used on cards, in Google results and in link previews.
   - `highlights` are three short punchy lines; `sections` hold the longer write-up.
   - `agenda`, `speakers`, `attendees` and `registrationLink` are optional. Leave them out rather than guessing.
3. Run `npm run check:content` inside `frontend/`. It reports missing fields, bad dates and image paths that don't exist.
4. Run `npm run dev` and open `/events/<slug>` to check it.

The event automatically appears on the home page, in `/events`, in search, in
the sitemap, in `llms.txt` and in the structured data Google reads. Order doesn't
matter, because everything is sorted by date. While the date is in the future, it is
marked **Upcoming** and the Register button is shown if you set `registrationLink`.

### Add a project

1. Optional: add screenshots to `frontend/public/img/<project>/`.
2. Copy `frontend/src/content/projects/_template.js` to a new file in that folder.
   - Keep `title` short (e.g. "FAAMS") and put the long name in `tagline`.
   - `overview` is an array of paragraphs; `capabilities` is a list.
   - `cover` is optional. Without one, the site renders a clean typographic cover.
   - Add `links` (GitHub, demo, etc.) to show buttons on the project page.
3. Run `npm run check:content`.

### Add a resource

Copy `frontend/src/content/resources/_template.js` to a new file in that folder. `difficulty` must be
Beginner, Intermediate or Advanced; `url` is where the "Open resource" button goes.

### Search (⌘K / Ctrl K)

Search finds events, projects, resources, speakers, partners, the leadership,
FAQ answers, pages and actions. It is fuzzy (typos are fine) and reads straight
from the data files, so anything you add above is searchable without extra work.

To make a **new kind** of content searchable, add one source to
`frontend/src/data/search.js`; the comment at the top of that file shows the shape.

### Hide something

Set `published: false`. It disappears from every page, the sitemap and search data.

### Add a team member

Copy `frontend/src/content/team/_template.js` to `firstname-lastname.js`. Only publish
facts the person has confirmed. People appear only in the "Led by" lists (footer and
About page), linking to their LinkedIn, and are described to search engines as members
of Gotham AI.

### Speakers

The speaker count on the home page is built automatically from every event's `speakers`.
People are matched by name, so "Dr. Deepali Bhavale" and "Deepali Bhavale" count once.

### Things to fill in

- `site.socials` in `site.js` is empty, so no social links are shown. Add the real Gotham AI
  LinkedIn / Instagram URLs there; they appear in the footer and contact section and are used
  for Google's knowledge panel (`sameAs`).

### Before you push

```bash
cd frontend
npm run lint
npm run build   # runs check:content, builds, prerenders every page
```
