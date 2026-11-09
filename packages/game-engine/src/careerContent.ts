export const CAREER_TOPICS = {
  mayor: [
    [
      'streets',
      'CALLES Y DESAGÜES',
      'STREETS AND DRAINS',
      'Los barrios reclaman reparar las calles y prevenir anegamientos. El municipio tiene fondos limitados.',
      'Residents demand street repairs and drainage. Municipal funds are limited.',
    ],
    [
      'waste',
      'RECOLECCIÓN EN CONFLICTO',
      'WASTE COLLECTION DISPUTE',
      'El servicio de residuos está interrumpido. Vecinos y trabajadores esperan una solución del municipio.',
      'Waste collection is interrupted. Residents and workers expect a municipal solution.',
    ],
    [
      'clinic',
      'EL CENTRO DE SALUD',
      'THE LOCAL CLINIC',
      'El centro de salud barrial necesita personal y equipamiento. Tenés que organizar su ampliación.',
      'The neighborhood clinic needs staff and equipment. You must organize its expansion.',
    ],
    [
      'contract',
      'LA LICITACIÓN MUNICIPAL',
      'THE MUNICIPAL TENDER',
      'Vence un contrato de obras. El concejo deliberante pide explicaciones sobre costos y controles.',
      'A works contract expires. The local council asks about costs and oversight.',
    ],
  ],
  governor: [
    [
      'funds',
      'FONDOS PARA LOS MUNICIPIOS',
      'MUNICIPAL FUNDING',
      'Los intendentes reclaman recursos provinciales. Debés coordinar obras sin vaciar la caja provincial.',
      'Mayors demand provincial resources. Coordinate public works without exhausting the provincial budget.',
    ],
    [
      'schools',
      'EL CICLO LECTIVO',
      'THE SCHOOL YEAR',
      'Docentes y familias exigen mejoras en las escuelas. El conflicto requiere gestión y acuerdos provinciales.',
      'Teachers and families demand better schools. The dispute needs provincial management and agreements.',
    ],
    [
      'hospitals',
      'LA RED DE HOSPITALES',
      'THE HOSPITAL NETWORK',
      'Los hospitales provinciales necesitan coordinación, insumos y personal. Las demandas superan los recursos disponibles.',
      'Provincial hospitals need coordination, supplies and staff. Demand exceeds available resources.',
    ],
    [
      'roads',
      'RUTAS PROVINCIALES',
      'PROVINCIAL ROADS',
      'Las localidades del interior reclaman conectividad. La legislatura provincial discute cómo financiar el plan.',
      'Inland towns demand better connections. The provincial legislature debates funding.',
    ],
  ],
  minister: [
    [
      'program',
      'UN PROGRAMA NACIONAL',
      'A NATIONAL PROGRAM',
      'El gabinete te encarga coordinar un programa con alcance federal. Tenés que demostrar capacidad de ejecución.',
      'The cabinet tasks you with coordinating a nationwide program. You must demonstrate execution.',
    ],
    [
      'cabinet',
      'EL ACUERDO DE GABINETE',
      'THE CABINET AGREEMENT',
      'Otras áreas del gobierno disputan recursos y responsabilidades. Tu programa necesita respaldo político.',
      'Other departments dispute resources and responsibilities. Your program needs political support.',
    ],
    [
      'provinces',
      'LA MESA FEDERAL',
      'THE FEDERAL TALKS',
      'Los gobernadores piden adaptar el programa a cada provincia. El acuerdo puede ampliar tu proyección nacional.',
      'Governors want the program adapted to each province. An agreement could raise your national profile.',
    ],
    [
      'oversight',
      'RENDIR CUENTAS',
      'PUBLIC ACCOUNTABILITY',
      'La comisión de seguimiento exige resultados y control del gasto. Tu candidatura dependerá de tu credibilidad.',
      'The oversight committee demands results and spending controls. Your candidacy depends on credibility.',
    ],
  ],
} as const;

export const CAREER_ACTIONS = [
  ['Ejecutar con fondos propios', 'Deliver using available funds'],
  ['Acordar la implementación con otros sectores', 'Negotiate implementation with other groups'],
  ['Auditar gastos y recuperar recursos', 'Audit spending and recover funds'],
  ['Repartir cargos para imponer el proyecto', 'Trade appointments to impose the project'],
] as const;
