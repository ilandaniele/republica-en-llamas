import type { ChoiceEffect } from '../types.js';

interface ExpansionAgenda {
  id: string;
  name: string;
  priority: readonly [es: string, en: string];
  action: readonly [es: string, en: string];
  tradeoff: ChoiceEffect;
}

export const EXPANSION_AGENDAS: ExpansionAgenda[] = [
  {
    id: 'kicillof',
    name: 'Axel Kicillof',
    priority: [
      'Tu gabinete propone coordinación federal, inversión pública y fortalecimiento de servicios con participación provincial.',
      'Your cabinet proposes federal coordination, public investment and stronger services with provincial participation.',
    ],
    action: ['Pactar inversión pública con las provincias', 'Agree public investment with provinces'],
    tradeoff: { stabilityDelta: 2, deficitDelta: 2 },
  },
  {
    id: 'grabois',
    name: 'Juan Grabois',
    priority: [
      'Tu gabinete prioriza tierra, vivienda y trabajo con cooperativas, control comunitario y aportes de grandes patrimonios.',
      'Your cabinet prioritizes land, housing and work through cooperatives, community oversight and contributions from large fortunes.',
    ],
    action: ['Financiar cooperativas con control comunitario', 'Fund cooperatives with community oversight'],
    tradeoff: { popularityDelta: 2, marketConfidenceDelta: -2 },
  },
  {
    id: 'milei',
    name: 'Milei',
    priority: [
      'Tu gabinete exige reducir intervención estatal y buscar financiamiento privado antes de comprometer partidas.',
      'Your cabinet demands less state intervention and private funding before committing budget allocations.',
    ],
    action: ['Impulsar con gestión privada y metas', 'Proceed with private management and targets'],
    tradeoff: { marketConfidenceDelta: 2, popularityDelta: -2 },
  },
  {
    id: 'massa',
    name: 'Massa',
    priority: [
      'Tu gabinete busca un acuerdo entre empresas, sindicatos y provincias para sostener ingresos y actividad.',
      'Your cabinet seeks an agreement among firms, unions and provinces to sustain incomes and activity.',
    ],
    action: ['Acordar aportes con todos los sectores', 'Agree contributions with all sectors'],
    tradeoff: { stabilityDelta: 2, deficitDelta: 2 },
  },
  {
    id: 'bullrich',
    name: 'Bullrich',
    priority: [
      'Tu gabinete pide un mando responsable, plazos exigibles y controles que permitan ejecutar el plan.',
      'Your cabinet seeks accountable leadership, enforceable deadlines and controls enabling implementation.',
    ],
    action: [
      'Ejecutar con mando y controles centralizados',
      'Implement with centralized leadership and oversight',
    ],
    tradeoff: { stabilityDelta: 2, mediaCredibilityDelta: -2 },
  },
  {
    id: 'bregman',
    name: 'Bregman',
    priority: [
      'Tu gabinete propone garantizar derechos con control de trabajadores y aportes extraordinarios de grandes patrimonios.',
      'Your cabinet proposes protecting rights through worker oversight and extraordinary contributions from large fortunes.',
    ],
    action: [
      'Financiar con grandes patrimonios y control social',
      'Fund through large fortunes and social oversight',
    ],
    tradeoff: { popularityDelta: 2, marketConfidenceDelta: -2 },
  },
  {
    id: 'schiaretti',
    name: 'Schiaretti',
    priority: [
      'Tu gabinete prioriza un convenio federal con ejecución provincial y recursos distribuidos por criterios públicos.',
      'Your cabinet prioritizes a federal agreement with provincial implementation and publicly defined funding criteria.',
    ],
    action: ['Acordar ejecución y aportes provinciales', 'Agree provincial implementation and contributions'],
    tradeoff: { governmentSeatsDelta: 2, deficitDelta: 2 },
  },
  {
    id: 'larreta',
    name: 'Larreta',
    priority: [
      'Tu gabinete propone una mesa de consenso con metas publicadas, evaluación técnica y avances graduales.',
      'Your cabinet proposes consensus talks with published targets, technical evaluation and gradual progress.',
    ],
    action: ['Pactar metas y evaluación entre sectores', 'Agree targets and evaluation across sectors'],
    tradeoff: { mediaCredibilityDelta: 2, deficitDelta: 2 },
  },
  {
    id: 'nestor',
    name: 'Néstor Kirchner',
    priority: [
      'Tu gabinete impulsa coordinación estatal con gobernadores y compromisos de empleo y producción nacional.',
      'Your cabinet promotes state coordination with governors and commitments to jobs and domestic production.',
    ],
    action: [
      'Coordinar inversión estatal y empleo nacional',
      'Coordinate state investment and domestic employment',
    ],
    tradeoff: { popularityDelta: 2, deficitDelta: 2 },
  },
  {
    id: 'cristina',
    name: 'Cristina Fernández de Kirchner',
    priority: [
      'Tu gabinete prioriza cobertura universal, proveedores nacionales y regulación de costos para sostener el consumo.',
      'Your cabinet prioritizes universal coverage, domestic suppliers and cost regulation to support consumption.',
    ],
    action: [
      'Ampliar cobertura con regulación y proveedores nacionales',
      'Expand coverage with regulation and domestic suppliers',
    ],
    tradeoff: { popularityDelta: 2, marketConfidenceDelta: -2 },
  },
  {
    id: 'macri',
    name: 'Macri',
    priority: [
      'Tu gabinete busca licitaciones competitivas y convenios de inversión con reglas estables para los proveedores.',
      'Your cabinet seeks competitive tenders and investment agreements with stable supplier rules.',
    ],
    action: ['Licitar con inversión y reglas estables', 'Tender with investment and stable rules'],
    tradeoff: { marketConfidenceDelta: 2, foreignReservesDelta: -2 },
  },
  {
    id: 'del_cano',
    name: 'Nicolás del Caño',
    priority: [
      'Tu gabinete plantea gestión pública bajo control de trabajadores y financiamiento con aportes de grandes empresas.',
      'Your cabinet proposes public management under worker oversight, funded by large-business contributions.',
    ],
    action: [
      'Aplicar gestión pública con control obrero',
      'Implement public management with worker oversight',
    ],
    tradeoff: { stabilityDelta: 2, marketConfidenceDelta: -2 },
  },
];
