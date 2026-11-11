// Community-level content and derived selectors. Everything here is either
// taken from the existing site/repo or computed from events.js / projects.js.
import { events } from "./events.js";
import { projects } from "./projects.js";
import { team } from "./team.js";
import imageMeta from "./image-meta.json";

export const SITE_URL = "https://gotham-ai.vercel.app";

export const site = {
  name: "Gotham AI",
  tagline: "Where minds meet machines",
  description:
    "Gotham AI is a student-led artificial intelligence and technology community at JSPM's Rajarshi Shahu College of Engineering (RSCOE), Tathawade, Pune. It runs technical sessions, workshops and hackathons, and its members build real projects with industry partners.",
  institution: "JSPM's Rajarshi Shahu College of Engineering",
  institutionShort: "JSPM's RSCOE",
  city: "Tathawade, Pune",
  email: "gothamjspm@gmail.com",
  // people come from src/content/team/ (one file per person)
  leadership: team,
  // the areas the community works in (as described by the community itself)
  focusAreas: [
    "Artificial Intelligence",
    "Generative AI",
    "Agentic AI",
    "Machine Learning",
    "Deep Learning",
    "Full-Stack Development",
    "Web3 & Blockchain",
    "Open Source",
    "Competitive Programming",
    "Cybersecurity",
  ],
  joinForm:
    "https://docs.google.com/forms/d/e/1FAIpQLSc3ns7PZxGni5YExgTcGIsX-f_95syZ5__7tKeA9Wt4YKLMBw/viewform",
  mapLink: "https://maps.app.goo.gl/QzkAcTycAdpqbPZ96",
  // total attendees across all events, shown as "1000+" (not every event recorded its
  // count, so this is set by hand; the recorded per-event counts are used if they add up to more)
  attendeesTotal: 1000,
  // Add the community's real profiles here, e.g. { name: "LinkedIn", href: "https://www.linkedin.com/company/…" }.
  // Empty means no social links are shown. Real URLs also feed `sameAs` SEO.
  socials: [],
};

export const navItems = [
  { label: "About", to: "/about" },
  { label: "Events", to: "/events" },
  { label: "Projects", to: "/projects" },
  { label: "FAQ", to: "/#faq" },
];

// ---- People ------------------------------------------------------------------

export const getPerson = (slug) => team.find((p) => p.slug === slug);
export const personByName = (name) => team.find((p) => p.name === name);

// ---- Events ----------------------------------------------------------------

const time = (d) => new Date(d).getTime();

export const sortedEvents = events.filter((e) => e.published !== false).sort((a, b) => time(b.date) - time(a.date));

export const getEvent = (slug) => sortedEvents.find((e) => e.slug === slug);

/** Stable, human index: the first event ever is No. 01. */
export const eventNumber = (e) => String(sortedEvents.length - sortedEvents.indexOf(e)).padStart(2, "0");

export const isUpcoming = (event, now) => time(event.endDate || event.date) > now;

const fmt = (d, o) => new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", ...o }).format(new Date(d));

/** "11 Oct 2025" or "16–17 Mar 2026" */
export function eventDateLabel(e) {
  if (!e.endDate || fmt(e.date, { dateStyle: "short" }) === fmt(e.endDate, { dateStyle: "short" }))
    return fmt(e.date, { day: "numeric", month: "short", year: "numeric" });
  return `${fmt(e.date, { day: "numeric" })}–${fmt(e.endDate, { day: "numeric", month: "short", year: "numeric" })}`;
}

export const eventParts = (e) => ({
  day: fmt(e.date, { day: "2-digit" }),
  month: fmt(e.date, { month: "short" }),
  year: fmt(e.date, { year: "numeric" }),
  weekday: fmt(e.date, { weekday: "long" }),
});

// ---- Media: every photo/video of an event with full metadata --------------------
// Gallery entries in content files can be a path ("/img/x.jpg") or an object
// ({ src, alt, caption }) to write your own description.

export const isVideo = (src) => /\.(mp4|webm|mov)$/i.test(src);
export const imageSizeOf = (src) => imageMeta[src] ?? null;

/** [{ src, alt, caption, video, width, height, position, total }] for an event. */
export function eventMedia(e) {
  const items = (e.gallery?.length ? e.gallery : [e.cover]).map((g) => (typeof g === "string" ? { src: g } : g));
  const total = items.length;
  const where = `${e.location}, ${eventDateLabel(e)}`;
  return items.map((g, i) => {
    const video = isVideo(g.src);
    const kind = video ? "video" : "photo";
    return {
      ...g,
      video,
      position: i + 1,
      total,
      alt: g.alt ?? `${e.title} — ${kind} ${i + 1} of ${total}, ${where}`,
      caption: g.caption ?? `${e.title} (${e.category}) by Gotham AI at ${where}`,
      ...(imageSizeOf(g.src) ?? {}),
    };
  });
}

