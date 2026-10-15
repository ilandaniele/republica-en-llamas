import type { GameOverReason, GameState } from '@republica/game-engine';

export const HEADLINES: Record<string, string> = {
  hyperinflation: 'LA HIPERINFLACIÓN DERRUMBA LA REPÚBLICA',
  popularityCollapse: 'EL PUEBLO ABANDONA AL PRESIDENTE',
  socialCollapse: 'COLAPSO TOTAL: LA REPÚBLICA EN ANARQUÍA',
  bankrupt: 'BANCARROTA SOBERANA: SIN RESERVAS',
  impeachment: 'EL CONGRESO DESTITUYE AL PRESIDENTE',
  election_loss: 'DERROTA ELECTORAL: EL PUEBLO HA DECIDIDO',
  term_complete: '¡MANDATO CUMPLIDO! LA REPÚBLICA SOBREVIVE',
  nuclear_annihilation: 'ANIQUILACIÓN NUCLEAR — LA REPÚBLICA ES CENIZA',
  military_defeat: 'DERROTA MILITAR — LAS MALVINAS SIGUEN SIENDO MALVINENSES',
};

export const SUB_HEADLINES: Record<string, string> = {
  hyperinflation:
    'El precio del pan supera los ingresos mensuales. La gente llena carretillas con billetes inútiles.',
  popularityCollapse: 'Sin apoyo ciudadano, el gobierno pierde toda legitimidad democrática.',
  socialCollapse: 'El orden institucional se disuelve. La anarquía reemplaza al estado.',
  bankrupt: 'Sin divisas ni crédito, el país no puede importar ni pagar deudas.',
  impeachment: 'El Congreso ejerció su poder constitucional. Un capítulo oscuro cierra.',
  election_loss: 'Las urnas hablaron. La oposición festeja. El mandato termina sin renovarse.',
  term_complete: 'Contra todo pronóstico, la república sobrevivió. La historia te recordará.',
  nuclear_annihilation:
    'Buenos Aires fue borrada del mapa. Tu decisión de ignorar el ultimatum nuclear costó millones de vidas.',
  military_defeat:
    'La flota fue hundida. Los marines británicos ondean la Union Jack sobre Port Stanley. El sueño soberano tendrá que esperar.',
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Fácil',
  normal: 'Normal',
  hard: 'Difícil',
  crisis: 'Crisis',
};

const PRESIDENT_NAMES: Record<string, string> = {
  ingeniero: 'Javier Milei',
  populista: 'Sergio Massa',
  tecnocrata: 'Patricia Bullrich',
  izquierda: 'Myriam Bregman',
  federal: 'Juan Schiaretti',
  corporativo: 'Horacio Larreta',
};

const REASON_LABELS: Record<string, string> = {
  hyperinflation: 'hiperinflación',
  popularityCollapse: 'impopularidad',
  socialCollapse: 'colapso social',
  bankrupt: 'bancarrota',
  impeachment: 'juicio político',
  election_loss: 'derrota electoral',
  term_complete: 'mandato completo',
  nuclear_annihilation: 'aniquilación nuclear',
  military_defeat: 'derrota militar',
};

export interface Medal {
  icon: string;
  label: string;
}

export function getRunMedals(gs: GameState, isCrisisExpress: boolean): Medal[] {
  const medals: Medal[] = [];
  const isWin = gs.gameOverReason === 'term_complete';
  if (gs.turn >= 20) medals.push({ icon: '🏆', label: 'Superviviente' });
  if (gs.economic.inflation < 30) medals.push({ icon: '💰', label: 'Economista' });
  if (gs.political.popularity >= 70) medals.push({ icon: '👑', label: 'Popular' });
  if (isCrisisExpress && isWin) medals.push({ icon: '⚡', label: 'Crisis Express' });
  if (!isWin && gs.turn >= 15) medals.push({ icon: '💀', label: 'Resistencia' });
  return medals;
}

export function buildViralText(
  gameState: GameState,
  reason: GameOverReason,
  presidentId: string,
  anibalLine: string,
): string {
  const presidentName = PRESIDENT_NAMES[presidentId] ?? 'El Presidente';
  const reasonLabel = REASON_LABELS[reason] ?? reason;
  return [
    `Bajo el gobierno de ${presidentName}, Argentina sobrevivió ${gameState.turn} turnos antes de colapsar por ${reasonLabel}.`,
    `La inflación llegó al ${Math.round(gameState.economic.inflation)}%.`,
    anibalLine ? `El Gordo Aníbal lo resumió mejor: "${anibalLine}"` : '',
    `\nPuntaje: ${gameState.score.toLocaleString()} | Dificultad: ${gameState.difficulty}`,
    `\n¡Jugá República en Llamas!`,
  ]
    .filter(Boolean)
    .join(' ');
}
