import { useEffect } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

/**
 * Keeps keyboard focus inside `ref` while `active`, focuses the first control
 * (or `initial`), and hands focus back to whatever opened it on close.
 */
export function useFocusTrap(ref, active, initial) {
  useEffect(() => {
    if (!active) return;
    const opener = document.activeElement;
    const node = ref.current;
    const items = () => [...(node?.querySelectorAll(FOCUSABLE) ?? [])].filter((el) => el.offsetParent !== null || el === document.activeElement);

    const first = initial?.current ?? items()[0];
    requestAnimationFrame(() => first?.focus({ preventScroll: true }));

    const onKey = (e) => {
      if (e.key !== "Tab" || !node) return;
      const list = items();
      if (!list.length) return;
      const head = list[0];
      const tail = list[list.length - 1];
      if (e.shiftKey && document.activeElement === head) {
        e.preventDefault();
        tail.focus();
      } else if (!e.shiftKey && document.activeElement === tail) {
        e.preventDefault();
        head.focus();
      } else if (!node.contains(document.activeElement)) {
        e.preventDefault();
        head.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (opener && typeof opener.focus === "function") opener.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
