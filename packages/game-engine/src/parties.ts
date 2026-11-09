export const PARTIES = {
  libertario: { label: 'La Libertad Avanza', agenda: 'Equilibrio fiscal y desregulación' },
  peronista: { label: 'Peronismo / kirchnerismo', agenda: 'Mercado interno, empleo y servicios públicos' },
  pro: { label: 'PRO', agenda: 'Inversión privada y apertura económica' },
  izquierda: { label: 'FIT-Unidad', agenda: 'Salarios, jornada laboral y control público' },
  federal: { label: 'Federalismo', agenda: 'Coparticipación e infraestructura provincial' },
} as const;

export type PartyId = keyof typeof PARTIES;

const PRESIDENT_PARTIES: Record<string, PartyId> = {
  ingeniero: 'libertario',
  milei: 'libertario',
  populista: 'peronista',
  massa: 'peronista',
  nestor: 'peronista',
  cristina: 'peronista',
  kicillof: 'peronista',
  grabois: 'peronista',
  macri: 'pro',
  tecnocrata: 'pro',
  bullrich: 'pro',
  corporativo: 'pro',
  larreta: 'pro',
  izquierda: 'izquierda',
  bregman: 'izquierda',
  del_cano: 'izquierda',
  federal: 'federal',
  schiaretti: 'federal',
};

export function partyForPresident(id?: string): PartyId | undefined {
  return id ? PRESIDENT_PARTIES[id] : undefined;
}
