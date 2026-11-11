// schema.org JSON-LD builders for search engines and answer engines.
// Rendered with <StructuredData data={…} />.
import { SITE_URL, faqs, site } from "../data/site.js";

const abs = (p) => (p?.startsWith("http") ? p : `${SITE_URL}${p}`);
const realSocials = () => site.socials.map((s) => s.href).filter((h) => new URL(h).pathname.length > 1);

export const organizationLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#org`,
  name: site.name,
  url: SITE_URL,
  logo: abs("/img/logo.jpg"),
  description: site.description,
  slogan: site.tagline,
  parentOrganization: { "@type": "CollegeOrUniversity", name: site.institution },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tathawade, Pune",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  ...(realSocials().length ? { sameAs: realSocials() } : {}),
});

export const websiteLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: site.name,
  alternateName: ["Gotham AI RSCOE", "Gotham AI Club"],
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#org` },
  inLanguage: "en-IN",
});

export const faqLd = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const breadcrumbLd = (trail) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [["Home", "/"], ...trail].map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: abs(path),
  })),
});

export const eventLd = (e) => ({
  "@context": "https://schema.org",
  "@type": "Event",
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
  image: [e.cover, ...(e.gallery || []).filter((g) => !/\.mp4$/i.test(g))].slice(0, 5).map(abs),
  url: `${SITE_URL}/events/${e.slug}`,
  organizer: { "@id": `${SITE_URL}/#org`, "@type": "Organization", name: site.name, url: SITE_URL },
  ...(e.speakers?.length ? { performer: e.speakers.map((s) => ({ "@type": "Person", name: s.name })) } : {}),
  ...(e.registrationLink ? { offers: { "@type": "Offer", url: e.registrationLink, price: 0, priceCurrency: "INR", availability: "https://schema.org/InStock" } } : {}),
});

export const projectLd = (p) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: p.tagline ? `${p.title} — ${p.tagline}` : p.title,
  description: p.summary,
  url: `${SITE_URL}/projects/${p.slug}`,
  creativeWorkStatus: p.status,
  creator: [{ "@id": `${SITE_URL}/#org`, "@type": "Organization", name: site.name }, ...(p.team || []).map((m) => ({ "@type": "Person", name: m.name }))],
  ...(p.partner?.name ? { sponsor: { "@type": "Organization", name: p.partner.name, ...(p.partner.url ? { url: p.partner.url } : {}) } } : {}),
  keywords: p.capabilities?.join(", "),
});

export const itemListLd = (name, items) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, url: abs(it.url), name: it.name })),
});
