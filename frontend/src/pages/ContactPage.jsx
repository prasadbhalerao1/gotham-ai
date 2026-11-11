import SEO from "../components/SEO.jsx";
import StructuredData from "../components/StructuredData.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { breadcrumbLd, pageLd } from "../lib/structuredData.js";
import { useContact } from "../lib/contact.js";
import { site } from "../data/site.js";

const ContactPage = () => {
  const openContact = useContact();
  return (
    <>
      <SEO
        fullTitle="Contact Gotham AI | Partnerships, Events & Joining"
        description={`Contact ${site.name} at ${site.email} for partnerships, sponsoring or co-hosting events, speaking, or joining the community at ${site.institutionShort}, Pune.`}
      />
      <StructuredData data={[pageLd("ContactPage", "/contact", { name: "Contact Gotham AI" }), breadcrumbLd([["Contact", "/contact"]])]} />
      <PageHeader
        crumbs={[{ label: "Contact" }]}
        title={
          <>
            Get in <span className="accent">touch</span>
          </>
        }
        intro="Partnerships, sponsoring or co-hosting an event, speaking at a session, or joining the community — we'd like to hear from you."
      />
      <section className="wrap grid gap-6 py-16 md:grid-cols-3 md:py-24">
        <a href={`mailto:${site.email}`} className="group rounded-2xl bg-signal p-8 text-ink md:col-span-2">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink/60">Email</span>
          <span className="mt-3 block break-all font-display text-4xl font-semibold tracking-tight md:text-6xl">{site.email}</span>
          <span className="mt-6 block text-ink/70">We usually reply within a few days.</span>
        </a>
        <div className="flex flex-col gap-4">
          <button type="button" onClick={openContact} className="flex-1 rounded-2xl border border-bone/15 p-6 text-left transition-colors hover:border-bone/40">
            <span className="label">Message form</span>
            <span className="mt-2 block text-2xl text-bone">Write to us here →</span>
          </button>
          <a href={site.joinForm} target="_blank" rel="noreferrer" className="flex-1 rounded-2xl border border-bone/15 p-6 transition-colors hover:border-bone/40">
            <span className="label">Students</span>
            <span className="mt-2 block text-2xl text-bone">Join Gotham AI ↗</span>
          </a>
        </div>
        <address className="not-italic text-bone-dim md:col-span-3">
          <span className="label mb-2 block">Find us</span>
          <a href={site.mapLink} target="_blank" rel="noreferrer" className="text-lg text-bone hover:text-signal">
            {site.institution}, {site.city}, Maharashtra, India
          </a>
        </address>
      </section>
    </>
  );
};

export default ContactPage;
