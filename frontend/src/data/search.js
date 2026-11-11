/**
 * SEARCH — everything the ⌘K / Ctrl K search can find.
 *
 * New events, projects, resources, speakers and FAQs show up automatically:
 * each source below reads straight from the data files.
 *
 * To make a NEW KIND of content searchable, add one source:
 *   {
 *     group: "Workshop",            // label shown on the right of each result
 *     items: workshops,             // the array from your data file
 *     toEntry: (w) => ({
 *       title: w.title,             // main text, highlighted when it matches
 *       meta: "One line of detail", // small mono line under the title
 *       keywords: "extra words people might type",
 *       thumb: w.cover,             // optional image path
 *       mono: "WS",                 // optional 1–2 characters when there's no image
 *       to: `/workshops/${w.slug}`, // where Enter goes  (or action: "contact" | "join")
 *     }),
 *   }
 */
import { eventDateLabel, faqs, navItems, partners, publishedProjects, site, sortedEvents, speakers } from "./site.js";
import { resources } from "./resources.js";

export const searchSources = [
  {
    group: "Event",
    items: sortedEvents,
    toEntry: (e) => ({
      title: e.title,
      meta: `${eventDateLabel(e)} · ${e.location}`,
      keywords: [e.category, e.summary, ...(e.speakers || []).map((s) => s.name), ...(e.highlights || [])].join(" "),
      thumb: e.cover,
      to: `/events/${e.slug}`,
    }),
  },
  {
    group: "Project",
    items: publishedProjects,
    toEntry: (p) => ({
      title: p.title,
      meta: [p.tagline, p.status].filter(Boolean).join(" · "),
      keywords: [p.summary, p.partner?.name, ...(p.capabilities || []), ...(p.team || []).map((m) => m.name)].join(" "),
      thumb: p.cover,
      mono: p.title.slice(0, 2),
      to: `/projects/${p.slug}`,
    }),
  },
  {
    group: "Resource",
    items: resources.filter((r) => r.published !== false),
    toEntry: (r) => ({
      title: r.title,
      meta: `${r.type} · ${r.difficulty}`,
      keywords: [r.category, r.description, r.author].join(" "),
      mono: r.type.slice(0, 2),
      to: `/resources/${r.slug}`,
    }),
  },
  {
    group: "Speaker",
    items: speakers,
    toEntry: (s) => ({
      title: s.name,
      meta: s.title || s.events.map((e) => e.title).join(", "),
      keywords: [s.bio, ...s.events.map((e) => e.title)].join(" "),
      thumb: s.image || undefined,
      mono: s.name.replace(/^(Dr\.|Mr\.|Ms\.)\s*/, "").slice(0, 2),
      to: `/events/${s.events[0].slug}#speakers`,
    }),
  },
  {
    group: "Partner",
    items: partners,
    toEntry: (p) => {
      const project = publishedProjects.find((x) => x.partner.name === p.name);
      return { title: p.name, meta: `Industry partner · ${project.title}`, keywords: "industry partner company", mono: p.name.slice(0, 2), to: `/projects/${project.slug}` };
    },
  },
  {
    group: "Team",
    items: site.leadership,
    toEntry: (p) => ({
      title: p.name,
      meta: `${p.role}, ${site.name}`,
      keywords: ["team lead", p.bio, ...(p.interests || [])].join(" "),
      thumb: p.image,
      mono: p.name.slice(0, 2),
      to: `/team/${p.slug}`,
    }),
  },
  {
    group: "FAQ",
    items: faqs,
    toEntry: (f) => ({ title: f.q, meta: f.a, keywords: "", mono: "?", to: f.to || "/#faq" }),
  },
  {
    group: "Page",
    items: [...navItems, { label: "Resources", to: "/resources" }, { label: "Contact", to: "/contact" }, { label: "Home", to: "/" }],
    toEntry: (n) => ({ title: n.label, meta: "Page", keywords: "", mono: "→", to: n.to }),
  },
  {
    group: "Action",
    items: [
      { title: "Contact us", meta: site.email, keywords: "email partner sponsor reach message", mono: "@", action: "contact" },
      { title: "Join Gotham AI", meta: "Opens the join form", keywords: "member signup register", mono: "+", action: "join" },
      { title: `Email ${site.email}`, meta: "Opens your mail app", keywords: "mail write", mono: "@", href: `mailto:${site.email}` },
    ],
    toEntry: (a) => a,
  },
];

/** Flat list the search component indexes. */
export const searchIndex = searchSources.flatMap(({ group, items, toEntry }) => items.map((item) => ({ group, ...toEntry(item) })));

/** What to suggest before anything is typed (most relevant section first). */
export const suggestionOrder = ["Event", "Project", "Page", "Action"];
