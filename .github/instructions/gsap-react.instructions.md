---
applyTo: "**/*.{tsx,jsx}"
---

# GSAP in React — path-specific instructions

When writing or suggesting GSAP code in React/JSX/TSX files:

- Prefer **`useGSAP()`** from `@gsap/react` over raw `useEffect` for GSAP setup. Register the hook once: `gsap.registerPlugin(useGSAP)` (and any other plugins used).
- Pass a **scope** (ref to container) so selectors are scoped: `useGSAP(() => { ... }, { scope: containerRef })`. This avoids animating elements outside the component.
- When targeting by ref, pass the **DOM element** (`ref.current`), not the ref object. Wrong: `gsap.to(myRef, ...)`. Right: `gsap.to(myRef.current, ...)`.
- Rely on `useGSAP`'s automatic **cleanup** on unmount (reverts animations and kills ScrollTriggers). Do not leave ScrollTriggers or timelines running after unmount.
- Use **`contextSafe`** (returned from `useGSAP`) to wrap event-handler callbacks like `onClick` so they no-op after unmount and avoid React state-update warnings.
- By default `useGSAP` runs once (empty dependency array). To re-run when deps change, pass `{ dependencies: [dep1, dep2] }` or `{ revertOnUpdate: true }` as the second argument.
- If not using `useGSAP`, use **`gsap.context()`** in `useEffect` and return a cleanup that calls `ctx.revert()`.
- Do **not** call `gsap.to()` or any GSAP method directly inside a `useEffect` without context cleanup — leaked ScrollTriggers will fire on unmounted elements.
- For `AnimatePresence` + GSAP combos: let framer handle enter/exit for cards (keep existing usage); use GSAP for UI elements that need timeline control, scroll-linking, or sequenced multi-element choreography.

**Minimal React + GSAP pattern:**
```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

export function MyComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".item", { autoAlpha: 0, y: 20, stagger: 0.1 });
  }, { scope: containerRef });

  return <div ref={containerRef}><div className="item">...</div></div>;
}
```
