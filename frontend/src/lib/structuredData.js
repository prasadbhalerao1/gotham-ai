// schema.org JSON-LD builders — one connected graph with stable @ids, so every
// page describes the same Gotham AI, the same people and the same events.
// Rendered with <StructuredData data={…} />. Only visible, verified facts go here.
import { SITE_URL, eventCover, eventMedia, faqs, personByName, site } from "../data/site.js";

const abs = (p) => (p?.startsWith("http") ? p : `${SITE_URL}${p}`);
const realSocials = () => site.socials.map((s) => s.href).filter((h) => new URL(h).pathname.length > 1);
const ctx = "https://schema.org";

// ---- stable identifiers --------------------------------------------------------
export const ids = {
  org: `${SITE_URL}/#organization`,
  website: `${SITE_URL}/#website`,
  campus: `${SITE_URL}/#campus`,
  person: (slug) => `${SITE_URL}/team/${slug}#person`,
  event: (slug) => `${SITE_URL}/events/${slug}#event`,
  project: (slug) => `${SITE_URL}/projects/${slug}#project`,
  page: (path) => `${abs(path)}#webpage`,
};
const ref = (id) => ({ "@id": id });

const campus = {
  "@type": "CollegeOrUniversity",
  "@id": ids.campus,
  name: site.institution,
  alternateName: "RSCOE",
  address: { "@type": "PostalAddress", addressLocality: "Tathawade, Pune", addressRegion: "Maharashtra", addressCountry: "IN" },
};

// ---- entities --------------------------------------------------------------------
export const organizationLd = () => ({
  "@context": ctx,
  "@type": "Organization",
  "@id": ids.org,
  name: site.name,
  alternateName: ["Gotham AI RSCOE", "Gotham AI Pune"],
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: abs("/icon-512.png"), width: 512, height: 512 },
  image: abs("/img/og-default.jpg"),
  description: site.description,
  slogan: site.tagline,
  email: site.email,
  // a student community based at the college — not an official department
  location: campus,
  areaServed: { "@type": "City", name: "Pune" },
  knowsAbout: site.focusAreas,
  founder: site.leadership.filter((p) => /founder/i.test(p.role)).map((p) => ref(ids.person(p.slug))),
  member: site.leadership.map((p) => ({ "@type": "OrganizationRole", roleName: p.role, member: ref(ids.person(p.slug)) })),
  contactPoint: { "@type": "ContactPoint", contactType: "general enquiries", email: site.email, availableLanguage: ["English"] },
  ...(realSocials().length ? { sameAs: realSocials() } : {}),
});

export const personLd = (p) => ({
  "@context": ctx,
  "@type": "Person",
  "@id": ids.person(p.slug),
  name: p.name,
  url: abs(`/team/${p.slug}`),
  ...(p.image ? { image: abs(p.image) } : {}),
  description: p.bio,
  jobTitle: `${p.role}, ${site.name}`,
  memberOf: { "@type": "OrganizationRole", roleName: p.role, memberOf: ref(ids.org) },
  affiliation: [ref(ids.org), ...(p.academic ? [ref(ids.campus)] : [])],
  ...(p.interests?.length ? { knowsAbout: p.interests } : {}),
  sameAs: [p.linkedin, p.github, p.website].filter(Boolean),
});

export const websiteLd = () => ({
  "@context": ctx,
  "@type": "WebSite",
  "@id": ids.website,
  name: site.name,
  url: SITE_URL,
  publisher: ref(ids.org),
  inLanguage: "en-IN",
});

/** A typed web page (AboutPage, ContactPage, CollectionPage, ProfilePage…) tied to the site and org. */
export const pageLd = (type, path, { name, description, about, mainEntity } = {}) => ({
  "@context": ctx,
  "@type": type,
  "@id": ids.page(path),
  url: abs(path),
  name,
  ...(description ? { description } : {}),
  isPartOf: ref(ids.website),
  about: ref(about ?? ids.org),
  ...(mainEntity ? { mainEntity } : {}),
  inLanguage: "en-IN",
});

export const faqLd = () => ({
  "@context": ctx,
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const breadcrumbLd = (trail) => ({
  "@context": ctx,
  "@type": "BreadcrumbList",
  itemListElement: [["Home", "/"], ...trail].map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
});

/** ImageObject / VideoObject for one piece of event media. */
const mediaLd = (e, m) => {
  const common = {
    name: m.alt,
    caption: m.caption,
    description: m.caption,
    contentUrl: abs(m.src),
    contentLocation: { "@type": "Place", name: e.location, address: { "@type": "PostalAddress", addressLocality: "Pune", addressRegion: "Maharashtra", addressCountry: "IN" } },
    dateCreated: e.date,
    creator: ref(ids.org),
    copyrightHolder: ref(ids.org),
    creditText: site.name,
    isPartOf: ref(ids.event(e.slug)),
  };
  return m.video
    ? { "@type": "VideoObject", ...common, thumbnailUrl: abs(e.cover), uploadDate: e.date, encodingFormat: "video/mp4" }
    : { "@type": "ImageObject", ...common, url: abs(m.src), ...(m.width ? { width: m.width, height: m.height } : {}) };
};

export const eventLd = (e) => ({
  "@context": ctx,
  "@type": "Event",
  "@id": ids.event(e.slug),
  name: e.title,
  description: e.summary,
  startDate: e.date,
  ...(e.endDate ? { endDate: e.endDate } : {}),
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: e.location,
    address: { "@type": "PostalAddress", addressLocality: "Pune", addressRegion: "Maharashtra", addressCountry: "IN" },
  },
  image: [mediaLd(e, { ...eventCover(e), caption: eventCover(e).alt }), ...eventMedia(e).filter((m) => !m.video && m.src !== e.cover).map((m) => mediaLd(e, m))],
  ...(eventMedia(e).some((m) => m.video) ? { subjectOf: eventMedia(e).filter((m) => m.video).map((m) => mediaLd(e, m)) } : {}),
  url: abs(`/events/${e.slug}`),
  organizer: ref(ids.org),
  ...(e.speakers?.length
    ? { performer: e.speakers.map((s) => ({ "@type": "Person", name: s.name, ...(s.title ? { jobTitle: s.title } : {}) })) }
    : {}),
  // registration link only — price/availability are never guessed
  ...(e.registrationLink ? { offers: { "@type": "Offer", url: e.registrationLink } } : {}),
});

export const projectLd = (p) => ({
  "@context": ctx,
  "@type": "CreativeWork",
  "@id": ids.project(p.slug),
  name: p.tagline ? `${p.title} — ${p.tagline}` : p.title,
  description: p.summary,
  url: abs(`/projects/${p.slug}`),
  creativeWorkStatus: p.status,
  creator: [
    ref(ids.org),
    ...(p.team || []).map((m) => {
      const person = personByName(m.name);
      return person ? ref(ids.person(person.slug)) : { "@type": "Person", name: m.name };
    }),
  ],
  ...(p.partner?.name ? { sponsor: { "@type": "Organization", name: p.partner.name, ...(p.partner.url ? { url: p.partner.url } : {}) } } : {}),
  keywords: p.capabilities?.join(", "),
});

export const itemListLd = (name, items) => ({
  "@context": ctx,
  "@type": "ItemList",
  name,
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, url: abs(it.url), name: it.name })),
});
