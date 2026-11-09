import { PRESIDENT_IDS } from '../presidents.js';

const PERSONAL_ES: Record<string, string> = {
  milei: 'Bajá el volumen: un grito no reemplaza una respuesta. ¿Podés discutir sin hacer un show?',
  massa: 'Con tantos cambios de discurso, ¿hoy tenemos al mismo candidato que ayer?',
  bullrich: 'Tu tono es firme, pero el público todavía está esperando que termines de explicar el plan.',
  bregman: 'Tenés una réplica para todo. ¿También tenés una respuesta cuando te toca gobernar?',
  schiaretti: 'No alcanza con convertir cada pregunta en una publicidad de Córdoba.',
  larreta: 'Tu respuesta parece ensayada por un comité. ¿Hay una opinión propia detrás?',
  nestor: 'Te gusta marcar la cancha. Esta noche también te toca escuchar preguntas incómodas.',
  cristina: 'El monólogo te sale perfecto. El problema empieza cuando alguien te repregunta.',
  macri: 'Gobernar no es delegar la respuesta difícil. Esta vez el micrófono lo tenés vos.',
  del_cano: 'La consigna entra en una pancarta. ¿Tu plan también entra en un presupuesto?',
  kicillof: 'La explicación dura una clase entera. La respuesta concreta todavía no llegó.',
  grabois: 'Tenés mucha energía para discutir. ¿La podés convertir en una decisión concreta?',
};
const PERSONAL_EN: Record<string, string> = {
  milei: 'Turn the volume down. A shout is not an answer. Can you discuss this without a show?',
  massa: 'After so many changes of message, are you the same candidate we heard yesterday?',
  bullrich: 'Your tone is firm. The audience is still waiting for an explanation of the plan.',
  bregman: 'You have a comeback for everything. What happens when you have to govern?',
  schiaretti: 'Not every question can become an advertisement for Córdoba.',
  larreta: 'That answer sounds written by a committee. Is there a personal opinion behind it?',
  nestor: 'You like setting the terms. Tonight you also have to hear uncomfortable questions.',
  cristina: 'The monologue is polished. The trouble starts with a follow-up question.',
  macri: 'Governing is not delegating the difficult answer. You have the microphone now.',
  del_cano: 'Your slogan fits on a banner. Does your plan fit in a budget?',
  kicillof: 'The explanation lasts a whole lecture. We are still waiting for the answer.',
  grabois: 'You have plenty of energy for an argument. Can you turn it into a concrete decision?',
};

export const DEBATE_ES: Record<string, string> = {
  'debate.title': 'DEBATE PRESIDENCIAL',
  'debate.live': 'EN VIVO · FICCIÓN POLÍTICA',
  'debate.round': 'Cruce {{round}} de 3',
  'debate.topic.personal':
    'Los candidatos se cruzan por su estilo y carácter. El público espera tu respuesta.',
  'debate.topic.economy':
    'El debate pasa al bolsillo y los resultados de gestión. Las promesas se contrastan con los indicadores.',
  'debate.topic.credibility':
    'Último cruce: confianza, coherencia y capacidad de gobernar. Después llegan las urnas.',
  'debate.cross.personal': 'Tu respuesta suena como si necesitaras pedir permiso a tus asesores.',
  'debate.retort.personal': 'Y la tuya parece escrita para conseguir aplausos, no para gobernar.',
  'debate.cross.economy': 'Prometés soluciones fáciles. ¿Quién paga la cuenta de ese anuncio?',
  'debate.retort.economy': 'Antes de corregir mi cuenta, explicá cómo cierra tu presupuesto.',
  'debate.cross.credibility': 'Cambiaste el argumento en pleno debate. ¿Por qué tendrían que creerte?',
  'debate.retort.credibility': 'Escuchar y corregir es mejor que repetir un eslogan sin responder.',
  'debate.reply.defend': 'Defender mi gestión con resultados verificables',
  'debate.reply.counter': 'Devolverle el ataque a {{target}}',
  'debate.reply.challenge': 'Desafiar a {{target}} por sus contradicciones',
  'debate.reply.propose': 'Presentar una propuesta concreta y financiable',
  'debate.feedback.defend.good':
    'Tu respuesta tiene respaldo. Los datos y tu credibilidad convencen al público.',
  'debate.feedback.defend.bad':
    'Los indicadores o tu credibilidad no sostienen la defensa. La réplica te deja expuesto.',
  'debate.feedback.counter.good':
    'Devolvés el golpe sin perder el hilo. El ataque personal se vuelve contra tu rival.',
  'debate.feedback.counter.bad':
    'El contraataque suena a evasiva. Te preguntaron por tu gestión y respondiste con una chicana.',
  'debate.feedback.challenge.good':
    'Marcás una contradicción del rival que venía creciendo. Recuperás la iniciativa.',
  'debate.feedback.challenge.bad':
    'Atacás a alguien que no llevaba la ventaja. El público lo interpreta como una distracción.',
  'debate.feedback.propose.good':
    'La propuesta devuelve la discusión a cómo gobernar. Sumás apoyo por su claridad.',
  'debate.feedback.propose.bad':
    'Pasás por alto la provocación personal. Tu propuesta no logra cortar el momento del rival.',
  'debate.audience': 'Desempeño ante el público · no es intención de voto',
  'debate.you': 'Vos',
  'debate.replyPrompt': 'Tenés la palabra',
  'debate.context':
    'Tu gestión: inflación {{inflation}}% · déficit {{deficit}}/100 · credibilidad {{credibility}}/100.',
  'debate.confirm': 'Responder en el debate',
  'debate.previous': 'Cruce anterior',
  'debate.points': '{{points}} puntos en el debate',
  'debate.outcome.win': 'GANASTE EL DEBATE',
  'debate.outcome.draw': 'DEBATE EMPATADO',
  'debate.outcome.loss': 'PERDISTE EL DEBATE',
  'debate.impact': 'Popularidad del cruce: {{popularity}}. Puntaje por resultado del debate: {{bonus}}.',
  'debate.nextElection':
    'Las elecciones llegan en el turno 40. El debate influye a través de tu popularidad; ganar el debate no garantiza ganar las urnas.',
  'election.won': 'EL ELECTORADO RENUEVA TU MANDATO',
  'election.lost': 'LA OPOSICIÓN GANA LAS ELECCIONES',
  'election.explanation':
    'El escrutinio lo resuelve el juego según tu popularidad y la confianza económica. Las respuestas del debate ya influyeron en tu apoyo.',
  'election.winAction': 'Aceptar el nuevo mandato',
  'election.loseAction': 'Reconocer el resultado y preparar la transición',
  'election.confirm': 'Confirmar el escrutinio',
};

