// Markdown versions of every page, for AI crawlers and assistants. Generated at
// build time from the same content files as the HTML (see scripts/prerender.mjs):
//   /index.md, /about.md, /events/<slug>.md, … and /llms-full.txt (everything).
import { SITE_URL, eventDateLabel, eventMedia, faqs, partners, publishedProjects, site, sortedEvents, stats } from "../data/site.js";
import { resources } from "../data/resources.js";

const u = (p) => `${SITE_URL}${p}`;
const list = (items) => items.filter(Boolean).map((i) => `- ${i}`).join("\n");
const facts = (rows) => list(rows.filter((r) => r && r[1] !== undefined && r[1] !== "").map(([k, v]) => `**${k}:** ${v}`));
const published = resources.filter((r) => r.published !== false);
const ledBy = (name) => publishedProjects.filter((p) => (p.team || []).some((m) => m.name === name));

function eventMd(e) {
  const parts = [
    `# ${e.title}`,
    `> ${e.summary}`,
    facts([
      ["Organiser", `[${site.name}](${u("/about")})`],
      ["Date", eventDateLabel(e)],
      ["Starts", e.date],
      ["Ends", e.endDate],
      ["Time", e.time],
      ["Venue", e.location],
      ["Type", e.category],
      ["Attendees", e.attendees || undefined],
      ["Registration", e.registrationLink],
      ["Page", u(`/events/${e.slug}`)],
    ]),
  ];
  if (e.highlights?.length) parts.push(`## Highlights\n${list(e.highlights)}`);
  for (const s of e.sections || []) parts.push([`## ${s.title}`, s.text, s.items?.length && list(s.items)].filter(Boolean).join("\n\n"));
  for (const day of e.agenda || []) {
    parts.push(
      `## ${day.label}${day.venue ? ` — ${day.venue}` : ""}\n${list(day.items.map((i) => [i.time, i.title, i.by && `(${i.by})`].filter(Boolean).join(" ")))}`,
    );
  }
  if (e.speakers?.length) parts.push(`## Speakers\n${list(e.speakers.map((s) => [`**${s.name}**`, s.title, s.bio].filter(Boolean).join(" — ")))}`);
  const media = eventMedia(e);
  if (media.length) {
    parts.push(
      `## Photos and videos\n${list(media.map((m) => `[${m.alt}](${u(m.src)})${m.width ? ` (${m.width}×${m.height})` : ""}${m.video ? " — video" : ""}`))}`,
    );
  }
  return parts.join("\n\n");
}

function projectMd(p) {
  return [
    `# ${p.title}${p.tagline ? ` — ${p.tagline}` : ""}`,
    `> ${p.summary}`,
    facts([
      ["Status", p.status],
      ["Industry partner", p.partner.url ? `[${p.partner.name}](${p.partner.url})` : p.partner.name],
      ["Team", (p.team || []).map((m) => `${m.name} (${m.role})`).join(", ")],
      ["Community", `[${site.name}](${u("/about")})`],
      ["Page", u(`/projects/${p.slug}`)],
    ]),
    `## Overview\n\n${p.overview.join("\n\n")}`,
    `## Capabilities\n${list(p.capabilities)}`,
    ...(p.links?.length ? [`## Links\n${list(p.links.map((l) => `[${l.label}](${l.url})`))}`] : []),
  ].join("\n\n");
}

function personMd(p) {
  const projects = ledBy(p.name);
  return [
    `### ${p.name} — ${p.role}, ${site.name}`,
    p.bio,
    facts([
      ["Role", `${p.role}, [${site.name}](${u("/about")})`],
      ["Studies", p.academic],
      ["LinkedIn", p.linkedin],
      ["GitHub", p.github],
      ["Website", p.website],
    ]),
    p.interests?.length && `#### Interests\n${list(p.interests)}`,
    projects.length && `#### Projects led\n${list(projects.map((x) => `[${x.title}](${u(`/projects/${x.slug}`)}) — ${x.status}`))}`,
    p.contributions?.length && `#### Contributions\n${list(p.contributions)}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function aboutMd() {
  return [
    `# About ${site.name}`,
    site.description,
    `${site.name} is a student-led community (not a company or an official college department) based at ${site.institution}, ${site.city}, Maharashtra, India.`,
    facts([
      ["Events hosted", sortedEvents.length],
      ["Attendees", `${stats.find((s) => s.short === "Attendees").value}+`],
      ["Industry projects", publishedProjects.length],
      ["Industry partners", partners.map((p) => p.name).join(", ")],
      ["Contact", site.email],
      ["Join", site.joinForm],
    ]),
    `## Focus areas\n${list(site.focusAreas)}`,
    `## Led by\n\n${site.leadership.map(personMd).join("\n\n")}`,
    `## FAQ\n\n${faqs.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}`,
  ].join("\n\n");
}

const homeMd = () =>
  [
    `# ${site.name} — ${site.tagline}`,
    site.description,
    `## Sections\n${list([
      `[About](${u("/about")})`,
      `[Events](${u("/events")}) — ${sortedEvents.length} so far`,
      `[Projects](${u("/projects")}) — ${publishedProjects.length} with industry partners`,
      `[Resources](${u("/resources")})`,
      `[Contact](${u("/contact")}) — ${site.email}`,
    ])}`,
    `## Latest events\n${list(sortedEvents.slice(0, 5).map((e) => `[${e.title}](${u(`/events/${e.slug}`)}) — ${eventDateLabel(e)}, ${e.location}`))}`,
    `## FAQ\n\n${faqs.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}`,
  ].join("\n\n");

/** Every page as [path, markdown]; path "/" is written as /index.md. */
export function markdownPages() {
  return [
    ["/", homeMd()],
    ["/about", aboutMd()],
    ["/contact", `# Contact ${site.name}\n\n${facts([["Email", site.email], ["Join form", site.joinForm], ["Location", `${site.institution}, ${site.city}, Maharashtra, India`]])}\n\nFor partnerships, sponsoring or co-hosting events, speaking, or joining the community.`],
    ["/events", `# ${site.name} events\n\n${list(sortedEvents.map((e) => `[${e.title}](${u(`/events/${e.slug}`)}) — ${eventDateLabel(e)}, ${e.location} (${e.category}). ${e.summary}`))}`],
    ...sortedEvents.map((e) => [`/events/${e.slug}`, eventMd(e)]),
    ["/projects", `# ${site.name} projects\n\n${list(publishedProjects.map((p) => `[${p.title}](${u(`/projects/${p.slug}`)}) — ${p.summary} (${p.status})`))}`],
    ...publishedProjects.map((p) => [`/projects/${p.slug}`, projectMd(p)]),
    ["/resources", `# Learning resources from ${site.name}\n\n${list(published.map((r) => `[${r.title}](${u(`/resources/${r.slug}`)}) — ${r.type}, ${r.difficulty}. ${r.description}`))}`],
    ...published.map((r) => [`/resources/${r.slug}`, `# ${r.title}\n\n${r.description}\n\n${facts([["Type", r.type], ["Category", r.category], ["Level", r.difficulty], ["By", r.author], ["Link", r.url]])}`]),
  ].map(([path, md]) => [path, `${md.trim()}\n\n---\nSource: ${u(path === "/" ? "/" : path)} · ${site.name}, ${site.city}\n`]);
}

/** One file with everything, for assistants that prefer a single fetch. */
export function llmsFull() {
  const pages = markdownPages().filter(([p]) => !["/", "/events", "/projects", "/resources"].includes(p));
  return `# ${site.name} — full site content\n\n> ${site.description}\n\n${pages.map(([, md]) => md).join("\n\n")}`;
}
