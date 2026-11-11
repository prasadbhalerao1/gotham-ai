// Coordinates the first-visit intro with the rest of the page: the hero waits
// for `whenEntered()` before playing its entrance.
const KEY = "gotham-intro-seen";
let resolveEntered;
const entered = new Promise((r) => (resolveEntered = r));

// crawlers, link-preview fetchers and automated browsers never get the intro —
// they should see the page content immediately
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|GPTBot|ClaudeBot|Claude-User|Claude-SearchBot|PerplexityBot|Perplexity-User|OAI-SearchBot|ChatGPT-User|Google-Extended|Bingbot|Googlebot|Applebot|DuckDuckBot|YandexBot|HeadlessChrome|Lighthouse/i;

export function shouldShowIntro() {
  if (typeof window === "undefined") return false;
  if (navigator.webdriver || BOT.test(navigator.userAgent)) return false;
  if (window.location.pathname !== "/") return false;
  try {
    return !sessionStorage.getItem(KEY);
  } catch {
    return true;
  }
}

export function markEntered() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // ignore — the intro will just show again next visit
  }
  document.documentElement.classList.remove("intro-pending");
  resolveEntered();
}

export const whenEntered = () => entered;

// pages that never show the intro resolve straight away
if (typeof window !== "undefined" && !shouldShowIntro()) resolveEntered();
