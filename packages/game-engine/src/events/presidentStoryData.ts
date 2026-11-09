import type { CardCategory, ChoiceEffect } from '../types.js';

interface StoryProfile {
  category: CardCategory;
  scene: 'office' | 'congress' | 'press' | 'diplomacy' | 'crisis';
  cost: string;
  costEn: string;
  effects: ChoiceEffect[];
  follow: string[];
  options: string[];
  followEffects: ChoiceEffect[];
}

export const STORY_PROFILES = {
  fiscal: {
    category: 'economic',
    scene: 'office',
    cost: 'El Tesoro exige una fuente de financiamiento.',
    costEn: 'Treasury demands a funding plan.',
    effects: [
      {
        deficitDelta: -8,
        popularityDelta: -7,
        marketConfidenceDelta: 5,
      },
      {
        deficitDelta: -3,
        stabilityDelta: 3,
        popularityDelta: -2,
      },
      {
        popularityDelta: 5,
        deficitDelta: 6,
      },
    ],
    follow: [
      'Las provincias reclaman compensaciones por la implementación.',
      'Provinces request compensation for implementation.',
    ],
    options: [
      'Compensar con partidas focalizadas',
      'Compensate with targeted funding',
      'Renegociar plazos y objetivos',
      'Renegotiate deadlines and targets',
      'Mantener el cronograma original',
      'Keep the original timetable',
    ],
    followEffects: [
      {
        deficitDelta: 5,
        stabilityDelta: 6,
      },
      {
        mediaCredibilityDelta: 4,
        marketConfidenceDelta: -3,
      },
      {
        deficitDelta: -5,
        popularityDelta: -6,
      },
    ],
  },
  investment: {
    category: 'economic',
    scene: 'office',
    cost: 'Empresas y trabajadores piden garantías sobre los recursos.',
    costEn: 'Businesses and workers request funding guarantees.',
    effects: [
      {
        gdpGrowthDelta: 1,
        deficitDelta: 7,
        popularityDelta: 5,
      },
      {
        marketConfidenceDelta: 4,
        deficitDelta: 3,
      },
      {
        deficitDelta: -4,
        popularityDelta: -5,
      },
    ],
    follow: [
      'Los proveedores piden revisar contratos y costos.',
      'Suppliers request revised contracts and costs.',
    ],
    options: [
      'Pagar contra avances auditados',
      'Pay against audited progress',
      'Reducir el alcance del proyecto',
      'Reduce the project scope',
      'Congelar contratos y revisar',
      'Freeze and review contracts',
    ],
    followEffects: [
      {
        deficitDelta: 5,
        gdpGrowthDelta: 1,
        mediaCredibilityDelta: 4,
      },
      {
        deficitDelta: -3,
        popularityDelta: -4,
      },
      {
        mediaCredibilityDelta: 6,
        gdpGrowthDelta: -1,
      },
    ],
  },
  regulation: {
    category: 'economic',
    scene: 'congress',
    cost: 'Los sectores afectados reclaman una transición.',
    costEn: 'Affected sectors demand a transition.',
    effects: [
      {
        marketConfidenceDelta: 7,
        stabilityDelta: -7,
      },
      {
        stabilityDelta: 4,
        marketConfidenceDelta: 2,
        deficitDelta: 2,
      },
      {
        stabilityDelta: 5,
        marketConfidenceDelta: -5,
      },
    ],
    follow: [
      'Las primeras inspecciones detectan diferencias entre sectores.',
      'Initial inspections reveal uneven results across sectors.',
    ],
    options: [
      'Reforzar inspecciones y sanciones',
      'Strengthen inspections and penalties',
      'Abrir una mesa de revisión',
      'Open a review panel',
      'Dar más tiempo de adaptación',
      'Extend the adjustment period',
    ],
    followEffects: [
      {
        mediaCredibilityDelta: 6,
        deficitDelta: 4,
        marketConfidenceDelta: -3,
      },
      {
        stabilityDelta: 5,
        mediaCredibilityDelta: 3,
        deficitDelta: 2,
      },
      {
        marketConfidenceDelta: 4,
        popularityDelta: -5,
      },
    ],
  },
  social: {
    category: 'social',
    scene: 'office',
    cost: 'La demanda supera el presupuesto disponible.',
    costEn: 'Demand exceeds the available budget.',
    effects: [
      {
        popularityDelta: 8,
        stabilityDelta: 4,
        deficitDelta: 8,
      },
      {
        popularityDelta: 4,
        deficitDelta: 3,
      },
      {
        deficitDelta: -4,
        popularityDelta: -6,
      },
    ],
    follow: [
      'Las organizaciones piden ampliar la cobertura del programa.',
      'Community organizations request broader program coverage.',
    ],
    options: [
      'Ampliar cobertura con controles',
      'Expand coverage with oversight',
      'Priorizar hogares más vulnerables',
      'Prioritize the most vulnerable households',
      'Mantener el cupo inicial',
      'Keep the initial quota',
    ],
    followEffects: [
      {
        popularityDelta: 6,
        deficitDelta: 6,
      },
      {
        stabilityDelta: 5,
        mediaCredibilityDelta: 3,
        deficitDelta: 2,
      },
      {
        deficitDelta: -3,
        popularityDelta: -5,
      },
    ],
  },
  labor: {
    category: 'social',
    scene: 'congress',
    cost: 'Sindicatos y empleadores discuten el costo del cambio.',
    costEn: 'Unions and employers dispute adjustment costs.',
    effects: [
      {
        popularityDelta: 7,
        stabilityDelta: 5,
        marketConfidenceDelta: -7,
      },
      {
        stabilityDelta: 5,
        deficitDelta: 3,
      },
      {
        marketConfidenceDelta: 5,
        popularityDelta: -6,
      },
    ],
    follow: [
      'Una rama productiva pide una excepción al acuerdo.',
      'One industry requests an exemption from the agreement.',
    ],
    options: [
      'Exigir cumplimiento y fiscalizar',
      'Enforce and inspect compliance',
      'Negociar una transición sectorial',
      'Negotiate a sector transition',
      'Aceptar excepciones temporales',
      'Accept temporary exemptions',
    ],
    followEffects: [
      {
        popularityDelta: 5,
        marketConfidenceDelta: -5,
        deficitDelta: 3,
      },
      {
        stabilityDelta: 5,
        mediaCredibilityDelta: 3,
      },
      {
        marketConfidenceDelta: 5,
        popularityDelta: -6,
      },
    ],
  },
  security: {
    category: 'political',
    scene: 'press',
    cost: 'Vecinos y organismos civiles reclaman controles públicos.',
    costEn: 'Residents and civic groups request public oversight.',
    effects: [
      {
        stabilityDelta: 6,
        deficitDelta: 6,
        mediaCredibilityDelta: -3,
      },
      {
        mediaCredibilityDelta: 5,
        stabilityDelta: 3,
        deficitDelta: 3,
      },
      {
        deficitDelta: -4,
        stabilityDelta: -5,
      },
    ],
    follow: [
      'Una auditoría cuestiona procedimientos de implementación.',
      'An audit questions implementation procedures.',
    ],
    options: [
      'Publicar la auditoría y corregir',
      'Publish the audit and correct procedures',
      'Revisar protocolos con organizaciones civiles',
      'Review protocols with civic groups',
      'Suspender el despliegue para evaluar',
      'Suspend deployment for evaluation',
    ],
    followEffects: [
      {
        mediaCredibilityDelta: 7,
        deficitDelta: 3,
      },
      {
        stabilityDelta: 5,
        mediaCredibilityDelta: 4,
        deficitDelta: 2,
      },
      {
        deficitDelta: -3,
        stabilityDelta: -4,
        mediaCredibilityDelta: 3,
      },
    ],
  },
  coalition: {
    category: 'political',
    scene: 'congress',
    cost: 'Los aliados condicionan su apoyo a concesiones concretas.',
    costEn: 'Allies make support conditional on concrete concessions.',
    effects: [
      {
        governmentSeatsDelta: 6,
        deficitDelta: 6,
      },
      {
        governmentSeatsDelta: 3,
        mediaCredibilityDelta: 4,
        popularityDelta: -3,
      },
      {
        deficitDelta: -4,
        governmentSeatsDelta: -5,
      },
    ],
    follow: [
      'Los aliados quieren que el acuerdo también llegue a sus distritos.',
      'Allies want the agreement extended to their districts.',
    ],
    options: [
      'Repartir fondos con criterios públicos',
      'Distribute funding using public criteria',
      'Ofrecer apoyo legislativo recíproco',
      'Offer reciprocal legislative support',
      'Rechazar nuevas concesiones',
      'Reject further concessions',
    ],
    followEffects: [
      {
        governmentSeatsDelta: 4,
        deficitDelta: 5,
      },
      {
        governmentSeatsDelta: 3,
        mediaCredibilityDelta: 3,
        popularityDelta: -3,
      },
      {
        deficitDelta: -4,
        governmentSeatsDelta: -5,
      },
    ],
  },
  diplomacy: {
    category: 'international',
    scene: 'diplomacy',
    cost: 'La contraparte pide compromisos verificables.',
    costEn: 'The counterpart requests verifiable commitments.',
    effects: [
      {
        foreignReservesDelta: 7,
        marketConfidenceDelta: 4,
        mediaCredibilityDelta: -5,
      },
      {
        foreignReservesDelta: 3,
        mediaCredibilityDelta: 4,
        deficitDelta: 3,
      },
      {
        mediaCredibilityDelta: 5,
        foreignReservesDelta: -5,
      },
    ],
    follow: [
      'La contraparte solicita una revisión de las condiciones pactadas.',
      'The counterpart requests revised agreement terms.',
    ],
    options: [
      'Cumplir con monitoreo público',
      'Comply under public monitoring',
      'Renegociar condiciones y plazos',
      'Renegotiate terms and deadlines',
      'Suspender los desembolsos pendientes',
      'Suspend pending disbursements',
    ],
    followEffects: [
      {
        foreignReservesDelta: 6,
        popularityDelta: -5,
      },
      {
        mediaCredibilityDelta: 4,
        foreignReservesDelta: 2,
        deficitDelta: 3,
      },
      {
        mediaCredibilityDelta: 5,
        foreignReservesDelta: -6,
      },
    ],
  },
  transparency: {
    category: 'political',
    scene: 'press',
    cost: 'El gabinete debate cuánto poder ceder al control externo.',
    costEn: 'The cabinet debates how much authority to give independent oversight.',
    effects: [
      {
        mediaCredibilityDelta: 8,
        deficitDelta: 4,
        governmentSeatsDelta: -3,
      },
      {
        mediaCredibilityDelta: 4,
        deficitDelta: 2,
      },
      {
        deficitDelta: -3,
        mediaCredibilityDelta: -6,
      },
    ],
    follow: [
      'El organismo de control reclama acceso a más documentación.',
      'The oversight body requests access to additional documents.',
    ],
    options: [
      'Abrir expedientes y publicar datos',
      'Open records and publish data',
      'Habilitar acceso con supervisión judicial',
      'Allow access under judicial oversight',
      'Limitar el alcance de la revisión',
      'Limit the review scope',
    ],
    followEffects: [
      {
        mediaCredibilityDelta: 8,
        governmentSeatsDelta: -4,
      },
      {
        mediaCredibilityDelta: 4,
        deficitDelta: 3,
      },
      {
        mediaCredibilityDelta: -7,
        governmentSeatsDelta: 3,
      },
    ],
  },
  science: {
    category: 'economic',
    scene: 'office',
    cost: 'Los equipos técnicos necesitan continuidad presupuestaria.',
    costEn: 'Technical teams require sustained funding.',
    effects: [
      {
        gdpGrowthDelta: 1,
        deficitDelta: 6,
        mediaCredibilityDelta: 5,
      },
      {
        mediaCredibilityDelta: 4,
        deficitDelta: 3,
      },
      {
        deficitDelta: -4,
        mediaCredibilityDelta: -5,
      },
    ],
    follow: [
      'Los equipos advierten que faltan especialistas para completar la etapa.',
      'Teams warn that specialist shortages threaten the next stage.',
    ],
    options: [
      'Financiar formación y nuevos equipos',
      'Fund training and new equipment',
      'Compartir recursos con universidades',
      'Share resources with universities',
      'Extender plazos sin ampliar fondos',
      'Extend deadlines without extra funding',
    ],
    followEffects: [
      {
        gdpGrowthDelta: 1,
        deficitDelta: 5,
      },
      {
        mediaCredibilityDelta: 5,
        deficitDelta: 3,
      },
      {
        deficitDelta: -3,
        mediaCredibilityDelta: -5,
      },
    ],
  },
} satisfies Record<string, StoryProfile>;

