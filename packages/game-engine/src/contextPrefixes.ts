import type { CardCategory } from './types.js';

const CONTEXT_PREFIXES: Record<CardCategory, string[]> = {
  political: [
    'En el frente político...',
    'Mientras el Congreso debate...',
    'El palacio de gobierno recibe otra visita...',
    'La interna partidaria se agita...',
    'Los pasillos del poder se mueven...',
  ],
  economic: [
    'En el mercado financiero...',
    'Mientras la economía tiembla...',
    'El banco central sigue las noticias...',
    'Los mercados reaccionan...',
    'Los empresarios se inquietan...',
  ],
  social: [
    'En la calle, la gente habla...',
    'La opinión pública se agita...',
    'Desde los barrios llega otra señal...',
    'La sociedad civil se moviliza...',
    'Las redes explotan con una nueva noticia...',
  ],
  international: [
    'En el plano internacional...',
    'El mundo no deja de mirar...',
    'Llega una señal desde el exterior...',
    'La diplomacia entra en acción...',
    'Desde afuera, presionan...',
  ],
  crisis: [
    '¡ALERTA! La situación escaló...',
    'La crisis se profundiza...',
    '⚠ Urgente desde el frente...',
    'La situación de emergencia avanza...',
    '¡Sin tiempo que perder!',
  ],
};

export function getContextPrefix(prevCategory: CardCategory | null, nextCategory: CardCategory): string | null {
  if (!prevCategory || prevCategory === nextCategory) return null;
  const prefixes = CONTEXT_PREFIXES[nextCategory];
  if (!prefixes || prefixes.length === 0) return null;
  const idx = Math.floor(Math.random() * prefixes.length);
  return prefixes[idx] ?? null;
}
