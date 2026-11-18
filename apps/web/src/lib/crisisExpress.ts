const CRISIS_SECONDS = 45;
const EXTENDED_CRISIS_SECONDS = 90;

export function crisisSecondsPerTurn(extendedTime: boolean): number {
  return extendedTime ? EXTENDED_CRISIS_SECONDS : CRISIS_SECONDS;
}