export const DEBATE_EN: Record<string, string> = {
  'debate.title': 'PRESIDENTIAL DEBATE',
  'debate.live': 'LIVE · POLITICAL FICTION',
  'debate.round': 'Exchange {{round}} of 3',
  'debate.topic.personal': 'Candidates clash over style and character. The audience awaits your answer.',
  'debate.topic.economy':
    'The debate turns to living costs and government results. Promises meet the indicators.',
  'debate.topic.credibility':
    'Final exchange: trust, consistency and governing ability. The election comes next.',
  'debate.cross.personal': 'Your answer sounds like you need permission from your advisers.',
  'debate.retort.personal': 'Yours sounds designed to win applause rather than govern.',
  'debate.cross.economy': 'You promise easy solutions. Who pays for that announcement?',
  'debate.retort.economy': 'Before correcting my numbers, explain how your budget adds up.',
  'debate.cross.credibility': 'You changed your argument mid-debate. Why should anyone trust you?',
  'debate.retort.credibility': 'Listening and correcting is better than repeating a slogan.',
  'debate.reply.defend': 'Defend my record with verifiable results',
  'debate.reply.counter': 'Fire back at {{target}}',
  'debate.reply.challenge': 'Challenge {{target}} on their contradictions',
  'debate.reply.propose': 'Present a concrete, funded proposal',
  'debate.feedback.defend.good':
    'Your record supports your answer. Results and credibility persuade the audience.',
  'debate.feedback.defend.bad':
    'The indicators or your credibility undermine your defense. The follow-up exposes you.',
  'debate.feedback.counter.good':
    'You fire back without losing the thread. The personal attack backfires on your opponent.',
  'debate.feedback.counter.bad':
    'Your comeback sounds evasive. You were asked about governing and answered with a jab.',
  'debate.feedback.challenge.good':
    'You expose a contradiction from a rising rival and regain the initiative.',
  'debate.feedback.challenge.bad': 'You attack someone who was not ahead. The audience sees a distraction.',
  'debate.feedback.propose.good':
    'Your proposal brings the discussion back to governing and wins support for its clarity.',
  'debate.feedback.propose.bad':
    'You ignore the personal provocation. Your proposal cannot interrupt the rival’s momentum.',
  'debate.audience': 'Audience performance · not voting intention',
  'debate.you': 'You',
  'debate.replyPrompt': 'You have the floor',
  'debate.context':
    'Your record: inflation {{inflation}}% · deficit {{deficit}}/100 · credibility {{credibility}}/100.',
  'debate.confirm': 'Answer in the debate',
  'debate.previous': 'Previous exchange',
  'debate.points': '{{points}} debate points',
  'debate.outcome.win': 'YOU WON THE DEBATE',
  'debate.outcome.draw': 'THE DEBATE IS TIED',
  'debate.outcome.loss': 'YOU LOST THE DEBATE',
  'debate.impact': 'Popularity this exchange: {{popularity}}. Score from the debate result: {{bonus}}.',
  'debate.nextElection':
    'The election is on turn 40. The debate influences your popularity; winning the debate does not guarantee winning the election.',
  'election.won': 'VOTERS RENEW YOUR MANDATE',
  'election.lost': 'THE OPPOSITION WINS THE ELECTION',
  'election.explanation':
    'The game resolves the count from your popularity and economic confidence. Debate responses already affected your support.',
  'election.winAction': 'Accept the new mandate',
  'election.loseAction': 'Accept the result and prepare the transition',
  'election.confirm': 'Confirm the count',
};

for (const id of PRESIDENT_IDS) {
  DEBATE_ES[`debate.attack.personal.${id}`] = PERSONAL_ES[id]!;
  DEBATE_EN[`debate.attack.personal.${id}`] = PERSONAL_EN[id]!;
  DEBATE_ES[`debate.attack.economy.${id}`] =
    'Dejemos el personaje y miremos el bolsillo. ¿Podés defender tu gestión con resultados y no con excusas?';
  DEBATE_EN[`debate.attack.economy.${id}`] =
    'Drop the act and look at living costs. Can you defend your record with results instead of excuses?';
  DEBATE_ES[`debate.attack.credibility.${id}`] =
    'Tenés preparada otra frase de campaña. ¿Qué prueba tenemos de que esta vez vas a cumplir?';
  DEBATE_EN[`debate.attack.credibility.${id}`] =
    'You have another campaign line ready. What evidence says you will deliver this time?';
}
