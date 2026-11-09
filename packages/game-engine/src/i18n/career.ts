import { CAREER_ACTIONS, CAREER_TOPICS } from '../careerContent.js';

export const CAREER_ES: Record<string, string> = {
  'career.mode': 'Carrera política',
  'career.intro':
    'Empezá como intendente, gobernador o ministro nacional. Ganá experiencia y respaldo para llegar a presidente.',
  'career.start': 'Cargo inicial',
  'career.office.mayor': 'Intendente',
  'career.office.governor': 'Gobernador',
  'career.office.minister': 'Ministro nacional',
  'career.office.president': 'Presidente',
  'career.stat.management': 'Gestión',
  'career.stat.alliances': 'Alianzas',
  'career.stat.budget': 'Presupuesto disponible',
  'career.stat.integrity': 'Integridad',
  'career.stat.support': 'Apoyo público',
  'career.rules':
    'Después de cinco decisiones podés postularte al cargo siguiente. Si no cumplís los requisitos, seguí gestionando: hay nuevas oportunidades cada tres decisiones, hasta la decisión 15 de cada cargo.',
  'career.localOnly':
    'Carrera con guardado local, sin ranking competitivo. No se combina con Crisis Express ni con escenarios históricos.',
  'career.journey': 'Tu trayectoria',
  'career.turn': 'Decisión {{turn}} en el cargo',
  'career.total': 'Decisiones de carrera: {{turn}}',
  'career.requirements': 'Requisitos para el próximo cargo',
  'career.eligible': 'Ya cumplís los requisitos del próximo ascenso.',
  'career.not_ready':
    'La postulación no reunió respaldo suficiente. Perdiste apoyo y alianzas; podés prepararte para la próxima oportunidad.',
  'career.promoted': 'Ascendiste: un nuevo cargo, con mayores exigencias.',
  'career.stalled': 'No lograste el próximo cargo dentro del plazo. Tu carrera termina en esta etapa.',
  'career.retired': 'Decidiste dar un paso al costado.',
  'career.failed': 'La gestión perdió los recursos o el respaldo necesarios para continuar.',
  'career.end': 'FIN DE ESTA CARRERA',
  'career.summary': 'Último cargo: {{office}}. Ascensos logrados: {{count}}.',
  'career.continue': 'Continuar la carrera',
  'career.confirm': 'Confirmar decisión',
  'career.presidentStart': 'LLEGASTE A LA PRESIDENCIA',
  'career.presidentIntro':
    'Comienza un mandato nacional nuevo. Tu trayectoria queda guardada y el apoyo ganado aporta un bono inicial; el presupuesto local no se convierte en reservas del Banco Central.',
  'career.applied': 'La decisión quedó registrada. Revisá tus recursos y tu próximo objetivo.',
  'career.promotion.title': 'DISPUTAR EL PRÓXIMO CARGO',
  'career.promotion.body':
    'Tu gestión llega a una instancia de evaluación política. El ascenso requiere cumplir todos los requisitos de apoyo, gestión, alianzas, presupuesto e integridad.',
  'career.promotion.run': 'Postularme al próximo cargo',
  'career.promotion.prepare': 'Seguir gestionando y preparar la candidatura',
  'career.promotion.pact': 'Construir un acuerdo público más amplio',
  'career.promotion.retire': 'Dar un paso al costado',
};
export const CAREER_EN: Record<string, string> = {
  'career.mode': 'Political career',
  'career.intro':
    'Start as mayor, governor or national minister. Earn experience and support to reach the presidency.',
  'career.start': 'Starting office',
  'career.office.mayor': 'Mayor',
  'career.office.governor': 'Governor',
  'career.office.minister': 'National minister',
  'career.office.president': 'President',
  'career.stat.management': 'Management',
  'career.stat.alliances': 'Alliances',
  'career.stat.budget': 'Available budget',
  'career.stat.integrity': 'Integrity',
  'career.stat.support': 'Public support',
  'career.rules':
    'After five decisions you can seek the next office. If you are not ready, keep governing: new opportunities arrive every three decisions, up to decision 15 in each office.',
  'career.localOnly':
    'Career with local saves, outside competitive rankings. Cannot be combined with Crisis Express or historical scenarios.',
  'career.journey': 'Your career',
  'career.turn': 'Decision {{turn}} in office',
  'career.total': 'Career decisions: {{turn}}',
  'career.requirements': 'Requirements for the next office',
  'career.eligible': 'You meet the requirements for the next promotion.',
  'career.not_ready':
    'Your candidacy lacked sufficient backing. You lost support and alliances; prepare for the next opportunity.',
  'career.promoted': 'Promoted: a new office with greater demands.',
  'career.stalled': 'You did not reach the next office within the deadline. This career ends here.',
  'career.retired': 'You decided to step aside.',
  'career.failed': 'Your administration lost the resources or support needed to continue.',
  'career.end': 'THIS CAREER ENDS',
  'career.summary': 'Last office: {{office}}. Promotions achieved: {{count}}.',
  'career.continue': 'Continue the career',
  'career.confirm': 'Confirm decision',
  'career.presidentStart': 'YOU REACHED THE PRESIDENCY',
  'career.presidentIntro':
    'A new national mandate begins. Your career is preserved and earned support grants a starting bonus; the local budget does not become central-bank reserves.',
  'career.applied': 'Your decision was recorded. Review your resources and next objective.',
  'career.promotion.title': 'SEEK THE NEXT OFFICE',
  'career.promotion.body':
    'Your administration faces a political assessment. Promotion requires meeting every support, management, alliance, budget and integrity requirement.',
  'career.promotion.run': 'Seek the next office',
  'career.promotion.prepare': 'Keep governing and prepare my candidacy',
  'career.promotion.pact': 'Build a broader public agreement',
  'career.promotion.retire': 'Step aside',
};
for (const [office, topics] of Object.entries(CAREER_TOPICS))
  for (const [id, titleEs, titleEn, bodyEs, bodyEn] of topics) {
    CAREER_ES[`career.${office}.${id}.title`] = titleEs;
    CAREER_EN[`career.${office}.${id}.title`] = titleEn;
    CAREER_ES[`career.${office}.${id}.body`] = bodyEs;
    CAREER_EN[`career.${office}.${id}.body`] = bodyEn;
  }
CAREER_ACTIONS.forEach(([es, en], index) => {
  CAREER_ES[`career.action.${index}`] = es;
  CAREER_EN[`career.action.${index}`] = en;
});
