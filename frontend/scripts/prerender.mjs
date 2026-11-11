// Renders every route to static HTML after the client + SSR builds, so search
// engines (and users on slow phones) get real content before any JS runs.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const serverDir = path.join(root, "dist-server");

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const server = await import(pathToFileURL(path.join(serverDir, "entry-server.js")).href);
const { render, routes, SITE_URL, site, sortedEvents, publishedProjects, resources, faqs, eventDateLabel, markdownPages, llmsFull } = server;

const write = (route, file) => {
  const { html, head } = render(route);
  const page = template
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace("</head>", `${head}</head>`)
    .replace('<div id="root"></div>', `<div id="root" data-route="${route}">${html}</div>`);
  // "/events" → events.html (served at /events by Vercel cleanUrls and vite preview)
  const out = path.join(dist, file ?? (route === "/" ? "index.html" : `${route.slice(1)}.html`));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page);
};

for (const route of routes) write(route);
write("/__not-found__", "404.html");

// ---- sitemap.xml: lastmod = when that page's content file last changed ---------
const contentFile = (route) => {
  const m = route.match(/^\/(events|projects|resources|team)\/([^/]+)$/);
  return m ? path.join(root, "src/content", m[1], `${m[2]}.js`) : null;
};
const lastChanged = (file) => {
  try {
    const iso = execSync(`git log -1 --format=%cI -- "${file}"`, { cwd: root, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    if (iso) return iso.slice(0, 10);
  } catch {
    // no git history available (e.g. shallow CI clone) — fall back to mtime
  }
  return fs.statSync(file).mtime.toISOString().slice(0, 10);
};
const newest = (dates) => dates.sort().at(-1);
const allContent = routes.map(contentFile).filter((f) => f && fs.existsSync(f));
const sectionDate = (kind) => newest(allContent.filter((f) => f.includes(`${path.sep}${kind}${path.sep}`)).map(lastChanged)) ?? lastChanged(path.join(root, "src"));
const siteDate = newest(allContent.map(lastChanged));
const lastmodFor = (route) => {
  const f = contentFile(route);
  if (f && fs.existsSync(f)) return lastChanged(f);
  const section = route.slice(1);
  if (["events", "projects", "resources", "team"].includes(section)) return sectionDate(section);
  return siteDate;
};
const priority = (r) => (r === "/" ? "1.0" : ["/events", "/about", "/projects", "/team"].includes(r) ? "0.9" : r.startsWith("/events/") || r.startsWith("/team/") ? "0.7" : "0.6");
// image sitemap entries: every photo of an event is listed under its page
const xml = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const imagesFor = (route) => {
  const m = route.match(/^\/events\/([^/]+)$/);
  const e = m && sortedEvents.find((x) => x.slug === m[1]);
  if (!e) return [];
  const srcs = [e.cover, ...(e.gallery || []).map((g) => (typeof g === "string" ? g : g.src))];
  return [...new Set(srcs.filter((src) => !/\.(mp4|webm|mov)$/i.test(src)))];
};
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${routes
  .map((r) => {
    const imgs = imagesFor(r)
      .map((src) => `\n    <image:image><image:loc>${xml(SITE_URL + src)}</image:loc></image:image>`)
      .join("");
    return `  <url><loc>${SITE_URL}${r === "/" ? "/" : r}</loc><lastmod>${lastmodFor(r)}</lastmod><priority>${priority(r)}</priority>${imgs}</url>`;
  })
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);

// ---- llms.txt: a curated, plain-text map of the site (llmstxt.org) -------------
const u = (p) => `${SITE_URL}${p}`;
const llms = `# ${site.name}

> ${site.description}

${site.name} is a student-led community (not a company or an official college department) based at ${site.institution}, ${site.city}, Maharashtra, India. Contact: ${site.email}.

## About
- [About Gotham AI](${u("/about")}): what the community is, what it does, focus areas, location, and how to join or collaborate.
- [Team](${u("/team")}): ${site.leadership.map((p) => `[${p.name}](${u(`/team/${p.slug}`)}), ${p.role}`).join("; ")}.
- [Contact](${u("/contact")}): ${site.email} — partnerships, sponsoring, speaking and joining.

## Focus areas
${site.focusAreas.join(", ")}.

## Events
- [All events](${u("/events")})
${sortedEvents.map((e) => `- [${e.title}](${u(`/events/${e.slug}`)}): ${eventDateLabel(e)} at ${e.location} (${e.category}). ${e.summary}`).join("\n")}

## Projects
- [All projects](${u("/projects")})
${publishedProjects
  .map((p) => `- [${p.title}${p.tagline ? ` — ${p.tagline}` : ""}](${u(`/projects/${p.slug}`)}): ${p.summary} Partner: ${p.partner.name}. Status: ${p.status}. Led by ${(p.team || []).map((m) => m.name).join(", ")}.`)
  .join("\n")}

## FAQ
${faqs.map((f) => `- **${f.q}** ${f.a}`).join("\n")}

## For AI assistants
- Every page is also available as Markdown: add \`.md\` to its URL (the home page is ${u("/index.md")}), e.g. ${u("/about.md")}.
- [Full site content in one file](${u("/llms-full.txt")})

## Optional
- [Learning resources](${u("/resources")}): ${resources.filter((r) => r.published !== false).length} AI and ML courses, tutorials, books and datasets.
- [Join form](${site.joinForm})
- [Sitemap](${u("/sitemap.xml")})
`;
fs.writeFileSync(path.join(dist, "llms.txt"), llms);

// ---- Markdown twin of every page + one full-content file for AI assistants -------
for (const [route, md] of markdownPages()) {
  const out = path.join(dist, route === "/" ? "index.md" : `${route.slice(1)}.md`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, md);
}
fs.writeFileSync(path.join(dist, "llms-full.txt"), llmsFull());
fs.rmSync(serverDir, { recursive: true, force: true });

console.log(`Prerendered ${routes.length} routes + 404.html, wrote sitemap.xml, llms.txt, llms-full.txt and ${markdownPages().length} Markdown pages`);
