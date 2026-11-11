import { Link } from "react-router-dom";
import { eventMedia, sortedEvents } from "../../data/site.js";

// Every photo from every event (videos skipped), interleaved so neighbours differ.
const photos = (() => {
  const lists = sortedEvents.map((e) =>
    eventMedia(e)
      .filter((m) => !m.video)
      .map((m) => ({ ...m, title: e.title, slug: e.slug })),
  );
  const out = [];
  for (let i = 0; lists.some((l) => l[i]); i++) lists.forEach((l) => l[i] && out.push(l[i]));
  return out;
})();
const half = Math.ceil(photos.length / 2);
const rows = [photos.slice(0, half), photos.slice(half)];

function Row({ items, reverse }) {
  // the list is rendered twice so the -50% marquee loops seamlessly
  return (
    <div className="group/row flex w-max gap-3 md:gap-4" style={{ animation: `marquee ${items.length * 6}s linear infinite ${reverse ? "reverse" : ""}` }}>
      {[...items, ...items].map((p, i) => (
        <Link
          key={i}
          to={`/events/${p.slug}`}
          tabIndex={i >= items.length ? -1 : undefined}
          aria-hidden={i >= items.length ? true : undefined}
          className="group relative block h-44 shrink-0 overflow-hidden md:h-64"
        >
          <img
            src={p.src}
            alt={i < items.length ? p.alt : ""}
            width={p.width}
            height={p.height}
            loading="lazy"
            decoding="async"
            className="h-full w-auto max-w-none object-cover transition duration-700 ease-expo group-hover:scale-105"
          />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-3 text-sm text-bone opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {p.title}
          </span>
        </Link>
      ))}
    </div>
  );
}

const Moments = () => (
  <section aria-labelledby="moments-title" className="overflow-hidden border-y border-bone/10 bg-ink-800 py-20 md:py-28">
    <div className="wrap mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <h2 id="moments-title" data-reveal="mask" className="display text-6xl md:text-8xl">
        In the <span className="accent">room</span>
      </h2>
      <p className="label">{photos.length} photos from {sortedEvents.length} events</p>
    </div>
    <div className="space-y-3 [&:hover_.group\/row]:[animation-play-state:paused] md:space-y-4">
      <Row items={rows[0]} />
      <Row items={rows[1]} reverse />
    </div>
  </section>
);

export default Moments;
