// Coordinates the first-visit intro with the rest of the page: the hero waits
// for `whenEntered()` before playing its entrance.
const KEY = "gotham-intro-seen";
let resolveEntered;
const entered = new Promise((r) => (resolveEntered = r));

export function shouldShowIntro() {
  if (typeof window === "undefined") return false;
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
