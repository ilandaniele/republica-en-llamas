import { i18n } from './i18n.js';

const SHOCK_NAMES_ES: Record<string, string> = {
  'shock.oilPriceSpike': 'SUBA DEL PETRÓLEO',
  'shock.globalRecession': 'RECESIÓN GLOBAL',
  'shock.currencyAttack': 'ATAQUE A LA MONEDA',
  'shock.tradeWar': 'GUERRA COMERCIAL',
  'shock.pandemic': 'PANDEMIA',
  'shock.naturalDisaster': 'DESASTRE NATURAL',
  'shock.techBoom': 'BOOM TECNOLÓGICO',
  'shock.foreignInvestment': 'INVERSIÓN EXTRANJERA',
};

export function shockLabel(name: string): string {
  const known = SHOCK_NAMES_ES[name];
  if (known) return known;
  return (i18n.exists(name) ? i18n.t(name) : name.replace('shock.', '')).toUpperCase();
}
