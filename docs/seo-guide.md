## Search & AI visibility — how it works and what needs you

### How the site is built for search

- **Every page is real HTML.** `npm run build` prerenders all routes (home, about, team
  and each profile, contact, every event, project and resource). Crawlers and AI
  assistants read the full text without running JavaScript.
- **Per-page metadata** comes from `frontend/src/components/SEO.jsx`: unique title and
  description, canonical URL on `https://gotham-ai.vercel.app`, Open Graph and X cards,
  robots directives. Event and project pages use their own photo as the share image.
- **Structured data** (`frontend/src/lib/structuredData.js`) describes one connected
  graph with stable IDs: the Gotham AI `Organization`, each team `Person` (with role and
  affiliation), every `Event` (organised by Gotham AI), every project, and typed pages
  (`AboutPage`, `ProfilePage`, `ContactPage`, `CollectionPage`, `FAQPage`, breadcrumbs).
- **Generated on build**: `sitemap.xml` (last-modified dates come from git history of each
  content file), `llms.txt` (a curated plain-text map for AI assistants) and all pages.
- **`robots.txt`** allows search engines and AI *search* crawlers (OAI-SearchBot,
  ChatGPT-User, PerplexityBot, Claude-SearchBot, Claude-User). AI *training* crawlers
  (GPTBot, ClaudeBot, Google-Extended) are listed separately and still allowed, matching
  the original site's policy; change them to `Disallow: /` to opt out of model training
  while staying visible in AI search.
- **Every build is checked** by `scripts/validate-seo.mjs`: one H1 per page, unique titles
  and descriptions, correct canonicals, valid JSON-LD with all IDs resolving, no broken
  internal links, sitemap matching the real pages, crawlers allowed. The build fails if any
  of that breaks.

None of this guarantees rankings or AI citations — it removes the technical reasons not to.

### Things only the owner can do

1. **Google Search Console** — https://search.google.com/search-console
   - Add the property `https://gotham-ai.vercel.app/`. The site already carries a
     `google-site-verification` meta tag in `frontend/index.html`; if it isn't yours, replace
     the content value with the one Search Console gives you.
   - Sitemaps → submit `https://gotham-ai.vercel.app/sitemap.xml`.
   - URL inspection → request indexing for `/`, `/about`, `/team/prasad-bhalerao`, `/events`.
   - Check *Pages* (indexing) and *Enhancements* (structured data) weekly for the first month.
2. **Bing Webmaster Tools** — https://www.bing.com/webmasters
   - "Import from Google Search Console" is the fastest way; otherwise verify with the meta
     tag Bing gives you (add it next to the Google one in `frontend/index.html`).
   - Submit the same sitemap. Bing powers ChatGPT search and Copilot results.
3. **Validate structured data after deploying**
   - https://search.google.com/test/rich-results with an event URL and `/`.
   - https://validator.schema.org with `/team/prasad-bhalerao` and `/about`.
4. **Real social profiles** — put Gotham AI's actual LinkedIn / Instagram (and GitHub, if
   any) URLs in `site.socials` in `frontend/src/data/site.js`. They become `sameAs` links
   that help search engines connect the organisation to its accounts. Until then the
   placeholders are left out of the structured data automatically.
5. **Profile photos** — add `image: "/img/team/<name>.jpg"` to a team file to show a photo on
   the profile and in search results.
6. **Analytics (optional)** — Vercel Web Analytics needs no code: enable it in the Vercel
   project. For Google Analytics 4, create a property and add its tag.
7. **AI visibility** — there is no universal dashboard. Periodically ask ChatGPT (with search),
   Perplexity, Gemini and Claude "What is Gotham AI in Pune?" and "Who is Prasad Bhalerao?"
   and note whether they cite gotham-ai.vercel.app. Bing Webmaster Tools also reports some
   Copilot activity.

### Keeping it healthy

- Add events, projects, resources and team members as files (see `content-guide.md`);
  everything above updates on the next build.
- Keep event `summary` lines specific (what, where, when) — they become search snippets.
- After a real event, add photos and a short recap section: first-hand reports are what
  search engines and AI assistants cite.
