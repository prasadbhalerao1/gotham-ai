import { useParams } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import StructuredData from "../components/StructuredData.jsx";
import { breadcrumbLd } from "../lib/structuredData.js";
import PageHeader from "../components/PageHeader.jsx";
import { resources } from "../data/resources.js";
import NotFoundPage from "./NotFoundPage.jsx";

const ResourceDetailPage = () => {
  const { slug } = useParams();
  const r = resources.find((x) => x.slug === slug && x.published !== false);
  if (!r) return <NotFoundPage what="resource" />;

  return (
    <>
      <SEO title={`${r.title} — ${r.type}`} description={`${r.description} A ${r.difficulty.toLowerCase()} ${r.category} resource recommended by Gotham AI.`} />
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: r.title,
            description: r.description,
            learningResourceType: r.type,
            educationalLevel: r.difficulty,
            ...(r.url && !/example\.com/.test(r.url) ? { url: r.url } : {}),
          },
          breadcrumbLd([
            ["Resources", "/resources"],
            [r.title, `/resources/${r.slug}`],
          ]),
        ]}
      />
      <PageHeader crumbs={[{ label: "Resources", to: "/resources" }, { label: r.type }]} title={r.title} intro={r.description}>
        <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
          {[
            ["Type", r.type],
            ["Category", r.category],
            ["Level", r.difficulty],
            ["By", r.author],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="label">{k}</dt>
              <dd className="mt-1 capitalize text-bone">{v}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>
      <section className="wrap py-16">
        {r.content && <p className="mb-10 max-w-2xl text-lg leading-relaxed text-bone-dim">{r.content}</p>}
        {r.url && (
          <a href={r.url} target="_blank" rel="noreferrer" className="btn-signal">
            Open resource ↗
          </a>
        )}
      </section>
    </>
  );
};

export default ResourceDetailPage;
