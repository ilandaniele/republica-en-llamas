export type EntitlementId =
  | 'presidents_pack'
  | 'opposition_pack'
  | 'mode_crisis_express'
  | 'mode_historical'
  | 'remove_ads'
  | 'full_access';

export interface EntitlementProduct {
  id: EntitlementId;
  label: string;
  description: string;
  price: number;
  priceLabel: string;
  stripePriceId: string;
  rcIdentifier: string;
  unlocks: string[];
}

export const ENTITLEMENT_PRODUCTS: Record<EntitlementId, EntitlementProduct> = {
  presidents_pack: {
    id: 'presidents_pack',
    label: 'Pack Presidentes',
    description: 'Juga como Sergio Massa o Patricia Bullrich',
    price: 2.99,
    priceLabel: '$2.99',
    stripePriceId: 'price_1TAaidPF04vzkOdostTuqofY',
    rcIdentifier: 'presidents_pack',
    unlocks: ['populista', 'tecnocrata'],
  },
  opposition_pack: {
    id: 'opposition_pack',
    label: 'Pack Oposicion',
    description: 'Kirchner y Kicillof como personajes secundarios desbloqueados',
    price: 1.99,
    priceLabel: '$1.99',
    stripePriceId: 'price_1TAaiePF04vzkOdov9PYjTPH',
    rcIdentifier: 'opposition_pack',
    unlocks: ['kirchner', 'kicillof'],
  },
  mode_crisis_express: {
    id: 'mode_crisis_express',
    label: 'Crisis Express',
    description: '45 segundos por turno, danio x1.5, puntaje x2',
    price: 1.99,
    priceLabel: '$1.99',
    stripePriceId: 'price_1TAaifPF04vzkOdobJK1JkzZ',
    rcIdentifier: 'mode_crisis_express',
    unlocks: ['crisis_express'],
  },
  mode_historical: {
    id: 'mode_historical',
    label: 'Escenarios Historicos',
    description: '2001, Hiperinflacion 89, Kirchnerismo. Revivite la historia.',
    price: 1.99,
    priceLabel: '$1.99',
    stripePriceId: 'price_1TAaigPF04vzkOdoScRGh38p',
    rcIdentifier: 'mode_historical',
    unlocks: ['historical'],
  },
  remove_ads: {
    id: 'remove_ads',
    label: 'Sin Publicidad',
    description: 'Nunca mas un anuncio. Para siempre.',
    price: 2.99,
    priceLabel: '$2.99',
    stripePriceId: 'price_1TAaitPF04vzkOdoRGSvTlO1',
    rcIdentifier: 'remove_ads',
    unlocks: ['no_ads'],
  },
  full_access: {
    id: 'full_access',
    label: 'Acceso Total',
    description: 'Todo incluido: presidentes, modos, sin ads. El precio mas conveniente.',
    price: 5.99,
    priceLabel: '$5.99',
    stripePriceId: 'price_1TAaiuPF04vzkOdowvUxpkCL',
    rcIdentifier: 'full_access',
    unlocks: ['populista', 'tecnocrata', 'kirchner', 'kicillof', 'crisis_express', 'historical', 'no_ads'],
  },
};

export const FREE_TIER = {
  presidents: ['ingeniero'] as string[],
  modes: ['normal', 'easy', 'hard'] as string[],
  maxRunsPerDay: 3,
} as const;

export function isFree(featureId: string): boolean {
  return FREE_TIER.presidents.includes(featureId) || FREE_TIER.modes.includes(featureId);
}

export function entitlementsForFeature(featureId: string): EntitlementId[] {
  return (Object.values(ENTITLEMENT_PRODUCTS) as EntitlementProduct[])
    .filter((p) => p.unlocks.includes(featureId))
    .map((p) => p.id);
}
