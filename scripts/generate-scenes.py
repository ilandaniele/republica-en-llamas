"""Generate scene illustrations with the free FLUX.1-schnell Hugging Face Space.

Anonymous ZeroGPU quota is small; the script waits and retries until it refills.

Usage (from repo root):
    uvx --with gradio_client python scripts/generate-scenes.py [--force] [ids...]

Reads scripts/scene-prompts.json, writes apps/web/public/illustrations/<id>.webp
and points apps/web/src/assets/image-manifest.json at the local files.
"""

import json
import shutil
import sys
import time
import zlib
from pathlib import Path

from gradio_client import Client

ROOT = Path(__file__).resolve().parent.parent
PROMPTS = ROOT / "scripts" / "scene-prompts.json"
OUT_DIR = ROOT / "apps" / "web" / "public" / "illustrations"
QUOTA_WAIT_SECONDS = 600
MANIFEST = ROOT / "apps" / "web" / "src" / "assets" / "image-manifest.json"


def generate(client: Client, prompt: str, seed: int, target: Path) -> None:
    result = client.predict(
        prompt=prompt,
        seed=seed,
        randomize_seed=False,
        width=1024,
        height=576,
        num_inference_steps=4,
        api_name="/infer",
    )
    shutil.copy(result[0], target)


def update_manifest(ids: list[str]) -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    for scene_id in ids:
        if (OUT_DIR / f"{scene_id}.webp").exists():
            manifest[scene_id] = f"/illustrations/{scene_id}.webp"
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main() -> None:
    args = sys.argv[1:]
    force = "--force" in args
    config = json.loads(PROMPTS.read_text(encoding="utf-8"))
    selected = [a for a in args if not a.startswith("--")] or list(config["scenes"])
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    client = Client("black-forest-labs/FLUX.1-schnell")

    for scene_id in selected:
        target = OUT_DIR / f"{scene_id}.webp"
        if target.exists() and not force:
            continue
        prompt = f"{config['style']}. {config['scenes'][scene_id]}"
        seed = zlib.crc32(scene_id.encode()) % 1_000_000
        while True:
            try:
                generate(client, prompt, seed, target)
                print("ok", scene_id, flush=True)
                break
            except Exception as error:
                if "quota" not in str(error):
                    print("fail", scene_id, str(error)[:200], flush=True)
                    break
                print("quota wait", scene_id, flush=True)
                time.sleep(QUOTA_WAIT_SECONDS)

    update_manifest(list(config["scenes"]))


if __name__ == "__main__":
    main()
