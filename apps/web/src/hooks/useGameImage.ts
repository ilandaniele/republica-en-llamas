import manifest from '../assets/image-manifest.json';

type ManifestKey = keyof typeof manifest;

/**
 * Returns the public Supabase Storage URL for a game image ID.
 * Returns an empty string if the image has not been generated yet.
 *
 * Usage:
 *   const url = useGameImage('pol_congress');
 *   if (url) return <img src={url} />;
 */
export function useGameImage(id: string): string {
  return (manifest as Record<string, string>)[id] ?? '';
}

export type { ManifestKey };
