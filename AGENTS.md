# AGENTS.md — Gotham AI website

Context for anyone (human or AI agent) working on this repo. Read this first.

## What this is

The website of **Gotham AI**, a student-led AI and technology community at JSPM's Rajarshi
Shahu College of Engineering (RSCOE), Tathawade, Pune. Production: https://gotham-ai.vercel.app

- **Leadership:** Aayush Deshpande (Founder & President), Prasad Bhalerao (Vice President),
  Vipul Nanaware (Social Media and Marketing Lead).
- **Contact:** gothamjspm@gmail.com — the contact form emails this inbox.
- Gotham AI is a student community, **not** a company or an official college department.
  Never publish invented facts, numbers, testimonials or achievements.

## Architecture

| Part | What |
| --- | --- |
| `frontend/` | React 18 + Vite + Tailwind. Every route is **prerendered to static HTML** at build time. |
| `frontend/src/content/` | **All site content, one file per item** (events, projects, resources, team). |
| `frontend/src/data/` | Loaders + derived data (`site.js`: community info, FAQ, stats; `search.js`: what Ctrl K finds). |
| `frontend/src/three/gothamScene.js` | The hero's WebGL night city (lazy-loaded, client only). |
| `frontend/scripts/` | Build pipeline: image sizes → content check → build → prerender → SEO check. |
| `backend/` | Express. Used by the site **only for the contact form** (`POST /api/contact` → email). |

There is no CMS and no database for content. Adding content = adding a file.

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
npm run check:content  # validate content files
npm run lint
npm run build          # full pipeline; fails on content or SEO problems
```

## Adding content

Every content folder has a `_template.js`. **Copy it, rename it, fill it in.**
The file name becomes the URL (lowercase words joined by hyphens). Files starting with `_` are
ignored. New files are picked up automatically everywhere: pages, home page, search, sitemap,
`llms.txt`, Markdown twins and structured data. Run `npm run check:content` after editing.

### A new event (including upcoming / "coming soon" events)

1. Photos → `frontend/public/img/<event-folder>/` (landscape JPG/WebP, ≤ ~2400px wide, < 1 MB each).
2. Copy `frontend/src/content/events/_template.js` → `frontend/src/content/events/<event-slug>.js`.
3. Required: `title`, `date` (ISO with IST offset, e.g. `"2026-08-21T10:00:00+05:30"`), `location`,
   `category` (Workshop | Hackathon | Session | Meetup | Talk | Security | Networking), `summary`, `cover`.
4. Optional: `endDate`, `time`, `attendees` (only if recorded), `highlights`, `sections`, `agenda`,
   `speakers`, `gallery`, `registrationLink`.
5. Gallery entries can be a path (`"/img/x.jpg"`) or `{ src, alt, caption }` to write your own
   description. Otherwise alt text and captions are generated from the event name, venue and date.

**Upcoming events work automatically:** any event whose date is in the future is badged
**Upcoming**, featured first on the home page ("Next up"), gets an *Upcoming* filter on `/events`,
and shows a **Register** button if `registrationLink` is set. Once the date passes it becomes a past
event on its own — no edits needed. Announce an event as soon as the date is fixed; use the
Gotham AI share image (`/img/og-default.jpg`) as `cover` until real photos exist, then add the
photos and a short recap section afterwards.

### A new project

Copy `frontend/src/content/projects/_template.js`. Keep `title` short and put the long name in
`tagline`. `team` names that match a team file automatically link to that person's profile.
`cover` is optional (a typographic cover is drawn without one).

### A new resource

Copy `frontend/src/content/resources/_template.js`. `difficulty` is Beginner | Intermediate |
Advanced; `url` is where "Open resource" goes.

### A new team member

Copy `frontend/src/content/team/_template.js` → `firstname-lastname.js`. Set `order` for their
position. Only publish facts they have confirmed (role, LinkedIn/GitHub, bio). They get a profile at
`/team/firstname-lastname`, appear on `/team`, in the footer "Led by" list and in search, and are
described to search engines as members of Gotham AI.

### Community info

`frontend/src/data/site.js`: description, email, focus areas, social links (`site.socials` still
needs the real Gotham AI LinkedIn/Instagram URLs), FAQ. FAQ answers are also published as
structured data — keep them factual.

## SEO / AI crawlers (keep this working)

- Every page is static HTML with a unique title, description, canonical URL, Open Graph image and
  JSON-LD (`frontend/src/lib/structuredData.js`, one connected graph with stable `@id`s).
- Build also writes `sitemap.xml` (with image entries and git-based lastmod), `llms.txt`,
  `llms-full.txt`, and a Markdown twin of every page (`/about.md`, `/events/<slug>.md`, …).
- `robots.txt` (`frontend/public/robots.txt`) allows search engines and AI search crawlers; AI
  training crawlers are listed separately.
- The first-visit intro never runs for crawlers or bots.
- `scripts/validate-seo.mjs` runs on every build and fails it if any page loses its H1, unique
  title/description, canonical, valid JSON-LD, Markdown twin, image alt text, or sitemap/llms entry.
- Owner tasks (Search Console, Bing) are in `docs/seo-guide.md`.

## UI rules

- Brand: monochrome ink/bone with **one** accent, lime `#edff66`. No other accent colours, no
  purple/AI-gradient looks. Logo is the αi mark (`frontend/src/components/Logo.jsx`).
- Type: Instrument Sans (condensed, uppercase `display` class for headings), Instrument Serif
  italic for accent words (`accent` class), JetBrains Mono for small labels (`label` class).
- Clean and restrained: no long paragraphs on the landing page, events come first, photos are
  always full colour. Scroll animations stay subtle (`frontend/src/lib/reveals.js`, via
  `data-reveal="mask|rise|image|line"`).
- Use `rem` (not px) for sizes so the layout scales on very large screens.
- Must work by keyboard: Ctrl K / ⌘K or `/` opens search; dialogs trap focus and restore it.
- Verify UI changes in a real browser at phone (390px), laptop (1366/1440px) and large widths,
  and check the console for errors before committing.

## Git rules

- Work on a feature branch; never commit directly to `main`.
- Commit messages: clear, imperative, grouped by concern. **Do not add "Co-Authored-By" lines
  or any AI attribution.**
- Push only when the owner asks.
