// Renders every route to static HTML after the client + SSR builds, so search
// engines (and users on slow phones) get real content before any JS runs.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const serverDir = path.join(root, "dist-server");

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const { render, routes } = await import(pathToFileURL(path.join(serverDir, "entry-server.js")).href);
const { SITE_URL } = await import(pathToFileURL(path.join(root, "src/data/site.js")).href);

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

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) =>
      `  <url><loc>${SITE_URL}${r === "/" ? "/" : r}</loc><lastmod>${today}</lastmod><priority>${
        r === "/" ? "1.0" : r.split("/").length > 2 ? "0.6" : "0.8"
      }</priority></url>`,
  )
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);

// llms.txt — a plain-text map of the site for AI assistants (llmstxt.org)
const { site, sortedEvents, publishedProjects, faqs, eventDateLabel } = await import(
  pathToFileURL(path.join(root, "src/data/site.js")).href
);
const llms = `# ${site.name}

> ${site.description}

${site.name} is based at ${site.institution}, ${site.city}, India. Tagline: "${site.tagline}".

## Events
${sortedEvents.map((e) => `- [${e.title}](${SITE_URL}/events/${e.slug}): ${eventDateLabel(e)}, ${e.location}. ${e.summary}`).join("\n")}

## Projects
${publishedProjects
  .map((p) => `- [${p.title}${p.tagline ? ` — ${p.tagline}` : ""}](${SITE_URL}/projects/${p.slug}): ${p.summary} Status: ${p.status}.`)
  .join("\n")}

## FAQ
${faqs.map((f) => `- **${f.q}** ${f.a}`).join("\n")}

## Links
- [Join Gotham AI](${site.joinForm})
- [All events](${SITE_URL}/events)
- [All projects](${SITE_URL}/projects)
`;
fs.writeFileSync(path.join(dist, "llms.txt"), llms);
fs.rmSync(serverDir, { recursive: true, force: true });

console.log(`Prerendered ${routes.length} routes + 404.html, wrote sitemap.xml and llms.txt`);
