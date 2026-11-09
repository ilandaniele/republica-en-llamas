import type { STORY_PROFILES } from './presidentStoryData.js';

type Localized = readonly [es: string, en: string];

export interface ExpansionTopic {
  id: string;
  profile: keyof typeof STORY_PROFILES;
  title: Localized;
  situation: Localized;
  followup: Localized;
}

export const EXPANSION_TOPICS: ExpansionTopic[] = [
  {
    id: 'subsidios_agua',
    profile: 'fiscal',
    title: ['LA FACTURA DEL AGUA', 'THE WATER BILL'],
    situation: [
      'Las prestadoras de agua piden revisar subsidios mientras los barrios denuncian cortes diarios.',
      'Water utilities request a subsidy review while neighborhoods report daily outages.',
    ],
    followup: [
      'La nueva estructura de subsidios deja fuera a hogares con medidores compartidos y las provincias piden compensaciones.',
      'The new subsidy structure excludes households sharing meters and provinces request compensation.',
    ],
  },
  {
    id: 'cajas_previsionales',
    profile: 'fiscal',
    title: ['CAJAS EN ROJO', 'PENSION FUNDS IN THE RED'],
    situation: [
      'Las cajas previsionales provinciales necesitan transferencias para pagar el próximo mes.',
      'Provincial pension funds need transfers to cover next month’s payments.',
    ],
    followup: [
      'La auditoría de las transferencias detecta aportes sin registrar y las provincias disputan quién cubre la diferencia.',
      'A transfer audit finds unrecorded contributions and provinces dispute who covers the shortfall.',
    ],
  },
  {
    id: 'aduana_digital',
    profile: 'fiscal',
    title: ['LA ADUANA Y LOS PAPELES', 'CUSTOMS PAPERWORK'],
    situation: [
      'Los puertos acumulan cargas retenidas y Aduana reclama recursos para digitalizar controles.',
      'Ports accumulate held cargo and Customs requests funding to digitize inspections.',
    ],
    followup: [
      'El sistema digital acelera despachos pero las aduanas del interior reclaman fondos para conectarse.',
      'The digital system speeds clearances but inland customs offices request connection funding.',
    ],
  },
  {
    id: 'impuesto_inmuebles',
    profile: 'fiscal',
    title: ['EL MAPA DEL IMPUESTO', 'THE PROPERTY TAX MAP'],
    situation: [
      'Los catastros provinciales llevan años desactualizados y los municipios reclaman revisar la recaudación.',
      'Provincial land registries are years out of date and municipalities request a revenue review.',
    ],
    followup: [
      'Los nuevos catastros elevan valuaciones en pueblos con pocos servicios y los intendentes exigen una transición.',
      'New registries raise valuations in towns with few services and mayors demand a transition.',
    ],
  },
  {
    id: 'gasto_tributario',
    profile: 'fiscal',
    title: ['EXENCIONES BAJO LA LUPA', 'TAX BREAKS UNDER REVIEW'],
    situation: [
      'Un informe muestra beneficios fiscales superpuestos y las cámaras empresarias piden conservarlos.',
      'A report finds overlapping tax breaks and business associations request their preservation.',
    ],
    followup: [
      'La revisión de exenciones provoca reclamos de economías regionales que presupuestaron con el régimen anterior.',
      'The tax-break review triggers complaints from regional producers budgeting under the previous rules.',
    ],
  },
  {
    id: 'red_agua',
    profile: 'investment',
    title: ['AGUA PARA EL INTERIOR', 'WATER FOR INLAND TOWNS'],
    situation: [
      'Una red de acueductos incompleta deja a cinco localidades dependiendo de camiones cisterna.',
      'An unfinished aqueduct network leaves five towns dependent on tanker trucks.',
    ],
    followup: [
      'Las obras del acueducto encuentran cañerías deterioradas y el contratista solicita ampliar el presupuesto.',
      'Aqueduct work uncovers deteriorated pipes and the contractor requests a larger budget.',
    ],
  },
  {
    id: 'trenes_carga',
    profile: 'investment',
    title: ['VÍAS PARA LA COSECHA', 'RAILS FOR THE HARVEST'],
    situation: [
      'Productores pierden ventas por una vía de cargas clausurada y solicitan reactivar el corredor.',
      'Producers lose sales because of a closed freight line and request its reopening.',
    ],
    followup: [
      'La rehabilitación ferroviaria descubre puentes fuera de norma y los proveedores piden contratos adicionales.',
      'Rail rehabilitation uncovers noncompliant bridges and suppliers request additional contracts.',
    ],
  },
  {
    id: 'puertos_fluviales',
    profile: 'investment',
    title: ['EL PUERTO SE QUEDA CHICO', 'THE PORT RUNS OUT OF ROOM'],
    situation: [
      'Un puerto fluvial opera al límite y las provincias compiten por recibir su ampliación.',
      'A river port operates at capacity and provinces compete to host its expansion.',
    ],
    followup: [
      'La ampliación portuaria necesita dragado adicional y las constructoras presentan un nuevo cálculo de costos.',
      'Port expansion requires extra dredging and builders submit revised cost estimates.',
    ],
  },
  {
    id: 'vivienda_suelo',
    profile: 'investment',
    title: ['LOTES SIN SERVICIOS', 'LOTS WITHOUT UTILITIES'],
    situation: [
      'Miles de lotes adjudicados siguen sin electricidad ni cloacas y las familias piden una fecha de entrega.',
      'Thousands of allocated lots still lack electricity and sewers and families request a handover date.',
    ],
    followup: [
      'La urbanización necesita estaciones eléctricas no previstas y los proveedores reclaman nuevos anticipos.',
      'Urbanization requires unplanned substations and suppliers request new advance payments.',
    ],
  },
  {
    id: 'fibra_rural',
    profile: 'investment',
    title: ['EL ÚLTIMO KILÓMETRO DIGITAL', 'THE DIGITAL LAST MILE'],
    situation: [
      'Escuelas rurales y cooperativas comparten una conexión inestable y piden extender la fibra óptica.',
      'Rural schools and cooperatives share an unreliable connection and request fiber expansion.',
    ],
    followup: [
      'El tendido de fibra llega a las cabeceras pero las conexiones domiciliarias requieren contratos nuevos.',
      'Fiber reaches district centers but household connections require new contracts.',
    ],
  },
  {
    id: 'alquiler_temporal',
    profile: 'regulation',
    title: ['LA CIUDAD EN ALQUILER', 'THE CITY FOR RENT'],
    situation: [
      'Los alquileres temporarios crecen y residentes y propietarios disputan las reglas del mercado.',
      'Short-term rentals grow and residents and landlords dispute market rules.',
    ],
    followup: [
      'El nuevo registro de alquileres funciona en grandes ciudades pero pequeños municipios no pueden fiscalizarlo.',
      'The rental registry works in major cities but small municipalities cannot enforce it.',
    ],
  },
  {
    id: 'litio_licencias',
    profile: 'regulation',
    title: ['LICENCIAS EN EL SALAR', 'LICENSES AT THE SALT FLAT'],
    situation: [
      'Un proyecto de litio solicita permisos mientras comunidades reclaman garantías sobre el uso de agua.',
      'A lithium project requests permits while communities demand water-use guarantees.',
    ],
    followup: [
      'El monitoreo del salar publica mediciones contradictorias y las comunidades exigen revisar las inspecciones.',
      'Salt-flat monitoring publishes conflicting readings and communities demand inspection reviews.',
    ],
  },
  {
    id: 'energia_distribuida',
    profile: 'regulation',
    title: ['PANELES EN LOS TECHOS', 'ROOFTOP SOLAR'],
    situation: [
      'Cooperativas quieren vender energía solar a la red y las distribuidoras exigen nuevas reglas tarifarias.',
      'Cooperatives want to sell solar power to the grid and distributors demand new tariff rules.',
    ],
    followup: [
      'Los medidores solares registran saldos distintos según la distribuidora y usuarios piden una revisión técnica.',
      'Solar meters report different balances across distributors and users request a technical review.',
    ],
  },
  {
    id: 'datos_personales',
    profile: 'regulation',
    title: ['¿DE QUIÉN SON LOS DATOS?', 'WHO OWNS THE DATA?'],
    situation: [
      'Una filtración de bases comerciales dispara pedidos de actualizar las reglas de protección de datos.',
      'A commercial database leak triggers demands to update data protection rules.',
    ],
    followup: [
      'Las primeras inspecciones sancionan empresas pequeñas mientras grandes plataformas apelan por jurisdicción.',
      'Initial inspections penalize small firms while major platforms appeal on jurisdictional grounds.',
    ],
  },
  {
    id: 'pesca_cuotas',
    profile: 'regulation',
    title: ['CUOTAS EN EL MAR', 'QUOTAS AT SEA'],
    situation: [
      'Flotas industriales y pescadores costeros disputan cuotas ante una caída de las capturas.',
      'Industrial fleets and coastal fishers dispute quotas as catches decline.',
    ],
    followup: [
      'El control de cuotas detecta desembarques sin declarar y las provincias cuestionan los criterios de sanción.',
      'Quota enforcement finds undeclared landings and provinces challenge penalty criteria.',
    ],
  },
  {
    id: 'guardias_hospital',
    profile: 'social',
    title: ['LA GUARDIA NO DA ABASTO', 'THE EMERGENCY ROOM OVERFLOWS'],
    situation: [
      'Hospitales del conurbano suspenden turnos por falta de personal y pacientes esperan en los pasillos.',
      'Metropolitan hospitals cancel appointments for lack of staff and patients wait in corridors.',
    ],
    followup: [
      'Las nuevas guardias reciben pacientes de distritos vecinos y las direcciones solicitan ampliar la cobertura.',
      'New emergency shifts receive patients from neighboring districts and administrators request expanded coverage.',
    ],
  },
  {
    id: 'comedores_escolares',
    profile: 'social',
    title: ['UN PLATO EN LA ESCUELA', 'A MEAL AT SCHOOL'],
    situation: [
      'Escuelas informan más demanda de almuerzos y proveedores avisan que los contratos quedaron atrasados.',
      'Schools report rising lunch demand and suppliers warn that contracts lag behind costs.',
    ],
    followup: [
      'Los comedores suman estudiantes de jornada extendida y las escuelas piden revisar los cupos.',
      'Meal programs add extended-day students and schools request revised enrollment limits.',
    ],
  },
  {
    id: 'discapacidad_acceso',
    profile: 'social',
    title: ['RAMPAS Y DERECHOS', 'RAMPS AND RIGHTS'],
    situation: [
      'Personas con discapacidad denuncian edificios públicos inaccesibles y reclaman un programa de adaptación.',
      'People with disabilities report inaccessible public buildings and demand an adaptation program.',
    ],
    followup: [
      'Las primeras obras de accesibilidad dejan sin cubrir edificios rurales y las asociaciones solicitan otra etapa.',
      'Initial accessibility works leave rural buildings uncovered and associations request another phase.',
    ],
  },
  {
    id: 'salud_mental',
    profile: 'social',
    title: ['UNA RED DE ESCUCHA', 'A MENTAL HEALTH NETWORK'],
    situation: [
      'Centros de salud registran listas de espera para atención psicológica y municipios piden equipos comunitarios.',
      'Health centers report waiting lists for psychological care and municipalities request community teams.',
    ],
    followup: [
      'Los equipos comunitarios reciben derivaciones que superan sus cupos y hospitales solicitan extender la red.',
      'Community teams receive referrals exceeding capacity and hospitals request network expansion.',
    ],
  },
  {
    id: 'cuidados_mayores',
    profile: 'social',
    title: ['QUIÉN CUIDA A LOS MAYORES', 'WHO CARES FOR OLDER PEOPLE'],
    situation: [
      'Familias que cuidan adultos mayores reclaman centros diurnos y apoyo para sostener el trabajo.',
      'Families caring for older adults request day centers and support to stay employed.',
    ],
    followup: [
      'Los centros diurnos reciben pedidos de localidades sin transporte adaptado y las familias reclaman mayor cobertura.',
      'Day centers receive requests from towns without accessible transport and families demand broader coverage.',
    ],
  },
  {
    id: 'plataformas_reparto',
    profile: 'labor',
    title: ['EL REPARTO Y LOS DERECHOS', 'DELIVERIES AND LABOR RIGHTS'],
    situation: [
      'Repartidores reclaman cobertura por accidentes y las plataformas alertan sobre costos de contratación.',
      'Couriers demand accident coverage and platforms warn about hiring costs.',
    ],
    followup: [
      'Las plataformas solicitan una excepción para repartidores ocasionales y los sindicatos denuncian vacíos en la cobertura.',
      'Platforms request an exception for occasional couriers and unions report coverage gaps.',
    ],
  },
  {
    id: 'cosecha_temporal',
    profile: 'labor',
    title: ['TRABAJO DE COSECHA', 'HARVEST WORK'],
    situation: [
      'Empaques frutícolas necesitan personal de temporada y trabajadores denuncian alojamiento precario.',
      'Fruit packers need seasonal workers and laborers report substandard accommodation.',
    ],
    followup: [
      'Las cámaras de productores piden postergar la adecuación de alojamientos hasta después de la cosecha.',
      'Producer associations request delaying accommodation upgrades until after the harvest.',
    ],
  },
  {
    id: 'reconversion_autopartes',
    profile: 'labor',
    title: ['LA FÁBRICA CAMBIA DE MOTOR', 'THE FACTORY CHANGES ENGINES'],
    situation: [
      'Una autopartista anuncia reconversión tecnológica y su personal exige garantías contra despidos.',
      'An auto-parts maker announces technological conversion and staff demand safeguards against layoffs.',
    ],
    followup: [
      'La empresa pide suspensiones durante la reconversión y el gremio reclama una transición con ingresos garantizados.',
      'The company requests furloughs during conversion and the union demands an income-protected transition.',
    ],
  },
  {
    id: 'enfermeria_turnos',
    profile: 'labor',
    title: ['TURNOS QUE AGOTAN', 'EXHAUSTING SHIFTS'],
    situation: [
      'Enfermeros denuncian jornadas dobles y los hospitales advierten que no pueden cubrir las guardias.',
      'Nurses report double shifts and hospitals warn that they cannot staff emergency services.',
    ],
    followup: [
      'Clínicas privadas solicitan una excepción al régimen de descansos y el personal amenaza con medidas gremiales.',
      'Private clinics request an exception to rest requirements and staff threaten industrial action.',
    ],
  },
  {
    id: 'teletrabajo',
    profile: 'labor',
    title: ['LA OFICINA EN CASA', 'THE OFFICE AT HOME'],
    situation: [
      'Empresas piden revisar el régimen de teletrabajo y empleados reclaman compensar conectividad y horarios extendidos.',
      'Companies request remote-work rule changes and employees demand compensation for connectivity and longer hours.',
    ],
    followup: [
      'Empresas exportadoras solicitan excepciones horarias por los husos de sus clientes y los gremios piden límites.',
      'Export firms request time-zone exceptions for clients and unions demand limits.',
    ],
  },
  {
    id: 'seguridad_estaciones',
    profile: 'security',
    title: ['ANDENES SIN CUIDADO', 'UNSAFE STATION PLATFORMS'],
    situation: [
      'Usuarios denuncian robos en estaciones y organizaciones barriales piden seguridad con control civil.',
      'Passengers report station robberies and neighborhood groups request security with civilian oversight.',
    ],
    followup: [
      'Una auditoría del operativo en estaciones detecta identificaciones sin registro y exige revisar protocolos.',
      'A station-operation audit finds unrecorded identity checks and demands a protocol review.',
    ],
  },
  {
    id: 'ciberfraude',
    profile: 'security',
    title: ['ESTAFAS EN EL TELÉFONO', 'PHONE SCAMS'],
    situation: [
      'Una ola de estafas vacía cuentas y fiscales solicitan una unidad especializada con controles judiciales.',
      'A wave of scams drains accounts and prosecutors request a specialized unit with judicial oversight.',
    ],
    followup: [
      'La unidad antifraude almacena datos de víctimas sin plazos de borrado y la auditoría pide corregir el protocolo.',
      'The anti-fraud unit stores victim data without deletion deadlines and an audit requests protocol corrections.',
    ],
  },
  {
    id: 'incendios_brigadas',
    profile: 'security',
    title: ['BRIGADAS EN ALERTA', 'FIRE CREWS ON ALERT'],
    situation: [
      'La temporada seca adelanta incendios y brigadistas reclaman coordinación entre provincias.',
      'The dry season brings early fires and firefighters request interprovincial coordination.',
    ],
    followup: [
      'El despliegue de brigadas superpone mandos provinciales y nacionales y una revisión exige aclarar responsabilidades.',
      'Fire deployments overlap provincial and national commands and a review demands clear responsibilities.',
    ],
  },
  {
    id: 'violencia_estadios',
    profile: 'security',
    title: ['EL PARTIDO FUERA DE LA CANCHA', 'THE MATCH OUTSIDE THE PITCH'],
    situation: [
      'Clubes y vecinos reclaman prevenir violencia en estadios sin cerrar el acceso de familias.',
      'Clubs and neighbors demand prevention of stadium violence while keeping family access open.',
    ],
    followup: [
      'Organizaciones de hinchas denuncian fallas en las listas de admisión y solicitan revisar el operativo.',
      'Supporter groups report errors in admission lists and request an operation review.',
    ],
  },
  {
    id: 'alerta_inundacion',
    profile: 'security',
    title: ['LA SIRENA ANTES DEL AGUA', 'THE SIREN BEFORE THE FLOOD'],
    situation: [
      'Pueblos ribereños solicitan alertas tempranas y refugios ante un pronóstico de lluvias intensas.',
      'Riverside towns request early warnings and shelters ahead of heavy rain forecasts.',
    ],
    followup: [
      'Un simulacro de evacuación deja barrios sin aviso y los vecinos reclaman supervisión del sistema de alertas.',
      'An evacuation drill leaves neighborhoods without warnings and residents demand alert-system oversight.',
    ],
  },
  {
    id: 'hospitales_federales',
    profile: 'coalition',
    title: ['EL HOSPITAL Y LOS VOTOS', 'THE HOSPITAL AND THE VOTES'],
    situation: [
      'Gobernadores condicionan su apoyo legislativo a un acuerdo de financiamiento hospitalario.',
      'Governors condition legislative support on a hospital funding agreement.',
    ],
    followup: [
      'Distritos excluidos del convenio hospitalario piden incorporarse antes de la próxima votación.',
      'Districts excluded from the hospital agreement request entry before the next vote.',
    ],
  },
  {
    id: 'calendario_escolar',
    profile: 'coalition',
    title: ['UN CALENDARIO, MUCHAS PROVINCIAS', 'ONE CALENDAR, MANY PROVINCES'],
    situation: [
      'El Consejo Federal discute días de clase y las provincias reclaman recursos para sostener el acuerdo.',
      'The Federal Council debates school days and provinces request resources to sustain an agreement.',
    ],
    followup: [
      'Provincias con calendarios especiales exigen incorporarse al financiamiento del pacto educativo.',
      'Provinces with special calendars demand access to the education pact’s funding.',
    ],
  },
  {
    id: 'transporte_metropolitano',
    profile: 'coalition',
    title: ['QUIÉN PAGA EL COLECTIVO', 'WHO PAYS FOR THE BUS'],
    situation: [
      'Nación y provincias disputan quién financia los subsidios de líneas que cruzan jurisdicciones.',
      'National and provincial governments dispute funding for bus lines crossing jurisdictions.',
    ],
    followup: [
      'Ciudades del interior reclaman el mismo trato que los corredores incluidos en el pacto de transporte.',
      'Inland cities demand the same treatment as corridors included in the transport pact.',
    ],
  },
  {
    id: 'justicia_provincias',
    profile: 'coalition',
    title: ['TRIBUNALES Y ACUERDOS', 'COURTS AND AGREEMENTS'],
    situation: [
      'Un proyecto de modernización judicial necesita votos provinciales y cada bloque propone condiciones.',
      'A court modernization bill needs provincial votes and each caucus proposes conditions.',
    ],
    followup: [
      'Tribunales de distritos pequeños piden incorporarse al convenio tecnológico antes de que se apruebe otra ley.',
      'Courts in small districts request access to the technology agreement before another bill passes.',
    ],
  },
  {
    id: 'bosques_federal',
    profile: 'coalition',
    title: ['EL FONDO DEL BOSQUE', 'THE FOREST FUND'],
    situation: [
      'Provincias con bosques nativos piden un reparto estable del fondo ambiental a cambio de apoyar el presupuesto.',
      'Provinces with native forests seek stable environmental funding in exchange for budget support.',
    ],
    followup: [
      'Distritos con nuevas áreas protegidas reclaman ingresar al reparto acordado del fondo forestal.',
      'Districts with new protected areas request inclusion in the agreed forest-fund allocation.',
    ],
  },
  {
    id: 'mercosur_fronteras',
    profile: 'diplomacy',
    title: ['CAMIONES EN LA FRONTERA', 'TRUCKS AT THE BORDER'],
    situation: [
      'Un socio del Mercosur propone controles comunes para reducir filas de camiones en la frontera.',
      'A Mercosur partner proposes shared controls to reduce border truck queues.',
    ],
    followup: [
      'El socio exige intercambiar datos aduaneros antes de habilitar la segunda etapa del paso integrado.',
      'The partner demands customs-data sharing before opening the integrated crossing’s second phase.',
    ],
  },
  {
    id: 'vacunas_acuerdo',
    profile: 'diplomacy',
    title: ['VACUNAS SIN FRONTERAS', 'VACCINES WITHOUT BORDERS'],
    situation: [
      'Países vecinos ofrecen compras conjuntas de vacunas con compromisos de entrega y aportes anticipados.',
      'Neighboring countries offer joint vaccine purchases with delivery commitments and advance contributions.',
    ],
    followup: [
      'El consorcio solicita un anticipo adicional tras cambiar el calendario de entregas de vacunas.',
      'The consortium requests an additional advance after changing the vaccine delivery schedule.',
    ],
  },
  {
    id: 'antartida_cooperacion',
    profile: 'diplomacy',
    title: ['COOPERACIÓN EN EL HIELO', 'COOPERATION ON THE ICE'],
    situation: [
      'Una misión científica internacional invita al país a compartir logística antártica y resultados de investigación.',
      'An international scientific mission invites the country to share Antarctic logistics and research results.',
    ],
    followup: [
      'Los socios antárticos modifican las condiciones de acceso a datos antes de financiar la siguiente campaña.',
      'Antarctic partners change data-access terms before funding the next expedition.',
    ],
  },
  {
    id: 'remesas_regionales',
    profile: 'diplomacy',
    title: ['EL COSTO DE ENVIAR DINERO', 'THE COST OF SENDING MONEY'],
    situation: [
      'Países de la región proponen abaratar remesas con una plataforma común y reglas compartidas.',
      'Regional countries propose cheaper remittances through a shared platform and common rules.',
    ],
    followup: [
      'Los bancos socios piden revisar las garantías de liquidación antes de ampliar el convenio de remesas.',
      'Partner banks request revised settlement guarantees before expanding the remittance agreement.',
    ],
  },
  {
    id: 'exportacion_alimentos',
    profile: 'diplomacy',
    title: ['UN MERCADO PARA LA COSECHA', 'A MARKET FOR THE HARVEST'],
    situation: [
      'Una delegación comercial ofrece abrir su mercado de alimentos si se acuerdan certificaciones sanitarias.',
      'A trade delegation offers food-market access if sanitary certifications are agreed.',
    ],
    followup: [
      'La contraparte agrega requisitos de trazabilidad antes de autorizar el siguiente cupo de exportación.',
      'The counterpart adds traceability requirements before authorizing the next export quota.',
    ],
  },
  {
    id: 'compras_medicamentos',
    profile: 'transparency',
    title: ['EL PRECIO DE LA PASTILLA', 'THE PRICE OF A PILL'],
    situation: [
      'Compras hospitalarias muestran precios muy distintos para el mismo medicamento y se reclama una auditoría.',
      'Hospital purchases show widely different prices for the same medicine and an audit is requested.',
    ],
    followup: [
      'La auditoría farmacéutica encuentra contratos reservados y los hospitales reclaman acceso a los expedientes.',
      'The pharmaceutical audit finds confidential contracts and hospitals demand access to the files.',
    ],
  },
  {
    id: 'publicidad_oficial',
    profile: 'transparency',
    title: ['LA PAUTA A LA VISTA', 'PUBLIC ADVERTISING IN VIEW'],
    situation: [
      'Medios locales piden criterios públicos para repartir publicidad oficial y evitar favoritismos.',
      'Local media request public criteria for allocating government advertising and preventing favoritism.',
    ],
    followup: [
      'El registro de publicidad omite contratos de intermediarios y los auditores solicitan abrir esos anexos.',
      'The advertising register omits intermediary contracts and auditors request those annexes.',
    ],
  },
  {
    id: 'licitacion_escuelas',
    profile: 'transparency',
    title: ['AULAS Y SOBRES CERRADOS', 'CLASSROOMS AND SEALED BIDS'],
    situation: [
      'Una licitación de reparaciones escolares recibe ofertas idénticas y las familias piden revisar la competencia.',
      'A school repair tender receives identical bids and families request a competition review.',
    ],
    followup: [
      'La revisión de obras escolares encuentra subcontratos no publicados y los auditores piden acceso completo.',
      'The school-works review finds unpublished subcontracts and auditors request full access.',
    ],
  },
  {
    id: 'patrimonio_funcionarios',
    profile: 'transparency',
    title: ['DECLARACIONES PENDIENTES', 'OUTSTANDING DISCLOSURES'],
    situation: [
      'Organizaciones civiles advierten demoras en declaraciones patrimoniales y piden controles sobre el gabinete.',
      'Civil groups report delayed asset disclosures and request cabinet oversight.',
    ],
    followup: [
      'El control patrimonial encuentra participaciones indirectas y la oficina revisora solicita documentos adicionales.',
      'Asset oversight finds indirect holdings and the review office requests additional documents.',
    ],
  },
  {
    id: 'algoritmos_estado',
    profile: 'transparency',
    title: ['EL ALGORITMO DECIDE', 'THE ALGORITHM DECIDES'],
    situation: [
      'Un sistema automático rechaza trámites sin explicar motivos y usuarios reclaman una revisión independiente.',
      'An automated system rejects applications without reasons and users demand independent review.',
    ],
    followup: [
      'El proveedor invoca secreto comercial para negar documentación del algoritmo y la auditoría exige explicaciones.',
      'The supplier cites trade secrecy to withhold algorithm documentation and auditors demand explanations.',
    ],
  },
  {
    id: 'satelite_incendios',
    profile: 'science',
    title: ['OJOS SOBRE EL FUEGO', 'EYES ON THE FIRE'],
    situation: [
      'Investigadores proponen un sistema satelital de detección temprana y solicitan continuidad presupuestaria.',
      'Researchers propose a satellite early-detection system and request stable funding.',
    ],
    followup: [
      'El sistema satelital necesita analistas de imágenes y el equipo solicita formación especializada.',
      'The satellite system needs image analysts and the team requests specialist training.',
    ],
  },
  {
    id: 'semillas_sequia',
    profile: 'science',
    title: ['SEMILLAS CONTRA LA SEQUÍA', 'SEEDS AGAINST DROUGHT'],
    situation: [
      'Un instituto público presenta ensayos de cultivos resistentes y pide financiar la siguiente campaña experimental.',
      'A public institute presents resilient crop trials and requests funding for the next experimental season.',
    ],
    followup: [
      'Los ensayos de semillas requieren técnicos de campo y las estaciones experimentales solicitan nuevas becas.',
      'Seed trials require field technicians and experimental stations request new fellowships.',
    ],
  },
  {
    id: 'reactor_medicina',
    profile: 'science',
    title: ['CIENCIA PARA EL DIAGNÓSTICO', 'SCIENCE FOR DIAGNOSIS'],
    situation: [
      'Un laboratorio propone producir insumos de medicina nuclear y necesita equipos y personal especializado.',
      'A laboratory proposes nuclear medicine supplies and needs equipment and specialist staff.',
    ],
    followup: [
      'El proyecto de insumos médicos encuentra escasez de especialistas y solicita convenios universitarios.',
      'The medical-supply project encounters a specialist shortage and requests university agreements.',
    ],
  },
  {
    id: 'baterias_nacionales',
    profile: 'science',
    title: ['DEL MINERAL A LA BATERÍA', 'FROM MINERAL TO BATTERY'],
    situation: [
      'Universidades y empresas presentan una planta piloto de baterías y disputan cómo financiar su desarrollo.',
      'Universities and firms present a battery pilot plant and debate development funding.',
    ],
    followup: [
      'La planta piloto necesita ingenieros de procesos y las universidades piden financiar residencias técnicas.',
      'The pilot plant needs process engineers and universities request funded technical residencies.',
    ],
  },
  {
    id: 'resistencia_antibioticos',
    profile: 'science',
    title: ['BACTERIAS QUE RESISTEN', 'RESISTANT BACTERIA'],
    situation: [
      'Hospitales y universidades solicitan una red de vigilancia de resistencia a antibióticos con laboratorios regionales.',
      'Hospitals and universities request an antibiotic-resistance monitoring network with regional laboratories.',
    ],
    followup: [
      'La red de vigilancia recibe más muestras de las previstas y solicita capacitar microbiólogos en las provincias.',
      'The monitoring network receives more samples than expected and requests provincial microbiologist training.',
    ],
  },
];
