// Validates src/data/*.js so adding an event or project can't silently break
// the site. Runs before every build; run it alone with `npm run check:content`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const load = (f) => import(pathToFileURL(path.join(root, "src/data", f)).href);
const { events } = await load("events.js");
const { projects } = await load("projects.js");
const { resources } = await load("resources.js");

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
  const w = `events[${i}] ${e.slug ?? "(no slug)"}`;
  need(w, e, ["slug", "title", "date", "location", "category", "summary", "cover"]);
  if (e.slug && !SLUG.test(e.slug)) errors.push(`${w}: slug must be lowercase-with-hyphens`);
  [e.date, e.endDate].filter(Boolean).forEach((d) => {
    if (!ISO_IST.test(d)) errors.push(`${w}: date "${d}" must look like 2026-03-18T11:00:00+05:30`);
  });
  if (e.endDate && new Date(e.endDate) < new Date(e.date)) errors.push(`${w}: endDate is before date`);
  if (e.category && !EVENT_CATEGORIES.includes(e.category))
    errors.push(`${w}: category "${e.category}" — use one of ${EVENT_CATEGORIES.join(", ")}`);
  if (e.summary?.length > 200) warnings.push(`${w}: summary is ${e.summary.length} chars — keep under ~160 for search results`);
  checkAsset(`${w} cover`, e.cover);
  (e.gallery || []).forEach((g, j) => checkAsset(`${w} gallery[${j}]`, g));
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
  const w = `projects[${i}] ${p.slug ?? "(no slug)"}`;
  need(w, p, ["slug", "title", "status", "summary", "overview", "partner", "capabilities"]);
  if (p.slug && !SLUG.test(p.slug)) errors.push(`${w}: slug must be lowercase-with-hyphens`);
  if (p.status && !PROJECT_STATUS.includes(p.status))
    errors.push(`${w}: status "${p.status}" — use one of ${PROJECT_STATUS.join(", ")}`);
  if (p.overview && !Array.isArray(p.overview)) errors.push(`${w}: overview must be an array of paragraphs`);
  if (p.partner && !p.partner.name) errors.push(`${w}: partner needs a "name"`);
  checkAsset(`${w} cover`, p.cover);
  (p.gallery || []).forEach((g, j) => checkAsset(`${w} gallery[${j}]`, g));
});

resources.forEach((r, i) => need(`resources[${i}] ${r.slug ?? ""}`, r, ["slug", "title", "description", "type"]));

uniqueSlugs("events", events);
uniqueSlugs("projects", projects);
uniqueSlugs("resources", resources);

warnings.forEach((w) => console.warn(`  ! ${w}`));
if (errors.length) {
  console.error(`\n✗ Content check failed (${errors.length}):\n${errors.map((e) => `  - ${e}`).join("\n")}\n`);
  process.exit(1);
}
console.log(`✓ Content OK — ${events.length} events, ${projects.length} projects, ${resources.length} resources`);
