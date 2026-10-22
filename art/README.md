# Pixel-art assets

All game art is 16-bit pixel art: event scenes, Casa Rosada backgrounds, president portraits and event-card characters.
Images are generated outside the repo (e.g. with Codex) and then pixelated into the web app by `scripts/pixel-art.py`.

## Files

- `prompts.json`: source of truth (shared style, groups, sizes, pixel grids, subjects, moods).
- `PROMPTS.md`: one ready-to-paste prompt per image, generated from `prompts.json`.
- `raw/`: generated images, `<id>.png` (gitignored).

## Instructions for Codex

1. Read `art/PROMPTS.md`.
2. For every `### <id>` entry, generate one image from the prompt in its code block, at the size on its `Size:` line.
3. Save it as `art/raw/<id>.png`, using the id exactly as written (e.g. `art/raw/portrait_milei_panic.png`).
4. If a prompt is refused because it names a real politician, retry with the same prompt minus the name. Keep the physical description.
5. Keep the same character design across the moods of one subject (`_neutral`, `_panic`, `_victory` / `_normal`, `_panic`). Generate the neutral image first and use it as a reference.
6. When done, or after any batch, run the import from the repo root:

```bash
uvx --with pillow python scripts/pixel-art.py import
```

Import pixelates each raw image to its grid, reduces it to 32 colours, writes `apps/web/public/illustrations/<id>.webp` and points `apps/web/src/assets/image-manifest.json` at it.
Missing raw files are skipped. Pass ids to import only some: `... import portrait_milei_neutral eco_growth`.

The game picks the images up by id. Portraits and characters fall back to the code-drawn SVGs until their image exists.

## Casa Rosada diorama (`cr_*`)

The Casa Rosada scene is assembled in code from separate sprite layers (island, crowd, police, fire, helicopter, jets, mushroom cloud, graves). Code places, stacks and animates them, so each layer is its own image.

1. Generate `cr_island` first and use it as the style reference for every other `cr_*` sprite.
2. Draw each sprite on a flat magenta `#FF00FF` background. Never use magenta inside the sprite itself.
3. Save as `art/raw/cr_<id>.png` and run the import. Magenta becomes transparent.

Until a sprite exists, the scene uses its code-drawn fallback.

## Changing prompts

Edit `prompts.json`, then regenerate `PROMPTS.md`:

```bash
uvx --with pillow python scripts/pixel-art.py prompts
```
