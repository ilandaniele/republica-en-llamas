---
applyTo: ["**/*scroll*", "**/*ScrollTrigger*", "**/scroll*"]
---

# ScrollTrigger — path-specific instructions

When writing or suggesting scroll-linked GSAP code (ScrollTrigger):

- Register the plugin once: `gsap.registerPlugin(ScrollTrigger)`.
- Use **`scrub: true`** (or a number for smoothing) for scroll-driven progress; use **`toggleActions`** for discrete play/reverse. Do **not** use both on the same trigger.
- Put ScrollTrigger on the **timeline or a top-level tween**, not on a tween that is a child of a timeline.
  - ❌ Wrong: `tl.to(".el", { x: 100, scrollTrigger: { trigger: ".el" } })`
  - ✅ Right: `gsap.timeline({ scrollTrigger: { trigger: ".section", scrub: true } }).to(".el", { x: 100 })`
- When **pinning**, do **not** animate the pinned element itself — animate its children. Use `pinSpacing: true` (default) so layout does not collapse.
- Prefer `x`, `y`, `scale`, `rotation` (transform aliases) for animated elements; avoid animating layout properties (`top`, `left`, `width`, `height`) when possible.
- For fake horizontal scroll (pin a section, content moves horizontally while scrolling vertically), use `containerAnimation` and `ease: "none"` on the horizontal tween.
- **`start` / `end` format:** `"triggerPosition viewportPosition"` (e.g. `"top center"`, `"bottom top"`). Use `endTrigger` when the end is based on a different element.
- Call **`ScrollTrigger.refresh()`** after DOM or layout changes that affect trigger positions (e.g. dynamic content, fonts loaded). Viewport resize is handled automatically.
- Create ScrollTriggers in **top-to-bottom page order**, or set `refreshPriority` so they refresh in the correct order.
- In React SPAs, **kill** ScrollTrigger instances when components unmount — `useGSAP` handles this automatically; if using raw `useEffect`, call `ScrollTrigger.getAll().forEach(t => t.kill())` or kill by id in the cleanup.

**Minimal ScrollTrigger + React pattern:**
```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 1,
      },
    });
    tl.to(".panel", { x: 200 }).to(".panel", { autoAlpha: 0 });
  }, { scope: containerRef });

  return <div ref={containerRef}><div className="panel">...</div></div>;
}
```