interface PresidentStory {
  effects?: ChoiceEffect[];
  id: string;
  president: string;
  profile: keyof typeof STORY_PROFILES;
  title: { es: string; en: string };
  proposal: { es: string; en: string };
  choices: { es: string[]; en: string[] };
}

// Fictional governing dilemmas, not claims about historical conduct or forecasts.
export const PRESIDENT_STORIES: PresidentStory[] = [
  {
    id: 'pres_milei_ministerios',
    president: 'milei',
    profile: 'fiscal',
    title: {
      es: 'EL MAPA DE MINISTERIOS',
      en: 'MINISTRY REORGANIZATION',
    },
    proposal: {
      es: 'fusionar ministerios y reducir cargos políticos',
      en: 'merge ministries and cut political appointments',
    },
    choices: {
      es: ['Fusionar estructuras ahora', 'Negociar una transición', 'Conservar las estructuras'],
      en: ['Merge structures now', 'Negotiate a transition', 'Keep existing structures'],
    },
  },
  {
    id: 'pres_milei_competencia',
    president: 'milei',
    profile: 'regulation',
    title: {
      es: 'ABRIR LA COMPETENCIA',
      en: 'OPENING COMPETITION',
    },
    proposal: {
      es: 'simplificar permisos para nuevos comercios',
      en: 'simplify permits for new businesses',
    },
    choices: {
      es: ['Eliminar permisos duplicados', 'Probar en sectores piloto', 'Mantener permisos actuales'],
      en: ['Remove duplicate permits', 'Pilot selected sectors', 'Keep current permits'],
    },
  },
  {
    id: 'pres_milei_moneda',
    president: 'milei',
    profile: 'diplomacy',
    title: {
      es: 'ACUERDO DE ESTABILIZACIÓN MONETARIA',
      en: 'MONETARY STABILIZATION DEAL',
    },
    proposal: {
      es: 'negociar respaldo externo para una transición monetaria',
      en: 'negotiate external backing for a monetary transition',
    },
    choices: {
      es: ['Aceptar el respaldo propuesto', 'Negociar garantías adicionales', 'Postergar la transición'],
      en: ['Accept proposed backing', 'Negotiate additional guarantees', 'Postpone the transition'],
    },
  },
  {
    id: 'pres_milei_concesiones',
    president: 'milei',
    profile: 'investment',
    title: {
      es: 'CONCESIONES BAJO LA LUPA',
      en: 'CONCESSIONS UNDER REVIEW',
    },
    proposal: {
      es: 'abrir licitaciones para operar corredores ferroviarios',
      en: 'open tenders for railway corridor operations',
    },
    choices: {
      es: ['Licitar todos los corredores', 'Empezar por un corredor', 'Conservar operación estatal'],
      en: ['Tender all corridors', 'Start with one corridor', 'Keep public operations'],
    },
  },
  {
    id: 'pres_milei_padron',
    president: 'milei',
    profile: 'transparency',
    title: {
      es: 'AUDITORÍA DEL PADRÓN DE AYUDAS',
      en: 'BENEFIT REGISTER AUDIT',
    },
    proposal: {
      es: 'auditar intermediarios y beneficiarios con supervisión independiente',
      en: 'audit intermediaries and recipients under independent oversight',
    },
    choices: {
      es: ['Abrir una auditoría independiente', 'Revisar por etapas', 'Mantener los controles actuales'],
      en: ['Launch an independent audit', 'Review in stages', 'Keep current checks'],
    },
  },
  {
    id: 'pres_massa_precios',
    president: 'massa',
    profile: 'regulation',
    title: {
      es: 'MESA DE PRECIOS Y ABASTECIMIENTO',
      en: 'PRICES AND SUPPLY TALKS',
    },
    proposal: {
      es: 'acordar precios y metas de abastecimiento con productores',
      en: 'agree on prices and supply targets with producers',
    },
    choices: {
      es: ['Firmar un acuerdo amplio', 'Acotar a productos esenciales', 'Dejar precios sin acuerdo'],
      en: ['Sign a broad agreement', 'Limit to essential goods', 'Leave prices without agreement'],
    },
  },
  {
    id: 'pres_massa_exportadores',
    president: 'massa',
    profile: 'diplomacy',
    title: {
      es: 'DÓLARES PARA LA PRODUCCIÓN',
      en: 'FOREIGN CURRENCY FOR PRODUCTION',
    },
    proposal: {
      es: 'negociar anticipos de exportaciones a cambio de garantías',
      en: 'negotiate export advances in exchange for guarantees',
    },
    choices: {
      es: ['Cerrar el acuerdo de anticipos', 'Negociar metas trimestrales', 'Buscar financiamiento local'],
      en: ['Sign the advance agreement', 'Negotiate quarterly targets', 'Seek domestic funding'],
    },
  },
  {
    id: 'pres_massa_pymes',
    president: 'massa',
    profile: 'investment',
    title: {
      es: 'CRÉDITO PARA PYMES',
      en: 'SMALL BUSINESS CREDIT',
    },
    proposal: {
      es: 'abrir líneas de crédito para capital de trabajo de pymes',
      en: 'open working capital credit for small businesses',
    },
    choices: {
      es: ['Crear un fondo nacional', 'Compartir riesgo con bancos', 'Postergar las nuevas líneas'],
      en: ['Create a national fund', 'Share risk with banks', 'Postpone new credit lines'],
    },
  },
  {
    id: 'pres_massa_salarios',
    president: 'massa',
    profile: 'labor',
    title: {
      es: 'SALARIOS EN LA MESA TRIPARTITA',
      en: 'TRIPARTITE WAGE TALKS',
    },
    proposal: {
      es: 'coordinar aumentos salariales entre sindicatos y empresas',
      en: 'coordinate wage increases between unions and employers',
    },
    choices: {
      es: [
        'Promover un acuerdo nacional',
        'Negociar sector por sector',
        'Dejar la negociación descentralizada',
      ],
      en: ['Promote a national agreement', 'Negotiate sector by sector', 'Keep decentralized bargaining'],
    },
  },
  {
    id: 'pres_massa_gobernadores',
    president: 'massa',
    profile: 'coalition',
    title: {
      es: 'GOBERNADORES EN LA MISMA MESA',
      en: 'GOVERNORS AT ONE TABLE',
    },
    proposal: {
      es: 'coordinar un presupuesto con gobernadores de distintos bloques',
      en: 'coordinate a budget with governors from different caucuses',
    },
    choices: {
      es: [
        'Firmar un pacto presupuestario',
        'Negociar apoyos por capítulos',
        'Presentar el presupuesto sin pacto',
      ],
      en: ['Sign a budget pact', 'Negotiate support by chapter', 'Submit without a pact'],
    },
  },
  {
    id: 'pres_bullrich_fronteras',
    president: 'bullrich',
    profile: 'security',
    title: {
      es: 'FRONTERAS Y COORDINACIÓN',
      en: 'BORDER COORDINATION',
    },
    proposal: {
      es: 'coordinar controles fronterizos con las provincias',
      en: 'coordinate border controls with provincial governments',
    },
    choices: {
      es: ['Desplegar el plan completo', 'Acordar controles supervisados', 'Mantener dispositivos actuales'],
      en: ['Deploy the full plan', 'Agree on supervised checks', 'Keep current arrangements'],
    },
  },
  {
    id: 'pres_bullrich_eventos',
    president: 'bullrich',
    profile: 'security',
    title: {
      es: 'SEGURIDAD EN EVENTOS MASIVOS',
      en: 'SECURITY AT LARGE EVENTS',
    },
    proposal: {
      es: 'crear un dispositivo de seguridad para actos multitudinarios',
      en: 'create security arrangements for large public gatherings',
    },
    choices: {
      es: [
        'Financiar el nuevo dispositivo',
        'Probar protocolos con observadores',
        'Delegar en dispositivos locales',
      ],
      en: ['Fund the new arrangements', 'Pilot protocols with observers', 'Delegate to local arrangements'],
    },
  },
  {
    id: 'pres_bullrich_fuerzas',
    president: 'bullrich',
    profile: 'transparency',
    title: {
      es: 'CONTROL EXTERNO DE LAS FUERZAS',
      en: 'INDEPENDENT POLICE OVERSIGHT',
    },
    proposal: {
      es: 'publicar evaluaciones externas sobre las fuerzas de seguridad',
      en: 'publish independent evaluations of security forces',
    },
    choices: {
      es: [
        'Crear un control independiente',
        'Abrir evaluaciones por etapas',
        'Conservar la revisión interna',
      ],
      en: ['Create independent oversight', 'Phase in evaluations', 'Keep internal review'],
    },
  },
  {
    id: 'pres_bullrich_justicia',
    president: 'bullrich',
    profile: 'coalition',
    title: {
      es: 'ACUERDO FEDERAL DE JUSTICIA',
      en: 'FEDERAL JUSTICE AGREEMENT',
    },
    proposal: {
      es: 'coordinar recursos judiciales entre Nación y provincias',
      en: 'coordinate national and provincial judicial resources',
    },
    choices: {
      es: [
        'Firmar un convenio federal',
        'Negociar convenios por provincia',
        'Conservar competencias actuales',
      ],
      en: ['Sign a federal agreement', 'Negotiate provincial agreements', 'Keep current responsibilities'],
    },
  },
  {
    id: 'pres_bullrich_emergencias',
    president: 'bullrich',
    profile: 'science',
    title: {
      es: 'CENTROS DE RESPUESTA A EMERGENCIAS',
      en: 'EMERGENCY RESPONSE CENTERS',
    },
    proposal: {
      es: 'modernizar comunicaciones entre hospitales, bomberos y seguridad',
      en: 'modernize communications among hospitals, firefighters and police',
    },
    choices: {
      es: ['Financiar la red completa', 'Conectar centros prioritarios', 'Posponer la modernización'],
      en: ['Fund the full network', 'Connect priority centers', 'Postpone modernization'],
    },
  },
  {
    id: 'pres_bregman_jornada',
    president: 'bregman',
    profile: 'labor',
    title: {
      es: 'JORNADA Y REPARTO DEL EMPLEO',
      en: 'WORKING HOURS AND JOB SHARING',
    },
    proposal: {
      es: 'reducir horas de trabajo sin reducir salarios',
      en: 'reduce working hours without reducing wages',
    },
    choices: {
      es: [
        'Presentar la reducción por ley',
        'Probar acuerdos sectoriales',
        'Priorizar empleo sin cambiar horarios',
      ],
      en: [
        'Propose shorter hours by law',
        'Pilot sector agreements',
        'Prioritize jobs without changing hours',
      ],
    },
  },
  {
    id: 'pres_bregman_alquileres',
    president: 'bregman',
    profile: 'social',
    title: {
      es: 'VIVIENDA PARA INQUILINOS',
      en: 'HOUSING FOR TENANTS',
    },
    proposal: {
      es: 'crear un programa público de alquileres accesibles',
      en: 'create a public affordable rental program',
    },
    choices: {
      es: [
        'Financiar alquileres públicos',
        'Priorizar hogares vulnerables',
        'Postergar el programa nacional',
      ],
      en: ['Fund public rentals', 'Prioritize vulnerable households', 'Postpone the national program'],
    },
  },
  {
    id: 'pres_bregman_derechos',
    president: 'bregman',
    profile: 'transparency',
    title: {
      es: 'CONTROL CIVIL Y DERECHO A PROTESTAR',
      en: 'CIVIL OVERSIGHT AND PROTEST RIGHTS',
    },
    proposal: {
      es: 'crear controles civiles sobre los protocolos de seguridad',
      en: 'create civilian oversight of security protocols',
    },
    choices: {
      es: [
        'Crear un organismo independiente',
        'Acordar monitoreo con provincias',
        'Mantener organismos existentes',
      ],
      en: ['Create an independent body', 'Agree on provincial monitoring', 'Keep existing bodies'],
    },
  },
  {
    id: 'pres_bregman_cuidados',
    president: 'bregman',
    profile: 'social',
    title: {
      es: 'RED PÚBLICA DE CUIDADOS',
      en: 'PUBLIC CARE NETWORK',
    },
    proposal: {
      es: 'ampliar jardines y servicios de cuidado para trabajadores',
      en: 'expand childcare facilities and services for workers',
    },
    choices: {
      es: [
        'Abrir una red nacional',
        'Financiar centros prioritarios',
        'Delegar nuevas aperturas a provincias',
      ],
      en: ['Open a national network', 'Fund priority centers', 'Delegate openings to provinces'],
    },
  },
  {
    id: 'pres_bregman_deuda',
    president: 'bregman',
    profile: 'diplomacy',
    title: {
      es: 'AUDITORÍA Y NEGOCIACIÓN DE DEUDA',
      en: 'DEBT AUDIT AND NEGOTIATIONS',
    },
    proposal: {
      es: 'negociar vencimientos mientras una auditoría revisa la deuda',
      en: 'negotiate maturities while an audit reviews public debt',
    },
    choices: {
      es: [
        'Negociar con auditoría pública',
        'Buscar una revisión acotada',
        'Continuar el cronograma vigente',
      ],
      en: ['Negotiate with public auditing', 'Seek a limited review', 'Keep the current schedule'],
    },
  },
  {
    id: 'pres_schiaretti_rutas',
    president: 'schiaretti',
    profile: 'investment',
    title: {
      es: 'RUTAS PARA EL INTERIOR',
      en: 'ROADS FOR THE REGIONS',
    },
    proposal: {
      es: 'conectar corredores productivos alejados de los grandes puertos',
      en: 'connect production corridors far from major ports',
    },
    choices: {
      es: ['Financiar corredores nuevos', 'Completar tramos prioritarios', 'Posponer nuevas conexiones'],
      en: ['Fund new corridors', 'Complete priority sections', 'Postpone new connections'],
    },
  },
  {
    id: 'pres_schiaretti_reparto',
    president: 'schiaretti',
    profile: 'coalition',
    title: {
      es: 'COPARTICIPACIÓN EN DISCUSIÓN',
      en: 'REVENUE SHARING TALKS',
    },
    proposal: {
      es: 'negociar criterios federales para repartir recursos',
      en: 'negotiate federal criteria for revenue sharing',
    },
    choices: {
      es: ['Firmar un nuevo pacto', 'Negociar una transición', 'Mantener el reparto actual'],
      en: ['Sign a new pact', 'Negotiate a transition', 'Keep current sharing rules'],
    },
  },
  {
    id: 'pres_schiaretti_formacion',
    president: 'schiaretti',
    profile: 'science',
    title: {
      es: 'ESCUELAS TÉCNICAS REGIONALES',
      en: 'REGIONAL TECHNICAL SCHOOLS',
    },
    proposal: {
      es: 'vincular escuelas técnicas con sectores productivos regionales',
      en: 'link technical schools with regional industries',
    },
    choices: {
      es: ['Crear una red federal', 'Financiar convenios locales', 'Postergar nuevas sedes'],
      en: ['Create a federal network', 'Fund local agreements', 'Postpone new campuses'],
    },
  },
  {
    id: 'pres_schiaretti_logistica',
    president: 'schiaretti',
    profile: 'regulation',
    title: {
      es: 'LOGÍSTICA SIN FRONTERAS INTERNAS',
      en: 'REMOVING INTERNAL LOGISTICS BARRIERS',
    },
    proposal: {
      es: 'unificar trámites de transporte entre provincias',
      en: 'unify interprovincial transport procedures',
    },
    choices: {
      es: ['Unificar permisos nacionales', 'Negociar estándares comunes', 'Conservar trámites provinciales'],
      en: ['Unify national permits', 'Negotiate common standards', 'Keep provincial procedures'],
    },
  },
  {
    id: 'pres_schiaretti_energia',
    president: 'schiaretti',
    profile: 'investment',
    title: {
      es: 'ENERGÍA PARA LOS PARQUES INDUSTRIALES',
      en: 'ENERGY FOR INDUSTRIAL PARKS',
    },
    proposal: {
      es: 'ampliar conexiones eléctricas en parques industriales del interior',
      en: 'expand electricity connections in regional industrial parks',
    },
    choices: {
      es: ['Financiar las conexiones', 'Compartir costos con provincias', 'Esperar inversión sin subsidios'],
      en: ['Fund connections', 'Share costs with provinces', 'Await unsubsidized investment'],
    },
  },
  {
    id: 'pres_larreta_gestion',
    president: 'larreta',
    profile: 'science',
    title: {
      es: 'TABLERO DE SERVICIOS PÚBLICOS',
      en: 'PUBLIC SERVICE DASHBOARD',
    },
    proposal: {
      es: 'medir tiempos de atención de los servicios nacionales',
      en: 'measure response times across national public services',
    },
    choices: {
      es: ['Crear un tablero nacional', 'Empezar por áreas prioritarias', 'Conservar reportes existentes'],
      en: ['Create a national dashboard', 'Start with priority departments', 'Keep existing reports'],
    },
  },
  {
    id: 'pres_larreta_transporte',
    president: 'larreta',
    profile: 'investment',
    title: {
      es: 'INTEGRACIÓN DEL TRANSPORTE',
      en: 'INTEGRATED TRANSPORT',
    },
    proposal: {
      es: 'integrar boletos y conexiones entre redes de transporte',
      en: 'integrate fares and connections across transport networks',
    },
    choices: {
      es: ['Financiar la integración total', 'Probar corredores conectados', 'Postergar la integración'],
      en: ['Fund full integration', 'Pilot connected corridors', 'Postpone integration'],
    },
  },
  {
    id: 'pres_larreta_consenso',
    president: 'larreta',
    profile: 'coalition',
    title: {
      es: 'PRESUPUESTO DE CONSENSO',
      en: 'CONSENSUS BUDGET',
    },
    proposal: {
      es: 'acordar un presupuesto plurianual con bloques opositores',
      en: 'agree on a multiyear budget with opposition caucuses',
    },
    choices: {
      es: ['Firmar un acuerdo amplio', 'Negociar metas anuales', 'Presentar una propuesta propia'],
      en: ['Sign a broad agreement', 'Negotiate annual targets', 'Submit an independent proposal'],
    },
  },
  {
    id: 'pres_larreta_tramites',
    president: 'larreta',
    profile: 'regulation',
    title: {
      es: 'VENTANILLA ÚNICA DE TRÁMITES',
      en: 'SINGLE WINDOW FOR PERMITS',
    },
    proposal: {
      es: 'unificar habilitaciones nacionales en una ventanilla digital',
      en: 'unify national licensing through a digital single window',
    },
    choices: {
      es: ['Unificar los trámites ahora', 'Probar en sectores piloto', 'Mantener ventanillas actuales'],
      en: ['Unify procedures now', 'Pilot selected sectors', 'Keep current service windows'],
    },
  },
  {
    id: 'pres_larreta_compras',
    president: 'larreta',
    profile: 'transparency',
    title: {
      es: 'COMPRAS ABIERTAS DEL ESTADO',
      en: 'OPEN PUBLIC PROCUREMENT',
    },
    proposal: {
      es: 'publicar contratos y criterios de compras del Estado',
      en: 'publish public procurement contracts and criteria',
    },
    choices: {
      es: ['Abrir contratos y ofertas', 'Empezar por grandes licitaciones', 'Conservar el sistema actual'],
      en: ['Open contracts and bids', 'Start with major tenders', 'Keep the current system'],
    },
  },
  {
    id: 'pres_nestor_obras',
    president: 'nestor',
    profile: 'investment',
    title: {
      es: 'REACTIVAR OBRAS PARALIZADAS',
      en: 'RESTARTING STALLED PUBLIC WORKS',
    },
    proposal: {
      es: 'reactivar obras detenidas y contratar trabajadores locales',
      en: 'restart stalled public works and hire local workers',
    },
    choices: {
      es: ['Reactivar el plan completo', 'Priorizar obras casi terminadas', 'Postergar nuevas partidas'],
      en: ['Restart the full program', 'Prioritize near-finished works', 'Postpone new allocations'],
    },
  },
  {
    id: 'pres_nestor_reservas',
    president: 'nestor',
    profile: 'diplomacy',
    title: {
      es: 'RESERVAS Y AUTONOMÍA FINANCIERA',
      en: 'RESERVES AND FINANCIAL AUTONOMY',
    },
    proposal: {
      es: 'negociar una cancelación anticipada de compromisos externos',
      en: 'negotiate early settlement of external obligations',
    },
    choices: {
      es: ['Negociar una cancelación amplia', 'Acordar pagos por etapas', 'Conservar el calendario vigente'],
      en: ['Negotiate broad settlement', 'Agree on staged payments', 'Keep the current calendar'],
    },
  },
  {
    id: 'pres_nestor_paritarias',
    president: 'nestor',
    profile: 'labor',
    title: {
      es: 'REABRIR LA NEGOCIACIÓN SALARIAL',
      en: 'REOPENING WAGE NEGOTIATIONS',
    },
    proposal: {
      es: 'reactivar convenios salariales con sindicatos y empleadores',
      en: 'revive wage agreements with unions and employers',
    },
    choices: {
      es: ['Convocar un acuerdo nacional', 'Reabrir convenios por sector', 'Postergar la convocatoria'],
      en: ['Convene a national agreement', 'Reopen sector agreements', 'Postpone talks'],
    },
  },
  {
    id: 'pres_nestor_instituciones',
    president: 'nestor',
    profile: 'transparency',
    title: {
      es: 'RENOVACIÓN INSTITUCIONAL',
      en: 'INSTITUTIONAL RENEWAL',
    },
    proposal: {
      es: 'abrir procedimientos públicos de selección de autoridades',
      en: 'open public selection procedures for institutional leadership',
    },
    choices: {
      es: [
        'Abrir concursos y audiencias',
        'Acordar una transición supervisada',
        'Conservar procedimientos actuales',
      ],
      en: ['Open competitions and hearings', 'Agree on a supervised transition', 'Keep current procedures'],
    },
  },
  {
    id: 'pres_nestor_produccion',
    president: 'nestor',
    profile: 'coalition',
    title: {
      es: 'PACTO PRODUCTIVO CON PROVINCIAS',
      en: 'PRODUCTION PACT WITH PROVINCES',
    },
    proposal: {
      es: 'coordinar incentivos regionales con gobernadores',
      en: 'coordinate regional incentives with governors',
    },
    choices: {
      es: ['Firmar un pacto nacional', 'Negociar metas provinciales', 'Dejar incentivos descentralizados'],
      en: ['Sign a national pact', 'Negotiate provincial targets', 'Keep decentralized incentives'],
    },
  },
  {
    id: 'pres_cristina_consumo',
    president: 'cristina',
    profile: 'social',
    title: {
      es: 'CRÉDITO PARA EL CONSUMO',
      en: 'CONSUMER CREDIT PROGRAM',
    },
    proposal: {
      es: 'ampliar acceso a crédito para bienes de producción nacional',
      en: 'expand credit access for domestically produced goods',
    },
    choices: {
      es: [
        'Financiar un programa amplio',
        'Focalizar por nivel de ingresos',
        'Postergar los créditos subsidiados',
      ],
      en: ['Fund a broad program', 'Target by income level', 'Postpone subsidized credit'],
    },
  },
  {
    id: 'pres_cristina_energia',
    president: 'cristina',
    profile: 'investment',
    title: {
      es: 'INVERSIÓN EN ENERGÍA NACIONAL',
      en: 'NATIONAL ENERGY INVESTMENT',
    },
    proposal: {
      es: 'ampliar la inversión pública en producción energética',
      en: 'expand public investment in energy production',
    },
    choices: {
      es: ['Financiar un plan plurianual', 'Asociar capital público y privado', 'Esperar inversión privada'],
      en: ['Fund a multiyear plan', 'Combine public and private capital', 'Await private investment'],
    },
  },
  {
    id: 'pres_cristina_jubilaciones',
    president: 'cristina',
    profile: 'social',
    title: {
      es: 'COBERTURA PREVISIONAL',
      en: 'PENSION COVERAGE',
    },
    proposal: {
      es: 'extender cobertura previsional a personas con aportes incompletos',
      en: 'extend pension coverage to people with incomplete contributions',
    },
    choices: {
      es: ['Ampliar cobertura por ley', 'Priorizar casos vulnerables', 'Mantener requisitos actuales'],
      en: ['Expand coverage by law', 'Prioritize vulnerable cases', 'Keep current requirements'],
    },
  },
  {
    id: 'pres_cristina_ciencia',
    president: 'cristina',
    profile: 'science',
    title: {
      es: 'CIENCIA Y SATÉLITES',
      en: 'SCIENCE AND SATELLITES',
    },
    proposal: {
      es: 'financiar tecnología satelital y laboratorios públicos',
      en: 'fund satellite technology and public laboratories',
    },
    choices: {
      es: ['Sostener un plan plurianual', 'Financiar etapas prioritarias', 'Posponer nuevos desarrollos'],
      en: ['Support a multiyear plan', 'Fund priority stages', 'Postpone new developments'],
    },
  },
  {
    id: 'pres_cristina_comercio',
    president: 'cristina',
    profile: 'regulation',
    title: {
      es: 'IMPORTACIONES E INDUSTRIA',
      en: 'IMPORTS AND INDUSTRY',
    },
    proposal: {
      es: 'revisar permisos de importación para insumos industriales',
      en: 'review import permits for industrial inputs',
    },
    choices: {
      es: ['Simplificar permisos de insumos', 'Acordar cupos sectoriales', 'Conservar el esquema vigente'],
      en: ['Simplify input permits', 'Agree on sector quotas', 'Keep current arrangements'],
    },
  },
  {
    id: 'pres_macri_exportacion',
    president: 'macri',
    profile: 'regulation',
    title: {
      es: 'EXPORTAR CON MENOS TRÁMITES',
      en: 'CUTTING EXPORT RED TAPE',
    },
    proposal: {
      es: 'simplificar controles administrativos para exportaciones',
      en: 'simplify administrative export procedures',
    },
    choices: {
      es: ['Eliminar trámites duplicados', 'Probar un régimen sectorial', 'Conservar controles actuales'],
      en: ['Remove duplicate procedures', 'Pilot a sector regime', 'Keep current checks'],
    },
  },
  {
    id: 'pres_macri_infraestructura',
    president: 'macri',
    profile: 'investment',
    title: {
      es: 'INFRAESTRUCTURA CON INVERSORES',
      en: 'INFRASTRUCTURE WITH INVESTORS',
    },
    proposal: {
      es: 'financiar infraestructura mediante contratos con privados',
      en: 'finance infrastructure through private sector contracts',
    },
    choices: {
      es: [
        'Licitar un paquete nacional',
        'Empezar por proyectos auditables',
        'Postergar nuevas licitaciones',
      ],
      en: ['Tender a national package', 'Start with auditable projects', 'Postpone new tenders'],
    },
  },
  {
    id: 'pres_macri_finanzas',
    president: 'macri',
    profile: 'diplomacy',
    title: {
      es: 'REGRESAR AL FINANCIAMIENTO EXTERNO',
      en: 'ACCESSING EXTERNAL FINANCING',
    },
    proposal: {
      es: 'negociar nuevas líneas de financiamiento internacional',
      en: 'negotiate new international financing lines',
    },
    choices: {
      es: ['Aceptar el paquete propuesto', 'Negociar garantías y plazos', 'Buscar financiamiento interno'],
      en: ['Accept the proposed package', 'Negotiate guarantees and terms', 'Seek domestic financing'],
    },
  },
  {
    id: 'pres_macri_tarifas',
    president: 'macri',
    profile: 'fiscal',
    title: {
      es: 'REORDENAR SUBSIDIOS',
      en: 'RESTRUCTURING SUBSIDIES',
    },
    proposal: {
      es: 'reducir subsidios generales y revisar tarifas',
      en: 'reduce broad subsidies and review utility rates',
    },
    choices: {
      es: ['Aplicar la reducción completa', 'Proteger usuarios vulnerables', 'Postergar la actualización'],
      en: ['Apply the full reduction', 'Protect vulnerable users', 'Postpone the adjustment'],
    },
  },
  {
    id: 'pres_macri_inversion',
    president: 'macri',
    profile: 'transparency',
    title: {
      es: 'GARANTÍAS PARA INVERTIR',
      en: 'INVESTMENT GUARANTEES',
    },
    proposal: {
      es: 'publicar reglas y contratos para grandes inversiones',
      en: 'publish rules and contracts for major investments',
    },
    choices: {
      es: ['Publicar reglas y contratos', 'Revisar primero proyectos grandes', 'Conservar el marco actual'],
      en: ['Publish rules and contracts', 'Review major projects first', 'Keep the current framework'],
    },
  },
  {
    id: 'pres_del_cano_empleo',
    president: 'del_cano',
    profile: 'labor',
    title: {
      es: 'REPARTIR EL TRABAJO DISPONIBLE',
      en: 'SHARING AVAILABLE WORK',
    },
    proposal: {
      es: 'crear acuerdos de reducción de jornada con nuevas contrataciones',
      en: 'create shorter-hours agreements with additional hiring',
    },
    choices: {
      es: ['Presentar un plan nacional', 'Probar convenios por rama', 'Postergar cambios de jornada'],
      en: ['Present a national plan', 'Pilot industry agreements', 'Postpone working-hour changes'],
    },
  },
  {
    id: 'pres_del_cano_transporte',
    president: 'del_cano',
    profile: 'social',
    title: {
      es: 'TRANSPORTE PARA TRABAJADORES',
      en: 'TRANSPORT FOR WORKERS',
    },
    proposal: {
      es: 'financiar un abono de transporte para trabajadores de bajos ingresos',
      en: 'fund a transit pass for low-income workers',
    },
    choices: {
      es: ['Crear un abono nacional', 'Focalizar por ingresos', 'Mantener subsidios actuales'],
      en: ['Create a national pass', 'Target by income', 'Keep current subsidies'],
    },
  },
  {
    id: 'pres_del_cano_banca',
    effects: [
      { popularityDelta: 7, stabilityDelta: 5, marketConfidenceDelta: -8 },
      { popularityDelta: 4, deficitDelta: 3, marketConfidenceDelta: -3 },
      { marketConfidenceDelta: 5, popularityDelta: -5 },
    ],
    president: 'del_cano',
    profile: 'regulation',
    title: {
      es: 'CRÉDITO BAJO CONTROL PÚBLICO',
      en: 'PUBLIC OVERSIGHT OF LENDING',
    },
    proposal: {
      es: 'ampliar la banca pública con controles de trabajadores y usuarios',
      en: 'expand public banking with worker and user oversight',
    },
    choices: {
      es: [
        'Presentar una reforma integral',
        'Crear una experiencia piloto',
        'Conservar la estructura bancaria',
      ],
      en: ['Propose comprehensive reform', 'Create a pilot program', 'Keep the banking structure'],
    },
  },
  {
    id: 'pres_del_cano_organizacion',
    president: 'del_cano',
    profile: 'coalition',
    title: {
      es: 'ORGANIZACIONES EN LA MESA',
      en: 'COMMUNITY ORGANIZATIONS AT THE TABLE',
    },
    proposal: {
      es: 'incorporar organizaciones laborales y barriales al debate presupuestario',
      en: 'include labor and neighborhood organizations in budget talks',
    },
    choices: {
      es: [
        'Crear un consejo participativo',
        'Abrir audiencias por sector',
        'Mantener la negociación parlamentaria',
      ],
      en: ['Create a participatory council', 'Open sector hearings', 'Keep parliamentary bargaining'],
    },
  },
  {
    id: 'pres_del_cano_ambiente',
    president: 'del_cano',
    profile: 'science',
    title: {
      es: 'TRANSICIÓN CON TRABAJO',
      en: 'TRANSITION WITH JOBS',
    },
    proposal: {
      es: 'reconvertir industrias contaminantes con formación y empleo protegido',
      en: 'convert polluting industries with training and protected employment',
    },
    choices: {
      es: [
        'Financiar la reconversión completa',
        'Acordar proyectos regionales',
        'Postergar el programa nacional',
      ],
      en: ['Fund full industrial conversion', 'Agree on regional projects', 'Postpone the national program'],
    },
  },
];
