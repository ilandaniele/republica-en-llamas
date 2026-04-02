---
agent: ask
description: "Add a viral newspaper share image to the game over screen. Use when: implementing the 'Compartir imagen' feature that generates a pixel-art newspaper card with html2canvas and shares via Web Share API."
---

Implement the viral share image feature for República en Llamas.

## What to build

A "Compartir imagen" button on the Game Over screen that:
1. Renders an off-screen pixel-art newspaper card component
2. Captures it with `html2canvas`
3. Shares the image via the Web Share API (with a download fallback)
4. Fires the correct analytics event

---

## Step 1 — Install html2canvas

```sh
cd apps/web && npm install html2canvas
```

Verify it's added to `apps/web/package.json` before proceeding.

---

## Step 2 — Create `ShareImageCard` component

Create `apps/web/src/components/ShareImageCard.tsx`.

**Layout spec (600×400px):**
```
┌──────────────────────────────────────────┐
│  LA NACIÓN PIXEL  •  EDICIÓN CRISIS       │  ← Press Start 2P, 8px, crimson
│══════════════════════════════════════════│
│  [PixelPortrait mood="panic"]  ║  BIG     │
│  120×140 left-aligned          ║  HEADL.  │  ← headline font-serif, 10px
│                                ║          │
│                                ║  Body:   │  ← VT323, 18px, smoke-200
│                                ║  score + │
│                                ║  turns   │
│──────────────────────────────────────────│
│  "quote from Aníbal"                      │  ← VT323 italic, 16px
│──────────────────────────────────────────│
│  🔥 republicaenllamas.com      TURN XX   │  ← Press Start 2P, 6px
└──────────────────────────────────────────┘
```

CSS rules for the card:
- Background: `#f4f4f0` (aged newsprint)
- Border: `.pixel-border` (2px solid celeste-dark)
- `image-rendering: pixelated`
- Position it off-screen: `position: absolute; left: -9999px; top: -9999px`
- Width: exactly `600px`, height: exactly `400px`
- `overflow: hidden`

The headline should be pulled from the `gameState.postMortem.headline` field if it exists, otherwise generate a dramatic placeholder: `"EL PAÍS EN LLAMAS — MANDATO TERMINADO"`.

Import `PixelPortrait` from `./illustrations`. Pass `mood="panic"` if the player's final popularity < 30, else `mood="neutral"`.

---

## Step 3 — Update `GameOverScreen.tsx`

Read the file first to understand its current structure.

Add the following near the existing share buttons section:
1. Import `useRef` from React and `html2canvas` (type: `import type` for the lib type, dynamic import for the call)
2. Create `const shareCardRef = useRef<HTMLDivElement>(null)`
3. Add `<ShareImageCard ref={shareCardRef} gameState={gameState} />` as the first child of the root div (it is off-screen, so it won't affect layout)
4. Add the "Compartir imagen" button:

```tsx
<button
  className="pixel-border font-serif text-[8px] text-smoke-100 bg-navy-800 px-4 py-2 hover:bg-crimson-900 transition-colors"
  onClick={handleShareImage}
>
  COMPARTIR IMAGEN
</button>
```

5. Implement `handleShareImage`:

```ts
const handleShareImage = async () => {
  if (!shareCardRef.current) return;
  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(shareCardRef.current, {
    scale: 2,           // retina quality
    useCORS: true,
    backgroundColor: '#f4f4f0',
  });

  canvas.toBlob(async (blob) => {
    if (!blob) return;
    const file = new File([blob], 'republica-en-llamas.png', { type: 'image/png' });

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'República en Llamas',
        text: '¿Podrás gobernar Argentina mejor que yo?',
        url: 'https://republicaenllamas.com',
      });
    } else {
      // Fallback: trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'republica-en-llamas.png';
      a.click();
      URL.revokeObjectURL(url);
    }
    trackShareClicked({ share_type: 'image' });
  }, 'image/png');
};
```

---

## Step 4 — Update `analytics.ts`

Read `apps/web/src/lib/analytics.ts` first.

Ensure `trackShareClicked` accepts `share_type: 'image' | 'text' | 'screenshot'`. If the function already exists but doesn't have this param, update its type signature to include it. Do not change existing callers unless their type now fails.

---

## Step 5 — Forward ref in ShareImageCard

The component needs to expose its DOM ref. Use React `forwardRef`:
```tsx
import { forwardRef } from 'react';

const ShareImageCard = forwardRef<HTMLDivElement, ShareImageCardProps>(
  ({ gameState }, ref) => {
    return (
      <div ref={ref} style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        {/* newspaper layout */}
      </div>
    );
  }
);
ShareImageCard.displayName = 'ShareImageCard';
export default ShareImageCard;
```

---

## Rules

- The off-screen card must NOT use Tailwind `fixed`/`absolute` with z-index — it should not affect scroll or layout
- `html2canvas` does not support CSS `clip-path` or `backdrop-blur` — avoid those in ShareImageCard
- Always fire `trackShareClicked` AFTER the share/download completes, not before
- `image-rendering: pixelated` must be set inline on the card div (html2canvas may not see Tailwind's global)
- Test cross-browser: `navigator.canShare` is not available in all desktop browsers — the `toBlob` fallback must always work
