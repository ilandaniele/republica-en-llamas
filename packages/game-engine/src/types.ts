// ─── Core game types ────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'normal' | 'hard' | 'crisis';

export type ScenarioId =
  | 'hiperinflacion_1989'
  | 'corralito_2001'
  | 'convertibilidad'
  | 'rodrigazo_1975'
  | 'malvinas_1982'
  | 'kirchnerismo_boom'
  | 'libertad_avanza_2023'
  | 'guerra_ucrania_2022'
  | 'conflicto_iran_2024';

/** One phase in a scenario's narrative arc. Cards whose category matches
 *  weightedCategories receive a 3× draw-weight bonus during this phase. */
export interface ScenarioArcPhase {
  maxTurn: number;
  weightedCategories: CardCategory[];
}

export interface ScenarioCalendar {
  startMonth: number;    // 1-12
  startYear: number;
  turnsPerMonth: number; // how many game turns equal one calendar month
}

export interface HistoricalScenarioConfig {
  labelKey: string;
  periodKey: string;
  descriptionKey: string;
  entitlementRequired: 'mode_historical' | 'full_access';
  // Starting stat overrides (merged over difficulty preset)
  popularity: number;
  socialStability: number;
  mediaCredibility: number;
  inflation: number;
  publicDeficit: number;
  marketConfidence: number;
  currencyStrength: number;
  foreignReserves: number;
  gdpGrowth: number;
  governmentSeats: number;
  oppositionSeats: number;
}

export type Language = 'es' | 'en';

export type CardCategory = 'political' | 'economic' | 'social' | 'international' | 'crisis';

export type NegotiationType =
  | 'POLITICAL_DEAL'
  | 'BUDGET_CONCESSION'
  | 'EMERGENCY_DECREE'
  | 'COALITION_BUILDING';

export type CrisisType =
  | 'debtCrisis'
  | 'hyperinflationSpiral'
  | 'socialUnrest'
  | 'legislativeRebellion'
  | 'impeachmentAttempt';

export type GameOverReason =
  | 'hyperinflation'
  | 'popularityCollapse'
  | 'socialCollapse'
  | 'bankrupt'
  | 'impeachment'
  | 'term_complete'
  | 'election_loss'
  | 'deflation_spiral'
  | 'nuclear_annihilation'
  | 'military_defeat';

export interface PoliticalVars {
  popularity: number;           // 0-100
  socialStability: number;      // 0-100
  mediaCredibility: number;     // 0-100
  emergencyDecreesUsed: number; // 0+
  popularityLowStreak: number;  // consecutive turns below 5
}

export interface EconomicVars {
  inflation: number;            // -20 to 200 (negative = deflation)
  publicDeficit: number;        // 0-100 (% of GDP)
  marketConfidence: number;     // 0-100
  currencyStrength: number;     // 0-100
  foreignReserves: number;      // 0-100
  gdpGrowth: number;            // -10 to +10
}

export interface CongressState {
  governmentSeats: number;      // 0-538
  oppositionSeats: number;      // 0-538
  independentSeats: number;     // 0-538
  coalitionTurnsRemaining: number; // 0+
  independentSupportBonus: number; // 0-100%
  lawsPassedThisRun: number;    // 0+
  pendingVote: PendingVote | null;
}

export interface PendingVote {
  lawId: string;
  lawTitle: string;
  requiredSupport: number;      // % needed to pass
  turnsRemaining: number;
}

export interface MediaState {
  currentHeadline: string;
  sentiment: number;            // -100 (hostile) to +100 (supportive)
  activeSpins: SpinEffect[];
}

export interface SpinEffect {
  id: string;
  turnsRemaining: number;
  popularityMod: number;
  stabilityMod: number;
  credibilityMod: number;
}

export interface Crisis {
  type: CrisisType;
  startTurn: number;
  turnsActive: number;
  turnsToResolve: number;       // turns before game over if unresolved
  resolved: boolean;
}

export interface Shock {
  id: string;
  name: string;
  turnsRemaining: number;
  inflationMod: number;
  marketConfidenceMod: number;
  deficitMod: number;
  popularityMod: number;
}

export interface ChoiceEffect {
  popularityDelta?: number;
  stabilityDelta?: number;
  mediaCredibilityDelta?: number;
  inflationDelta?: number;
  deficitDelta?: number;
  marketConfidenceDelta?: number;
  currencyStrengthDelta?: number;
  foreignReservesDelta?: number;
  gdpGrowthDelta?: number;
  governmentSeatsDelta?: number;
  lawsPassedDelta?: number;
  emergencyDecreeDelta?: number;
}

