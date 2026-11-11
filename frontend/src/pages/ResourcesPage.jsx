import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import StructuredData from "../components/StructuredData.jsx";
import { breadcrumbLd, pageLd } from "../lib/structuredData.js";
import PageHeader from "../components/PageHeader.jsx";
import { resources } from "../data/resources.js";

const published = resources.filter((r) => r.published !== false);
const uniq = (k) => ["All", ...new Set(published.map((r) => r[k]))];

const ResourcesPage = () => {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const list = useMemo(
    () =>
      published.filter(
        (r) =>
          (category === "All" || r.category === category) &&
          (difficulty === "All" || r.difficulty === difficulty) &&
          `${r.title} ${r.description} ${r.author}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [q, category, difficulty],
  );

  const select = "w-full border-b border-bone/20 bg-transparent py-2 text-bone focus:border-signal focus:outline-none";

  return (
    <>
      <SEO fullTitle="AI & Machine Learning Learning Resources | Gotham AI" description="Courses, tutorials, books and datasets for learning AI and machine learning, picked by the Gotham AI community in Pune." />
      <StructuredData data={[pageLd("CollectionPage", "/resources", { name: "Gotham AI learning resources" }), breadcrumbLd([["Resources", "/resources"]])]} />
      <PageHeader
        crumbs={[{ label: "Resources" }]}
        title={
          <>
            The <span className="accent">reading</span> room
          </>
        }
        intro="Courses, tutorials, books and datasets for working through AI and ML. Filter by topic or level."
      />
      <section className="wrap py-12 md:py-20">
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <label className="block">
            <span className="label">Search</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title, author…" className={`${select} placeholder:text-bone-mute`} />
          </label>
          <label className="block">
            <span className="label">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={select}>
              {uniq("category").map((c) => (
                <option key={c} className="bg-ink">{c}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="label">Level</span>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={select}>
              {uniq("difficulty").map((c) => (
                <option key={c} className="bg-ink">{c}</option>
              ))}
            </select>
          </label>
        </div>

        <p className="label mb-4" aria-live="polite">
          {list.length} of {published.length} resources
        </p>
        {list.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-bone/20 p-12 text-center text-bone-dim">Nothing matches — try another filter.</p>
        ) : (
          <ul className="grid overflow-hidden rounded-2xl border-l border-t border-bone/10 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((r, i) => (
              <li key={r.slug} data-reveal="rise" className="border-b border-r border-bone/10">
                <Link
                  to={`/resources/${r.slug}`}
                  className="group relative flex h-full min-h-[19rem] flex-col overflow-hidden p-7 transition-colors duration-500 hover:bg-ink-800"
                >
                  {/* oversized type word as a quiet backdrop */}
                  <span
                    aria-hidden
                    className="display pointer-events-none absolute -bottom-3 -right-2 text-[6rem] leading-none text-bone/[0.04] transition-colors duration-500 group-hover:text-signal/10"
                  >
                    {r.type}
                  </span>
                  <span className="flex items-center justify-between font-mono text-[0.6875rem] uppercase tracking-[0.16em]">
                    <span className="text-signal">{r.type}</span>
                    <span className="text-bone-mute">{String(i + 1).padStart(2, "0")}</span>
                  </span>
                  <span className="display mt-8 text-4xl leading-[0.92] transition-colors duration-300 group-hover:text-signal">{r.title}</span>
                  <span className="mt-3 line-clamp-3 text-bone-dim">{r.description}</span>
                  <span className="relative mt-auto flex items-end justify-between gap-4 pt-8">
                    <span className="font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.12em] text-bone-mute">
                      {r.category}
                      <br />
                      {r.author}
                    </span>
                    <span className="flex items-center gap-1" aria-label={`Level: ${r.difficulty}`}>
                      {["Beginner", "Intermediate", "Advanced"].map((lvl, k) => (
                        <span
                          key={lvl}
                          className={`h-1.5 w-4 rounded-full ${
                            k <= ["Beginner", "Intermediate", "Advanced"].indexOf(r.difficulty) ? "bg-signal" : "bg-bone/15"
                          }`}
                        />
                      ))}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default ResourcesPage;
