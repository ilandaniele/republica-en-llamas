---
applyTo: "apps/web/src/components/illustrations/**"
---

# Pixel SVG Components — Contributor Instructions

All components in this folder render pixel-art SVG illustrations.

## SVG Rules

- Use only **`<rect>`** for pixel shapes — no `<circle>`, `<ellipse>`, or `<path>` except in portrait faces
- No `rx` or `ry` on rects (border-radius is `0 !important` globally)
- Coordinates use integer pixel values; avoid decimal positions
- `viewBox` should be `"0 0 W H"` with W/H matching integer pixel dimensions
- Always include `xmlns="http://www.w3.org/2000/svg"` on the root `<svg>`

## Standard Element Sizes

| Component type | Typical viewBox |
|---|---|
| Small decorative | `0 0 40 50` |
| Medium character | `0 0 60 80` |
| Vehicle | `0 0 80 40` |
| Background / cityscape | `0 0 800 400` with `preserveAspectRatio="xMidYMid slice"` |
| Portrait | `0 0 200 240` |

## CSS Animations

Apply pixel animations via `style={{ animation: '...' }}` referencing these keyframe names (defined under `keyframes` in `apps/web/tailwind.config.ts`):

| Animation | Use |
|---|---|
| `pixel-rise 2s ease-in infinite` | Rising smoke / steam particles |
| `pixel-fire 0.5s steps(2) infinite` | Flickering fire layers |
| `pixel-float 3s ease-in-out infinite` | Gentle float (dollar bills, etc.) |
| `dolar-float-up 2s ease-in forwards` | One-shot upward float |
| `blink-star 2s ease-in-out infinite` | Star twinkle |
| `colectivo-move 30s linear infinite` | Horizontal vehicle scroll |
| `idle-look 4s ease-in-out infinite` | Subtle idle head movement |
| `pixel-confetti 1.5s ease-out forwards` | Confetti piece fall |
| `crowd-enter 0.4s ease-out forwards` | Crowd torch rise |

Use `animationDelay` to stagger multiple instances.

## Component Structure

```tsx
import React from 'react';

interface Props {
  // document all props
  steaming?: boolean;  // example optional feature prop
  size?: 'sm' | 'md' | 'lg';
}

export function PixelXxx({ steaming = false, size = 'md' }: Props) {
  const scale = size === 'sm' ? 0.6 : size === 'lg' ? 1.4 : 1;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 50"
      width={40 * scale}
      height={50 * scale}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* pixel rects here */}
    </svg>
  );
}
```

## Exporting

After creating a new component, add an export line for it to `index.ts`:
```ts
export { PixelXxx } from './PixelXxx.js';
```

## PixelPortrait specifics

`PortraitId` and `PortraitMood` are exported from `PixelPortrait.tsx` — read the unions there rather than relying on a copy.

Each portrait is a `function XxxPortrait({ mood })` returning a `<g>` drawn on the shared `200×240` canvas. `PixelPortrait` maps archetype ids (e.g. `ingeniero` → `milei`) to a base portrait, then renders the matching component with `{base === 'xxx' && <XxxPortrait mood={mood} />}`. Adding a new president requires:
1. A new `function XxxPortrait({ mood })` component on the `200×240` canvas
2. A new `{base === 'xxx' && …}` line in `PixelPortrait` (and an alias in the `base` mapping if the id is an archetype)
3. Adding the new id to the `PortraitId` type union

## BuenosAiresBackground

Fixed full-screen overlay: `className="fixed inset-0 pointer-events-none z-0"` with `style={{ opacity: 0.15 }}`, set inside the component (it takes no props).  
Always rendered as the **first child** of the root game div, before all other content.
