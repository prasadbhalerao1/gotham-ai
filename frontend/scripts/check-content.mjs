// Validates src/content/** so adding an event, project or resource can't silently break
// the site. Runs before every build; run it alone with `npm run check:content`.
import fs from "node:fs";
import path from "node:path";

import { ROOT as root, loadContent } from "./lib/content.mjs";

const events = await loadContent("events");
const projects = await loadContent("projects");
const resources = await loadContent("resources");

const errors = [];
const warnings = [];
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ISO_IST = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?\+05:30$/;
const EVENT_CATEGORIES = ["Workshop", "Hackathon", "Session", "Meetup", "Talk", "Security", "Networking"];
const PROJECT_STATUS = ["In Progress", "Documentation Phase", "Completed", "On Hold"];

const fileExists = (p) => fs.existsSync(path.join(root, "public", p));
const checkAsset = (where, p) => {
  if (!p) return;
  if (!p.startsWith("/")) errors.push(`${where}: "${p}" must start with "/" (it lives in public/)`);
  else if (!fileExists(p)) errors.push(`${where}: file not found → public${p}`);
};
const need = (where, obj, keys) =>
  keys.forEach((k) => {
    const v = obj[k];
    if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0))
      errors.push(`${where}: missing "${k}"`);
  });
const uniqueSlugs = (kind, list) => {
  const seen = new Set();
  list.forEach((x) => {
    if (seen.has(x.slug)) errors.push(`${kind}: duplicate slug "${x.slug}"`);
    seen.add(x.slug);
  });
};

events.forEach((e, i) => {
  const w = `content/events/${e.slug}.js`;
  need(w, e, ["title", "date", "location", "category", "summary", "cover"]);
  if (!SLUG.test(e.slug)) errors.push(`${w}: rename the file — lowercase words joined by hyphens (e.g. my-event-2026.js)`);
  [e.date, e.endDate].filter(Boolean).forEach((d) => {
    if (!ISO_IST.test(d)) errors.push(`${w}: date "${d}" must look like 2026-03-18T11:00:00+05:30`);
  });
  if (e.endDate && new Date(e.endDate) < new Date(e.date)) errors.push(`${w}: endDate is before date`);
  if (e.category && !EVENT_CATEGORIES.includes(e.category))
    errors.push(`${w}: category "${e.category}" — use one of ${EVENT_CATEGORIES.join(", ")}`);
  if (e.summary?.length > 200) warnings.push(`${w}: summary is ${e.summary.length} chars — keep under ~160 for search results`);
  checkAsset(`${w} cover`, e.cover);
  (e.gallery || []).forEach((g, j) => {
    if (typeof g === "object" && !g.src) errors.push(`${w} gallery[${j}]: an object entry needs "src"`);
    checkAsset(`${w} gallery[${j}]`, typeof g === "string" ? g : g.src);
  });
  (e.speakers || []).forEach((s, j) => {
    need(`${w} speakers[${j}]`, s, ["name"]);
    checkAsset(`${w} speakers[${j}]`, s.image);
  });
  (e.sections || []).forEach((s, j) => {
    need(`${w} sections[${j}]`, s, ["title"]);
    if (!s.text && !s.items?.length) errors.push(`${w} sections[${j}]: needs "text" or "items"`);
  });
});

projects.forEach((p, i) => {
  const w = `content/projects/${p.slug}.js`;
  need(w, p, ["title", "status", "summary", "overview", "partner", "capabilities"]);
  if (!SLUG.test(p.slug)) errors.push(`${w}: rename the file — lowercase words joined by hyphens`);
  if (p.status && !PROJECT_STATUS.includes(p.status))
    errors.push(`${w}: status "${p.status}" — use one of ${PROJECT_STATUS.join(", ")}`);
  if (p.overview && !Array.isArray(p.overview)) errors.push(`${w}: overview must be an array of paragraphs`);
  if (p.partner && !p.partner.name) errors.push(`${w}: partner needs a "name"`);
  checkAsset(`${w} cover`, p.cover);
  (p.gallery || []).forEach((g, j) => checkAsset(`${w} gallery[${j}]`, g));
});

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
resources.forEach((r, i) => {
  const w = `content/resources/${r.slug}.js`;
  need(w, r, ["title", "description", "type", "category", "difficulty"]);
  if (!SLUG.test(r.slug)) errors.push(`${w}: rename the file — lowercase words joined by hyphens`);
  if (r.difficulty && !LEVELS.includes(r.difficulty)) errors.push(`${w}: difficulty "${r.difficulty}" — use one of ${LEVELS.join(", ")}`);
  if (r.url && !/^https?:\/\//.test(r.url)) errors.push(`${w}: url must start with http(s)://`);
});

uniqueSlugs("events", events);
uniqueSlugs("projects", projects);
uniqueSlugs("resources", resources);

warnings.forEach((w) => console.warn(`  ! ${w}`));
if (errors.length) {
  console.error(`\n✗ Content check failed (${errors.length}):\n${errors.map((e) => `  - ${e}`).join("\n")}\n`);
  process.exit(1);
}
console.log(`✓ Content OK — ${events.length} events, ${projects.length} projects, ${resources.length} resources`);
