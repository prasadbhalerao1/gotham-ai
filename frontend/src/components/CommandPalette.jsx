import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "../data/site.js";
import { searchIndex, suggestionOrder } from "../data/search.js";
import Fuse from "fuse.js";
import { useFocusTrap } from "../lib/useFocusTrap.js";
import { lockScroll } from "../lib/smooth.js";

// Fuse.js handles the fuzzy part: typos, partial words, out-of-order terms.
const fuse = new Fuse(searchIndex, {
  keys: [
    { name: "title", weight: 3 },
    { name: "meta", weight: 1 },
    { name: "keywords", weight: 1 },
  ],
  threshold: 0.38,
  ignoreLocation: true,
  includeMatches: true,
  minMatchCharLength: 2,
  useExtendedSearch: false,
});

/** Matched character positions in the title, for highlighting. */
const titleHits = (matches = []) =>
  matches
    .filter((m) => m.key === "title")
    .flatMap((m) => m.indices.filter(([a, b]) => b > a).flatMap(([a, b]) => Array.from({ length: b - a + 1 }, (_, k) => a + k)));

const sectionOf = (pathname) =>
  pathname.startsWith("/projects") ? "Project" : pathname.startsWith("/resources") ? "Resource" : "Event";

/** Title with the fuzzy-matched letters lit up. */
function Highlight({ text, idx }) {
  if (!idx?.length) return text;
  const hit = new Set(idx);
  return [...text].map((ch, i) =>
    hit.has(i) ? (
      <mark key={i} className="bg-transparent text-signal">
        {ch}
      </mark>
    ) : (
      ch
    ),
  );
}

/** Site-wide search: ⌘K / Ctrl K or "/" opens it; arrows move, Enter opens, Esc closes. */
const CommandPalette = ({ open, onClose, onContact }) => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const panel = useRef(null);
  const input = useRef(null);
  const list = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const results = useMemo(() => {
    const here = sectionOf(pathname);
    if (!query.trim()) {
      // nothing typed: this section first, then the rest, then pages & actions
      const order = [here, ...suggestionOrder.filter((g) => g !== here)];
      return order.flatMap((g) => searchIndex.filter((i) => i.group === g).slice(0, g === here ? 6 : 3)).map((item) => ({ item, idx: [] }));
    }
    return fuse
      .search(query.trim(), { limit: 24 })
      // nudge this section's items up when scores are close (lower Fuse score = better)
      .map((r) => ({ item: r.item, idx: titleHits(r.matches), rank: r.score - (r.item.group === here ? 0.05 : 0) }))
      .sort((a, b) => a.rank - b.rank);
  }, [query, pathname]);

  useFocusTrap(panel, open, input);
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    lockScroll(true);
    return () => lockScroll(false);
  }, [open]);
  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const choose = (item) => {
    onClose();
    if (item.action === "contact") return onContact();
    if (item.action === "join") return window.open(site.joinForm, "_blank", "noopener");
    if (item.href?.startsWith("mailto:")) return (window.location.href = item.href);
    if (item.href) return window.open(item.href, "_blank", "noopener");
    navigate(item.to);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      choose(results[active].item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] bg-ink/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          onKeyDown={onKeyDown}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Search Gotham AI"
            initial={{ y: -16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
            className="wrap flex h-full max-w-5xl flex-col pb-6 pt-[9vh]"
          >
            {/* the query, set large */}
            <div className="flex items-end gap-4 border-b border-bone/20 pb-3 focus-within:border-signal">
              <input
                ref={input}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Gotham"
                aria-label="Search events, projects, people and resources"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-results"
                aria-activedescendant={results[active] ? `palette-opt-${active}` : undefined}
                autoComplete="off"
                spellCheck="false"
                className="display min-w-0 flex-1 bg-transparent text-5xl text-bone caret-signal placeholder:text-bone/20 focus:outline-none md:text-7xl"
              />
              <span className="shrink-0 pb-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-bone-mute">
                {String(results.length).padStart(2, "0")} {query ? "found" : "suggested"}
              </span>
            </div>

            <ul
              ref={list}
              id="palette-results"
              role="listbox"
              aria-label="Results"
              className="mt-4 min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {results.length === 0 && (
                <li className="py-16 text-bone-dim">
                  Nothing for “{query}”. Try fewer letters, or{" "}
                  <button type="button" onClick={() => choose(searchIndex.find((i) => i.action === "contact"))} className="text-signal underline-offset-4 hover:underline">
                    ask us directly
                  </button>
                  .
                </li>
              )}
              {results.map(({ item, idx }, i) => (
                <li
                  key={item.group + item.title}
                  id={`palette-opt-${i}`}
                  role="option"
                  aria-selected={i === active}
                  data-index={i}
                  onMouseMove={() => setActive(i)}
                  onClick={() => choose(item)}
                  className={`relative grid cursor-pointer grid-cols-[3.5rem_1fr_auto] items-center gap-4 border-b border-bone/[0.07] py-3 pl-4 pr-2 transition-colors md:grid-cols-[4.5rem_1fr_auto] ${
                    i === active ? "bg-bone/[0.05]" : ""
                  }`}
                >
                  <span aria-hidden className={`absolute inset-y-0 left-0 w-[2px] bg-signal transition-opacity ${i === active ? "opacity-100" : "opacity-0"}`} />
                  <span className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-ink-700 font-display text-xl uppercase text-bone/40">
                    {item.thumb ? <img src={item.thumb} alt="" loading="lazy" className="size-full object-cover" /> : item.mono}
                  </span>
                  <span className="min-w-0">
                    <span className={`block truncate text-lg md:text-xl ${i === active ? "text-bone" : "text-bone-dim"}`}>
                      <Highlight text={item.title} idx={idx} />
                    </span>
                    <span className="block truncate font-mono text-[0.6875rem] uppercase tracking-widest text-bone-mute">{item.meta}</span>
                  </span>
                  <span className="hidden font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-bone-mute sm:block">{item.group}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-bone-mute">
              <span className="flex gap-5">
                <span>↑↓ Move</span>
                <span>↵ Open</span>
                <span>Esc Close</span>
              </span>
              <span>Typos are fine</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