/** The cover photo with metadata. */
export const eventCover = (e) => ({
  src: e.cover,
  alt: e.coverAlt ?? `${e.title} — ${e.category} by Gotham AI at ${e.location}, ${eventDateLabel(e)}`,
  ...(imageSizeOf(e.cover) ?? {}),
});

export const eventYears = [...new Set(sortedEvents.map((e) => eventParts(e).year))];
export const eventCategories = [...new Set(sortedEvents.map((e) => e.category))];

// ---- Projects --------------------------------------------------------------

export const publishedProjects = projects.filter((p) => p.published !== false);
export const getProject = (slug) => publishedProjects.find((p) => p.slug === slug);
export const projectNumber = (p) => String(publishedProjects.indexOf(p) + 1).padStart(3, "0");

// ---- Speakers (feeds the hero stats) ----------------------------------------------------------------

const stripHonorific = (n) => n.replace(/^(Dr\.|Mr\.|Ms\.|Br\.)\s*/, "").trim();

const speakerMap = new Map();
for (const e of [...sortedEvents].reverse()) {
  for (const s of e.speakers || []) {
    const key = stripHonorific(s.name);
    const prev = speakerMap.get(key);
    speakerMap.set(key, {
      name: prev?.name?.length > s.name.length ? prev.name : s.name,
      title: prev?.title || s.title || "",
      bio: prev?.bio || s.bio || "",
      image: prev?.image || s.image || "",
      events: [...(prev?.events || []), { title: e.title, slug: e.slug }],
    });
  }
}
export const speakers = [...speakerMap.values()].sort((a, b) => !!b.image - !!a.image);


export const partners = [...new Map(publishedProjects.map((p) => [p.partner.name, p.partner])).values()];

// ---- Numbers (counted, never typed) -----------------------------------------

export const stats = [
  { value: sortedEvents.length, label: "Events hosted", short: "Events" },
  {
    value: Math.max(site.attendeesTotal || 0, sortedEvents.reduce((n, e) => n + (e.attendees || 0), 0)),
    label: "Attendees",
    short: "Attendees",
  },
  { value: speakers.length, label: "Speakers & mentors", short: "Speakers" },
  { value: publishedProjects.length, label: "Industry projects", short: "Projects" },
  { value: partners.length, label: "Industry partners", short: "Partners" },
];

// ---- FAQ (answer-engine friendly; also rendered on the home page) ----------

const byCategory = (c) => sortedEvents.filter((e) => e.category === c);
const listTitles = (list) => list.map((e) => e.title).join(", ");

export const faqs = [
  {
    q: "What is Gotham AI?",
    a: `${site.name} is a student-led artificial intelligence and technology community at ${site.institution} (RSCOE), ${site.city}, India. Students learn AI and machine learning through technical sessions and workshops, take part in hackathons, and work on real projects with industry partners.`,
    to: "/about",
  },
  {
    q: "How can I join Gotham AI?",
    a: "Any student curious about AI, machine learning, agentic systems, software or security can join, beginners included. Fill in the join form and the team will reach out about upcoming sessions and projects.",
    to: "/about#join",
  },
  {
    q: "Does Gotham AI organise hackathons and workshops?",
    a: `Yes. Gotham AI has hosted ${sortedEvents.length} events so far, including hackathons (${listTitles(byCategory("Hackathon"))}), workshops (${listTitles(byCategory("Workshop"))}) and technical sessions (${listTitles(byCategory("Session"))}).`,
    to: "/events",
  },
  {
    q: "Are there upcoming AI events in Pune from Gotham AI?",
    a: "Upcoming Gotham AI events are listed on the events page as soon as they are announced. Joining the community is the quickest way to hear about them first.",
    to: "/events",
  },
  {
    q: "What technology areas does Gotham AI work in?",
    a: `${site.focusAreas.slice(0, -1).join(", ")} and ${site.focusAreas[site.focusAreas.length - 1]}.`,
    to: "/about#focus",
  },
  {
    q: "Does Gotham AI work on real projects?",
    a: `Yes. Members lead ${publishedProjects.length} industry projects with partners including ${partners.map((p) => p.name).join(", ")}, spanning AI access control, field-workforce platforms, post-quantum cryptography and cybercrime intelligence.`,
    to: "/projects",
  },
  {
    q: "Who leads Gotham AI?",
    a: `${team.map((p) => `${p.name} (${p.role})`).join(" and ")}.`,
    to: "/about#led-by",
  },
  {
    q: "How can organisations collaborate with Gotham AI?",
    a: `Companies and communities can partner on industry projects, sponsor or co-host events, or send speakers. Email ${site.email} or use the contact page.`,
    to: "/contact",
  },
  {
    q: "Where is Gotham AI based?",
    a: `At ${site.institution}, ${site.city}, Maharashtra, India. Events take place on campus and at partner venues across Pune.`,
    to: "/about",
  },
];