export interface Choice {
  id: string;
  textKey: string;             // i18n key
  effects: ChoiceEffect;
  requiresVote?: boolean;
  voteChance?: number;          // 0-1, probability of passing without negotiation
  instantGameOver?: GameOverReason; // triggers immediate game over instead of normal effect
}

export interface EventCard {
  id: string;
  category: CardCategory;
  titleKey: string;
  bodyKey: string;
  choices: Choice[];
  weight: number;               // draw weight (higher = more frequent)
  minTurn?: number;             // earliest turn this can appear
  maxTurn?: number;             // latest turn this can appear
  requiredCrisis?: CrisisType;  // only draw if this crisis is active
  minDifficulty?: Difficulty;   // minimum difficulty to appear
  // Character / memory fields
  characterId?: string;         // which recurring character this card belongs to
  memoryFlagAdded?: string;     // flag added to character when this card is drawn
  requiredFlags?: string[];     // only draw if character has ALL these flags
  forbiddenFlags?: string[];    // skip if character has ANY of these flags
  // Lifeline fields
  isLifeline?: boolean;         // priority draw when variables in red zone
  lifelineFor?: string[];       // variable names this card helps recover
  // Congressional session
  isLaw?: boolean;              // triggers congressional minigame instead of normal choice UI
  /** When true, this event originates from external forces (foreign wars, pandemics, IMF pressure).
   *  Its draw weight is NOT adjusted by the state-aware category multiplier — it can appear
   *  regardless of how well or badly the domestic game is going. */
  isExogenous?: boolean;
}

export interface TurnEvent {
  turn: number;
  cardId: string;
  choiceIndex: number;
  effectsApplied: ChoiceEffect;
  negotiationUsed?: NegotiationType;
  crisisTriggered?: CrisisType;
  crisisResolved?: CrisisType;
}

export type CharacterId = 'ministro' | 'sindicalista' | 'periodista' | 'embajador' | 'gobernadora';

export interface RecurringCharacter {
  id: CharacterId;
  name: string;
  role: string;
  avatar: string;       // emoji for MVP
  relationship: number; // -100 to +100
  memoryFlags: string[];
}

export interface GameState {
  id: string;
  seed: number;
  difficulty: Difficulty;
  activeScenario?: ScenarioId;
  turn: number;                 // 1-50
  language: Language;
  political: PoliticalVars;
  economic: EconomicVars;
  congress: CongressState;
  media: MediaState;
  activeCrises: Crisis[];
  activeShocks: Shock[];
  drawnCardIds: string[];       // for deduplication within a run
  history: TurnEvent[];
  isGameOver: boolean;
  gameOverReason: GameOverReason | null;
  score: number;
  currentMonth: number;         // 1-12
  currentYear: number;
  characters: RecurringCharacter[];
  lastInflationBreakdown?: InflationBreakdown;
  /** Maps cardId → turn it was last played; used for cooldown enforcement */
  cardCooldowns: Record<string, number>;
  /** Current phase index in the scenario's narrative arc (0 = start). */
  scenarioArcPhase: number;
  /** Consecutive turns with inflation below -10 (deflationary spiral tracker). */
  deflationStreakTurns: number;
  /** Consecutive turns with no metrics going red (popularity, stability, confidence, reserves up; inflation, deficit down). */
  positiveStreak: number;
  /** True after losing presidential election — enters survival/lame-duck mode. */
  lameDuckMode?: boolean;
  /** Turns remaining in lame-duck mode before election_loss game over. */
  lameDuckTurnsRemaining?: number;
}

export interface VoteResult {
  passed: boolean;
  governmentVotes: number;
  independentVotes: number;
  totalVotes: number;
  requiredVotes: number;
  bribeOccurred: boolean;
  bribedVotes: number;
  abstentionCount: number;
  defectionCount: number;
}

export interface NegotiationResult {
  success: boolean;
  newState: GameState;
  votePassed: boolean;
}

export interface GameOverResult {
  reason: GameOverReason;
  score: number;
  turn: number;
  isWin: boolean;
}

export interface InflationBreakdown {
  deficitPressure: number;
  marketDistrust: number;
  currencyWeakness: number;
  shockEffect: number;
  naturalDecay: number;
  accelerationEffect: number;
  previousInflation: number;
  newInflation: number;
  delta: number;
}

export interface DifficultyPreset {
  label: string;
  flavorKey: string;
  popularity: number;
  socialStability: number;
  mediaCredibility: number;
  inflation: number;
  publicDeficit: number;
  marketConfidence: number;
  currencyStrength: number;
  foreignReserves: number;
  gdpGrowth: number;
  governmentSeats: number;
  oppositionSeats: number;
  independentSeats: number;
}
