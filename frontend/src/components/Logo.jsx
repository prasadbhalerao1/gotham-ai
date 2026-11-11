import { MARK_DOT, MARK_PATH, MARK_STROKE } from "../lib/mark.js";

const Logo = ({ className = "", title = "Gotham AI" }) => (
  <svg viewBox="140 120 740 740" className={className} role="img" aria-label={title}>
    <path d={MARK_PATH} fill="none" stroke="currentColor" strokeWidth={MARK_STROKE} strokeLinecap="round" strokeLinejoin="round" />
    <circle {...MARK_DOT} fill="currentColor" />
  </svg>
);

export default Logo;
