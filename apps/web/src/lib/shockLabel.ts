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
  return SHOCK_NAMES_ES[name] ?? name.replace('shock.', '').toUpperCase();
}
