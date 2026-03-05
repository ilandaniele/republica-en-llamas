import type { GameState } from './types.js';

export interface AnibalComment {
  condition: (state: GameState) => boolean;
  lines: string[];
}

export const ANIBAL_COMMENTS: AnibalComment[] = [
  // Hiperinflación
  {
    condition: (s) => s.economic.inflation > 80,
    lines: [
      'Con esta inflación, el kilo de asado ya vale más que un departamento en Palermo.',
      'Escuché que en el mercado te piden el CBU antes del precio. Y con razón.',
      'A esto le llaman "variación de precios". Yo le llamo apocalipsis.',
      'El FMI llamó para darnos el pésame. Eso sí es una señal.',
    ],
  },
  // Inflación alta pero no catastrófica
  {
    condition: (s) => s.economic.inflation > 40 && s.economic.inflation <= 80,
    lines: [
      'La inflación subió más que la mora en el vaso de un jubilado los domingos.',
      'Changüí: si llegamos a fin de mes con el bolsillo lleno, fue un sueño.',
      'Che, los precios están tan altos que la gente mira la lista del súper como si fuera un testamento.',
      'El asado se convirtió en lujo de primera categoría. Bienvenidos al tercer mundo gourmet.',
    ],
  },
  // Crisis política
  {
    condition: (s) => s.activeCrises.some((c) => c.type === 'legislativeRebellion' || c.type === 'impeachmentAttempt'),
    lines: [
      'Esto se puso más turbio que la política argentina en cualquier año que elijas.',
      'El Congreso parece un boliche a las 4 de la mañana, pero sin música.',
      'Le pregunté a mi vecino qué piensa de la crisis política. Me dijo "¿cuál de las 17?".',
      'Oigan: la estabilidad institucional llamó y dijo que está ocupada.',
    ],
  },
  // Popularidad por el piso
  {
    condition: (s) => s.political.popularity < 20,
    lines: [
      'El presidente tiene menos aprobación que el INDEC en un año de elecciones.',
      'Con esta popularidad, hasta la mascota del gobierno votaría en contra.',
      'Mirá, yo apoyo al gobierno… pero mis ratings son más altos que los de él. Y yo soy un gordo en radio AM.',
      'Si esto fuera Gran Hermano, el presidente ya hubiera salido en el primer programa.',
    ],
  },
  // Popularidad baja
  {
    condition: (s) => s.political.popularity < 35,
    lines: [
      'La gente está caliente. Y no del calentamiento global, eh.',
      'Hay más bronca en la calle que en un partido de Boca contra River en el Monumental.',
      'El gobernante está tan impopular que le pitaron en el velorio de su abuela.',
    ],
  },
  // Estabilidad baja
  {
    condition: (s) => s.political.socialStability < 25,
    lines: [
      'Los piquetes taparon la 9 de Julio. Eso ya es… normal. ¿No es así?',
      'La gobernabilidad está más quebrada que la vereda frente al ministerio.',
      'Alguien le avisó al gobierno que el orden social no se improvisa, ¿no?',
    ],
  },
  // Buena economía
  {
    condition: (s) => s.economic.marketConfidence > 70 && s.economic.inflation < 20,
    lines: [
      'Ojo, esto parece andar. No lo digamos muy fuerte que se jinxa.',
      'El dólar tranquilo, los mercados bien… ¿esto es Argentina o un sueño?',
      'Atención: hay estabilidad económica. El precio del asado sigue igual de caro, igual.',
    ],
  },
  // FMI
  {
    condition: (s) => s.political.popularity < 40 && s.economic.publicDeficit > 50,
    lines: [
      'El FMI mandó un mail. El asunto decía: "queremos hablar". Señal de que no hay nada que hablar.',
      'Si el FMI fuera un amigo, sería ese amigo que te presta guita y después te dice cómo vivir.',
      'Volvió el FMI. Tercera parte. Esta vez más condiciones y menos dólares.',
    ],
  },
  // Reservas bajas
  {
    condition: (s) => s.economic.foreignReserves < 20,
    lines: [
      'Las reservas internacionales están más vacías que el freezer de mi mamá el 1 de enero.',
      'Sin reservas no hay política cambiaria. Sin política cambiaria, no hay nada.',
      'Le preguntaron al ministro de economía por las reservas. Dijo que estaban "en proceso de optimización".',
    ],
  },
  // Turno avanzado
  {
    condition: (s) => s.turn > 30,
    lines: [
      'Llegamos al turno 30-y-pico. Esto es territorio inexplorado. Ajústense los cinturones.',
      'Nadie esperaba que durara tanto. Ni el presidente, ni la oposición, ni yo.',
      'Que hayamos llegado acá ya es un logro histórico. Bajo en este país.',
    ],
  },
  // Primeros turnos
  {
    condition: (s) => s.turn <= 5,
    lines: [
      'Arrancamos. Suerte. La van a necesitar.',
      'Los primeros días de gobierno son siempre los más fáciles. Después viene todo lo demás.',
      'El pueblo tiene esperanza. Aprovéchela, que dura poco.',
    ],
  },
  // Victoria cercana
  {
    condition: (s) => s.turn >= 45,
    lines: [
      'Falta poco para terminar el mandato. O para que todo explote. No sé bien.',
      'Cinco turnos más y mandato cumplido. O algo así. La Argentina siempre te sorprende.',
      'Estamos en la recta final. Recen lo que sepan rezar.',
    ],
  },
  // General - siempre activo (baja prioridad)
  {
    condition: () => true,
    lines: [
      'Otra decisión difícil. Como diría un político: "estamos estudiando la situación".',
      'La historia argentina tiene más capítulos que una telenovela y la mitad terminan igual de mal.',
      'En este país, lo único predecible es lo impredecible.',
      'Miren, no me pidan que explique esto. Soy gordo, no milagrero.',
      'Un consejo de viejo zorro de radio AM: no confíen en nadie que diga tener el plan.',
      'Argentina: el único país donde el caos es la tradición más firme.',
      'El dólar sube, el dólar baja. En este país, el dólar es la única religión bipartidista.',
      'Escuchen: yo he visto siete crisis económicas. Esta también se supera. O no. Igual.',
    ],
  },
];

export function getAnibalLine(state: GameState): string {
  // Find first matching condition (priority order)
  const matched = ANIBAL_COMMENTS.find((c) => c.condition(state));
  if (!matched) return '';
  const lines = matched.lines;
  const idx = (state.turn + state.score) % lines.length;
  return lines[idx] ?? lines[0] ?? '';
}
