import { CONGRESS_ACTIONS } from '@republica/game-engine';
import type { CongressActionId, SwingLegislatorId } from '@republica/game-engine';

export type Phase = 'negotiation' | 'voting' | 'swing' | 'result';
export type VoteStatus = 'pending' | 'yes' | 'no' | 'abstain';
export type SeatBloc = 'hardOpposition' | 'proOpposition' | 'independent' | 'government';

export interface Seat {
  x: number;
  y: number;
  bloc: SeatBloc;
  index: number;
}

export interface SwingSen {
  id: SwingLegislatorId;
  name: string;
  province: string;
  bloc: string;
  demand: string;
  costLabel: string;
}

export interface NegActionText {
  id: CongressActionId;
  icon: string;
  label: string;
  preview: string;
  costLabel: string;
}

export const VISUAL_SEATS = 257;
export const ROW_COUNTS = [14, 20, 26, 32, 38, 44, 50, 33];
export const ROW_RADII = [80, 110, 140, 170, 200, 230, 260, 285];
export const CX = 300,
  CY = 320;

export const BLOC_COLORS: Record<SeatBloc, string> = {
  government: '#9C27B0',
  hardOpposition: '#1565C0',
  proOpposition: '#FFD600',
  independent: '#78909C',
};
export const VOTE_COLORS: Record<VoteStatus, string | null> = {
  pending: null,
  yes: '#43A047',
  no: '#E53935',
  abstain: '#FFA726',
};

export function seatColor(seat: Seat, vote: VoteStatus): string {
  return VOTE_COLORS[vote] ?? BLOC_COLORS[seat.bloc];
}

export const SWING_POOL: SwingSen[] = [
  {
    id: 'urquiza',
    name: 'Sen. Roberto Urquiza',
    province: 'Chaco',
    bloc: 'Interbloque Federal',
    demand: '"Presidente, necesito que me garantice la obra del puente sobre el río Bermejo."',
    costLabel: '+2% déficit',
  },
  {
    id: 'ferreyra',
    name: 'Dip. Graciela Ferreyra',
    province: 'Salta',
    bloc: 'Movimiento Popular',
    demand: '"El sector minero salteño necesita ese subsidio. Sin él, no puedo acompañar."',
    costLabel: '+2% déficit, −3 popularidad',
  },
  {
    id: 'dominguez',
    name: 'Sen. Carlos Domínguez',
    province: 'Entre Ríos',
    bloc: 'Federal Productivo',
    demand: '"El campo entrerriano no aguanta más retenciones. Necesito una garantía escrita."',
    costLabel: '+3% déficit',
  },
  {
    id: 'paz',
    name: 'Dip. Valeria Paz',
    province: 'Neuquén',
    bloc: 'MPN',
    demand: '"Las regalías petroleras de Neuquén tienen que actualizarse urgente."',
    costLabel: '−4 reservas',
  },
  {
    id: 'villegas',
    name: 'Sen. Matías Villegas',
    province: 'Tucumán',
    bloc: 'PJ Federal',
    demand: '"El fondo universitario de Tucumán tiene que estar garantizado en el texto."',
    costLabel: '+2% déficit, +5 popularidad',
  },
  {
    id: 'rios',
    name: 'Dip. Adriana Ríos',
    province: 'Corrientes',
    bloc: 'Encuentro Liberal',
    demand: '"La obra hídrica del Iberá no puede esperar. Es lo único que le pido."',
    costLabel: '+2% déficit',
  },
  {
    id: 'medina',
    name: 'Sen. Jorge Medina',
    province: 'San Juan',
    bloc: 'Productivos del Centro',
    demand: '"Los beneficios al litio son innegociables para San Juan. Sin eso, no."',
    costLabel: '+5 mercados, +1% déficit',
  },
  {
    id: 'torres',
    name: 'Dip. Claudia Torres',
    province: 'Tierra del Fuego',
    bloc: 'Fuerza Fueguina',
    demand: '"La zona franca fueguina es lo único que sostenemos. Extiéndala."',
    costLabel: '+3% déficit',
  },
  {
    id: 'blanco',
    name: 'Sen. Ricardo Blanco',
    province: 'La Rioja',
    bloc: 'PJ Riojano',
    demand: '"La ruta 40 cruza mi provincia. Sin plata para obras, no tengo cómo justificar mi voto."',
    costLabel: '+2% déficit',
  },
  {
    id: 'caceres',
    name: 'Dip. Marta Cáceres',
    province: 'Misiones',
    bloc: 'Renovación Misionera',
    demand: '"El turismo de Misiones necesita fondos ahora. Las Cataratas no pueden esperar."',
    costLabel: '+1% déficit, +3 popularidad',
  },
];

const NEG_ACTION_TEXT: NegActionText[] = [
  {
    id: 'radical',
    icon: '📞',
    label: 'Llamar al bloque radical',
    preview: 'Convocás a los radicales disidentes. Suman votos pero hay costos políticos.',
    costLabel: '−5 popularidad',
  },
  {
    id: 'presupuesto',
    icon: '💰',
    label: 'Ofrecer partida presupuestaria',
    preview: 'Comprás votos con fondos públicos. Efectivo pero costoso.',
    costLabel: '+3% déficit',
  },
  {
    id: 'cadena',
    icon: '📺',
    label: 'Cadena nacional',
    preview: 'Presión mediática sobre legisladores indecisos. Rinde menos de lo esperado.',
    costLabel: '−8 credibilidad mediática',
  },
  {
    id: 'gobernadores',
    icon: '🤝',
    label: 'Negociar con gobernadores',
    preview: 'Alianza territorial a cambio de obra pública. Moderado pero real.',
    costLabel: '−2 reservas, −3 popularidad',
  },
  {
    id: 'decreto',
    icon: '⚡',
    label: 'Amenazar con decreto',
    preview: 'Saltás el Congreso. La ley pasa pero la oposición y la prensa te destruyen.',
    costLabel: '+15 inestabilidad, −12 credibilidad',
  },
];

export const NEG_ACTIONS = NEG_ACTION_TEXT.map((text) => ({ ...text, ...CONGRESS_ACTIONS[text.id] }));
