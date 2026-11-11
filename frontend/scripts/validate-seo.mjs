// Checks the built, prerendered HTML the way a crawler sees it. Runs at the
// end of `npm run build` (or alone: `npm run check:seo` after a build) and
// fails the build if anything search engines or AI crawlers rely on is broken.
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/content.mjs";

const dist = path.join(ROOT, "dist");
const SITE = "https://gotham-ai.vercel.app";
const errors = [];
const warnings = [];

// ---- pages ----------------------------------------------------------------------
const pages = [];
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory() && !["assets", "img", "fonts", "audio", "videos"].includes(d.name)) walk(p);
    else if (d.name.endsWith(".html") && !d.name.startsWith("google")) pages.push(p);
  });
walk(dist);

const routeOf = (file) => {
  const rel = path.relative(dist, file).replace(/\\/g, "/").replace(/\.html$/, "");
  return rel === "index" ? "/" : `/${rel}`;
};
const attr = (html, re) => html.match(re)?.[1];
const decode = (s = "") => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const titles = new Map();
const descriptions = new Map();
const defined = new Set();
const referenced = [];
const routes = new Set(pages.map(routeOf));

const collectIds = (node, page) => {
  if (Array.isArray(node)) return node.forEach((n) => collectIds(n, page));
  if (!node || typeof node !== "object") return;
  const keys = Object.keys(node);
  if (node["@id"] && keys.length === 1) referenced.push([node["@id"], page]);
  else if (node["@id"]) defined.add(node["@id"]);
  keys.forEach((k) => collectIds(node[k], page));
};

for (const file of pages) {
  const route = routeOf(file);
  const html = fs.readFileSync(file, "utf8");
  const is404 = route === "/404";
  const where = `${route}`;

  if (/localhost|127\.0\.0\.1/.test(html)) errors.push(`${where}: mentions localhost`);
  if (is404) {
    if (!/noindex/.test(html)) errors.push(`${where}: 404 page should be noindex`);
    continue;
  }

  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) errors.push(`${where}: has ${h1s} <h1> elements (want exactly 1)`);

  const title = decode(attr(html, /<title[^>]*>([^<]*)<\/title>/));
  if (!title) errors.push(`${where}: missing <title>`);
  else {
    if (titles.has(title)) errors.push(`${where}: duplicate title with ${titles.get(title)} — "${title}"`);
    titles.set(title, where);
    if (title.length > 70) warnings.push(`${where}: title is ${title.length} chars (may be truncated in results)`);
  }

  const desc = decode(attr(html, /<meta[^>]*name="description"[^>]*content="([^"]*)"/));
  if (!desc) errors.push(`${where}: missing meta description`);
  else {
    if (descriptions.has(desc)) errors.push(`${where}: duplicate description with ${descriptions.get(desc)}`);
    descriptions.set(desc, where);
    if (desc.length < 50 || desc.length > 300) warnings.push(`${where}: description is ${desc.length} chars`);
  }

  const canonical = attr(html, /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/);
  const expected = route === "/" ? SITE : `${SITE}${route}`;
  if (canonical !== expected) errors.push(`${where}: canonical is "${canonical}", expected "${expected}"`);

  if (/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html)) errors.push(`${where}: is noindex but listed as a public page`);
  for (const tag of ['property="og:title"', 'property="og:description"', 'property="og:image"', 'property="og:url"', 'name="twitter:card"']) {
    if (!html.includes(tag)) errors.push(`${where}: missing ${tag}`);
  }

  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (!blocks.length) warnings.push(`${where}: no structured data`);
  for (const b of blocks) {
    try {
      const data = JSON.parse(b);
      collectIds(data, where);
      if (data["@type"] === "Event" && !/[+-]\d{2}:\d{2}$/.test(data.startDate)) errors.push(`${where}: Event startDate lacks a timezone`);
    } catch (e) {
      errors.push(`${where}: invalid JSON-LD — ${e.message}`);
    }
  }

  // every image needs alt text (alt="" is only fine for decorative copies)
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="/.test(tag)) errors.push(`${where}: <img> without alt → ${tag.slice(0, 80)}`);
  }
  if (!html.includes('rel="alternate" type="text/markdown"')) errors.push(`${where}: missing Markdown alternate link`);
  const mdFile = path.join(dist, route === "/" ? "index.md" : `${route.slice(1)}.md`);
  if (!fs.existsSync(mdFile)) errors.push(`${where}: missing Markdown twin ${path.relative(dist, mdFile)}`);

  // internal links must point at a real page or file
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const clean = href.replace(/\/$/, "") || "/";
    if (routes.has(clean) || fs.existsSync(path.join(dist, decodeURIComponent(clean)))) continue;
    errors.push(`${where}: broken internal link → ${href}`);
  }
}

for (const [id, page] of referenced) if (!defined.has(id)) errors.push(`${page}: references @id ${id}, which no page defines`);

// ---- sitemap / robots / llms ----------------------------------------------------
const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (new Set(locs).size !== locs.length) errors.push("sitemap.xml: duplicate URLs");
for (const loc of locs) {
  if (!loc.startsWith(SITE)) errors.push(`sitemap.xml: ${loc} is not on ${SITE}`);
  const r = loc.slice(SITE.length) || "/";
  if (!routes.has(r)) errors.push(`sitemap.xml: ${loc} has no prerendered page`);
}
for (const r of routes) if (r !== "/404" && !locs.includes(r === "/" ? `${SITE}/` : `${SITE}${r}`)) errors.push(`sitemap.xml: missing ${r}`);

const robots = fs.readFileSync(path.join(dist, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) errors.push("robots.txt: missing Sitemap line");
for (const bot of ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Claude-SearchBot", "Claude-User"]) {
  const block = robots.split(/\n\s*\n/).find((b) => b.includes(`User-agent: ${bot}`));
  if (!block || /Disallow:\s*\/\s*$/m.test(block)) errors.push(`robots.txt: ${bot} is not explicitly allowed`);
}
// llms.txt / llms-full.txt must cover every content page
const read = (f) => (fs.existsSync(path.join(dist, f)) ? fs.readFileSync(path.join(dist, f), "utf8") : "");
const llms = read("llms.txt");
const llmsFull = read("llms-full.txt");
if (!llms) errors.push("llms.txt: missing");
if (!llmsFull) errors.push("llms-full.txt: missing");
for (const r of routes) {
  if (!/^\/(events|projects)\/[^/]+$/.test(r)) continue;
  if (!llms.includes(`${SITE}${r}`)) errors.push(`llms.txt: does not list ${r}`);
  if (!llmsFull.includes(`${SITE}${r}`)) errors.push(`llms-full.txt: does not include ${r}`);
}
const sitemapImages = (sitemap.match(/<image:loc>/g) || []).length;

warnings.forEach((w) => console.warn(`  ! ${w}`));
if (errors.length) {
  console.error(`\n✗ SEO check failed (${errors.length}):\n${errors.map((e) => `  - ${e}`).join("\n")}\n`);
  process.exit(1);
}
console.log(
  `✓ SEO OK — ${routes.size - 1} pages (each with a Markdown twin), ${locs.length} sitemap URLs + ${sitemapImages} images, ${defined.size} linked entities, every <img> has alt text, llms.txt & llms-full.txt cover every page`,
);
