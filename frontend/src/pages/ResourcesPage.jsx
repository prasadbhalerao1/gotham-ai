import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";
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
      <SEO title="Resources" description="Curated AI and ML learning material picked by the Gotham AI community." />
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
        <ul>
          {list.map((r) => (
            <li key={r.slug}>
              <Link
                to={`/resources/${r.slug}`}
                className="group grid gap-3 border-t border-bone/10 py-6 transition-colors hover:bg-ink-800/60 md:grid-cols-12 md:items-baseline md:px-4"
              >
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-signal md:col-span-2">{r.type}</span>
                <span className="md:col-span-6">
                  <span className="display block text-4xl transition-colors group-hover:text-signal">{r.title}</span>
                  <span className="mt-1 block text-bone-dim">{r.description}</span>
                </span>
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-bone-mute md:col-span-3">
                  {r.category} · {r.difficulty}
                  <br />
                  {r.author}
                </span>
                <span aria-hidden className="hidden text-right text-xl md:col-span-1 md:block">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default ResourcesPage;
