// Community-level content and derived selectors. Everything here is either
// taken from the existing site/repo or computed from events.js / projects.js.
import { events } from "./events.js";
import { projects } from "./projects.js";

export const SITE_URL = "https://gotham-ai.vercel.app";

export const site = {
  name: "Gotham AI",
  tagline: "Where minds meet machines",
  description:
    "Gotham AI is the student-run AI community at JSPM's Rajarshi Shahu College of Engineering (RSCOE), Pune. We host sessions, workshops and hackathons, and build real projects with industry partners.",
  institution: "JSPM's Rajarshi Shahu College of Engineering",
  institutionShort: "JSPM's RSCOE",
  city: "Tathawade, Pune",
  lead: "Prasad Bhalerao",
  email: "", // TODO: add a public contact email if you want one shown
  joinForm:
    "https://docs.google.com/forms/d/e/1FAIpQLSc3ns7PZxGni5YExgTcGIsX-f_95syZ5__7tKeA9Wt4YKLMBw/viewform",
  mapLink: "https://maps.app.goo.gl/QzkAcTycAdpqbPZ96",
  // TODO: replace with the community's actual profile URLs (the old footer
  // only pointed at the platform home pages). Real URLs also feed `sameAs` SEO.
  socials: [
    { name: "Discord", href: "https://discord.com" },
    { name: "LinkedIn", href: "https://linkedin.com" },
    { name: "Instagram", href: "https://instagram.com" },
  ],
};

export const navItems = [
  { label: "Events", to: "/events" },
  { label: "Projects", to: "/projects" },
  { label: "FAQ", to: "/#faq" },
];

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
    value: sortedEvents.reduce((n, e) => n + (e.attendees || 0), 0),
    label: "Recorded attendees",
    short: "Attendees",
    note: "Counted only where attendance was recorded",
    plus: true,
  },
  { value: speakers.length, label: "Speakers & mentors", short: "Speakers" },
  { value: publishedProjects.length, label: "Industry projects", short: "Projects" },
  { value: partners.length, label: "Industry partners", short: "Partners" },
];

// ---- FAQ (answer-engine friendly; also rendered on the home page) ----------

export const faqs = [
  {
    q: "What is Gotham AI?",
    a: `${site.name} is a student-run artificial intelligence community at ${site.institution} (RSCOE), ${site.city}. Members learn AI and machine learning through sessions and workshops, compete in hackathons, and work on real projects with industry partners.`,
  },
  {
    q: "Who can join Gotham AI?",
    a: "Any student curious about AI, machine learning, agentic systems, software or security can join — beginners included. Fill in the join form and we will reach out about upcoming sessions and projects.",
  },
  {
    q: "What kind of events does Gotham AI run?",
    a: `So far we have hosted ${sortedEvents.length} events: technical sessions, workshops, Smart India Hackathon guidance, a cybersecurity meetup, a founder dialogue and a two-day national-level AI symposium and hackathon.`,
  },
  {
    q: "Does Gotham AI work on real projects?",
    a: `Yes. Members currently lead ${publishedProjects.length} industry projects with partners including ${partners.map((p) => p.name).join(", ")} — spanning AI access control, field-workforce platforms, post-quantum cryptography and cybercrime intelligence.`,
  },
  {
    q: "Where is Gotham AI based?",
    a: `At ${site.institution}, ${site.city}, Maharashtra, India. Events take place on campus and at partner venues across Pune.`,
  },
];
