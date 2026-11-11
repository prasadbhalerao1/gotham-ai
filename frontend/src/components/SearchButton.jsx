import { usePalette } from "../lib/palette.js";

const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

/** Opens the site-wide search; shows the keyboard shortcut on wider screens. */
const SearchButton = ({ className = "" }) => {
  const openPalette = usePalette();
  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label="Search (Ctrl K)"
      aria-keyshortcuts="Control+K Meta+K /"
      className={`flex h-10 items-center gap-2 rounded-full px-2.5 text-bone-dim transition-colors hover:bg-bone/10 hover:text-bone ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-[1.2rem]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
      <kbd suppressHydrationWarning className="hidden rounded border border-bone/20 px-1.5 py-0.5 font-mono text-[0.6875rem] lg:inline">
        {isMac() ? "⌘K" : "Ctrl K"}
      </kbd>
    </button>
  );
};

export default SearchButton;
