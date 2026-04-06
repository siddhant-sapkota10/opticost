import { useEffect, useRef } from "react";

/**
 * Returns `true` if this page has already played its entrance animations during
 * the current browser session (i.e. the user is navigating back via history).
 *
 * Usage:
 *   const isReturn = useSkipAnimation("/");
 *   <motion.div initial={isReturn ? false : { opacity: 0, y: 24 }} ...>
 *
 * How it works:
 *   - On first visit the sessionStorage key is absent → returns false → animations play.
 *   - After mount the key is written to sessionStorage.
 *   - On any client-side re-mount (back/forward navigation) the key is present
 *     → returns true → pass `initial={false}` to skip the hidden starting state.
 *   - sessionStorage is tab-scoped, so a hard refresh or a new tab starts fresh.
 *   - On the server (SSR/hydration) window is undefined → safely returns false.
 */
export function useSkipAnimation(pageKey: string): boolean {
  const storageKey = `opticost:animated:${pageKey}`;

  // Read synchronously so the very first render already knows the answer.
  // useRef freezes the value for the lifetime of this component instance.
  const isReturn = useRef(
    typeof window !== "undefined" &&
      sessionStorage.getItem(storageKey) === "1",
  ).current;

  useEffect(() => {
    sessionStorage.setItem(storageKey, "1");
  }, [storageKey]);

  return isReturn;
}
