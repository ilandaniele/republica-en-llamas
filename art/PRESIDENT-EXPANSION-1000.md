# Expansión presidencial: 1.000 tarjetas

Contenido ficticio del juego: 50 temas compartidos, adaptados a los enfoques de los diez presidentes, con 500 decisiones iniciales y 500 continuaciones. No representa declaraciones ni hechos reales de esas personas.

Cada presidente recibe 100 tarjetas adicionales y 300 opciones. Cada tema presenta un conflicto concreto y un problema posterior de implementación. Las opciones combinan el enfoque presidencial con los costos del área; los efectos son abstracciones de juego, no pronósticos.

Las continuaciones requieren aprobar o negociar la propuesta original (opciones A/B), esperar al menos dos turnos y conservar el mismo presidente. La última decisión sobre el tema prevalece: rechazarlo bloquea su continuación. Las tarjetas iniciales se habilitan desde los turnos 1, 5, 9, 13 y 17, con pesos 2 y 3 para mantener espacio para el mazo común.

Ilustraciones: se reutilizan las escenas existentes del presidente correspondiente, según oficina, Congreso, prensa o diplomacia. Esta expansión agrega tarjetas, no 1.000 imágenes nuevas. Las animaciones existentes siguen activas.

Datos: `packages/game-engine/src/events/expansionTopics.ts`, `expansionAgendas.ts` y `presidentExpansion.ts`. Textos completos disponibles en español e inglés. Registro integrado en `ALL_CARDS` y replay determinista compartido con el servidor.

## Milei

| ID | Tarjeta | Turno mínimo | Escena |
| --- | --- | --- | --- |
| exp_milei_subsidios_agua | MILEI: LA FACTURA DEL AGUA | 1 | office |
| exp_milei_subsidios_agua_followup | IMPLEMENTACIÓN / MILEI: LA FACTURA DEL AGUA | 3 | office |
| exp_milei_cajas_previsionales | MILEI: CAJAS EN ROJO | 5 | office |
| exp_milei_cajas_previsionales_followup | IMPLEMENTACIÓN / MILEI: CAJAS EN ROJO | 7 | office |
| exp_milei_aduana_digital | MILEI: LA ADUANA Y LOS PAPELES | 9 | office |
| exp_milei_aduana_digital_followup | IMPLEMENTACIÓN / MILEI: LA ADUANA Y LOS PAPELES | 11 | office |
| exp_milei_impuesto_inmuebles | MILEI: EL MAPA DEL IMPUESTO | 13 | office |
| exp_milei_impuesto_inmuebles_followup | IMPLEMENTACIÓN / MILEI: EL MAPA DEL IMPUESTO | 15 | office |
| exp_milei_gasto_tributario | MILEI: EXENCIONES BAJO LA LUPA | 17 | office |
| exp_milei_gasto_tributario_followup | IMPLEMENTACIÓN / MILEI: EXENCIONES BAJO LA LUPA | 19 | office |
| exp_milei_red_agua | MILEI: AGUA PARA EL INTERIOR | 1 | office |
| exp_milei_red_agua_followup | IMPLEMENTACIÓN / MILEI: AGUA PARA EL INTERIOR | 3 | office |
| exp_milei_trenes_carga | MILEI: VÍAS PARA LA COSECHA | 5 | office |
| exp_milei_trenes_carga_followup | IMPLEMENTACIÓN / MILEI: VÍAS PARA LA COSECHA | 7 | office |
| exp_milei_puertos_fluviales | MILEI: EL PUERTO SE QUEDA CHICO | 9 | office |
| exp_milei_puertos_fluviales_followup | IMPLEMENTACIÓN / MILEI: EL PUERTO SE QUEDA CHICO | 11 | office |
| exp_milei_vivienda_suelo | MILEI: LOTES SIN SERVICIOS | 13 | office |
| exp_milei_vivienda_suelo_followup | IMPLEMENTACIÓN / MILEI: LOTES SIN SERVICIOS | 15 | office |
| exp_milei_fibra_rural | MILEI: EL ÚLTIMO KILÓMETRO DIGITAL | 17 | office |
| exp_milei_fibra_rural_followup | IMPLEMENTACIÓN / MILEI: EL ÚLTIMO KILÓMETRO DIGITAL | 19 | office |
| exp_milei_alquiler_temporal | MILEI: LA CIUDAD EN ALQUILER | 1 | congress |
| exp_milei_alquiler_temporal_followup | IMPLEMENTACIÓN / MILEI: LA CIUDAD EN ALQUILER | 3 | congress |
| exp_milei_litio_licencias | MILEI: LICENCIAS EN EL SALAR | 5 | congress |
| exp_milei_litio_licencias_followup | IMPLEMENTACIÓN / MILEI: LICENCIAS EN EL SALAR | 7 | congress |
| exp_milei_energia_distribuida | MILEI: PANELES EN LOS TECHOS | 9 | congress |
| exp_milei_energia_distribuida_followup | IMPLEMENTACIÓN / MILEI: PANELES EN LOS TECHOS | 11 | congress |
| exp_milei_datos_personales | MILEI: ¿DE QUIÉN SON LOS DATOS? | 13 | congress |
| exp_milei_datos_personales_followup | IMPLEMENTACIÓN / MILEI: ¿DE QUIÉN SON LOS DATOS? | 15 | congress |
| exp_milei_pesca_cuotas | MILEI: CUOTAS EN EL MAR | 17 | congress |
| exp_milei_pesca_cuotas_followup | IMPLEMENTACIÓN / MILEI: CUOTAS EN EL MAR | 19 | congress |
| exp_milei_guardias_hospital | MILEI: LA GUARDIA NO DA ABASTO | 1 | office |
| exp_milei_guardias_hospital_followup | IMPLEMENTACIÓN / MILEI: LA GUARDIA NO DA ABASTO | 3 | office |
| exp_milei_comedores_escolares | MILEI: UN PLATO EN LA ESCUELA | 5 | office |
| exp_milei_comedores_escolares_followup | IMPLEMENTACIÓN / MILEI: UN PLATO EN LA ESCUELA | 7 | office |
| exp_milei_discapacidad_acceso | MILEI: RAMPAS Y DERECHOS | 9 | office |
| exp_milei_discapacidad_acceso_followup | IMPLEMENTACIÓN / MILEI: RAMPAS Y DERECHOS | 11 | office |
| exp_milei_salud_mental | MILEI: UNA RED DE ESCUCHA | 13 | office |
| exp_milei_salud_mental_followup | IMPLEMENTACIÓN / MILEI: UNA RED DE ESCUCHA | 15 | office |
| exp_milei_cuidados_mayores | MILEI: QUIÉN CUIDA A LOS MAYORES | 17 | office |
| exp_milei_cuidados_mayores_followup | IMPLEMENTACIÓN / MILEI: QUIÉN CUIDA A LOS MAYORES | 19 | office |
| exp_milei_plataformas_reparto | MILEI: EL REPARTO Y LOS DERECHOS | 1 | congress |
| exp_milei_plataformas_reparto_followup | IMPLEMENTACIÓN / MILEI: EL REPARTO Y LOS DERECHOS | 3 | congress |
| exp_milei_cosecha_temporal | MILEI: TRABAJO DE COSECHA | 5 | congress |
| exp_milei_cosecha_temporal_followup | IMPLEMENTACIÓN / MILEI: TRABAJO DE COSECHA | 7 | congress |
| exp_milei_reconversion_autopartes | MILEI: LA FÁBRICA CAMBIA DE MOTOR | 9 | congress |
| exp_milei_reconversion_autopartes_followup | IMPLEMENTACIÓN / MILEI: LA FÁBRICA CAMBIA DE MOTOR | 11 | congress |
| exp_milei_enfermeria_turnos | MILEI: TURNOS QUE AGOTAN | 13 | congress |
| exp_milei_enfermeria_turnos_followup | IMPLEMENTACIÓN / MILEI: TURNOS QUE AGOTAN | 15 | congress |
| exp_milei_teletrabajo | MILEI: LA OFICINA EN CASA | 17 | congress |
| exp_milei_teletrabajo_followup | IMPLEMENTACIÓN / MILEI: LA OFICINA EN CASA | 19 | congress |
| exp_milei_seguridad_estaciones | MILEI: ANDENES SIN CUIDADO | 1 | press |
| exp_milei_seguridad_estaciones_followup | IMPLEMENTACIÓN / MILEI: ANDENES SIN CUIDADO | 3 | press |
| exp_milei_ciberfraude | MILEI: ESTAFAS EN EL TELÉFONO | 5 | press |
| exp_milei_ciberfraude_followup | IMPLEMENTACIÓN / MILEI: ESTAFAS EN EL TELÉFONO | 7 | press |
| exp_milei_incendios_brigadas | MILEI: BRIGADAS EN ALERTA | 9 | press |
| exp_milei_incendios_brigadas_followup | IMPLEMENTACIÓN / MILEI: BRIGADAS EN ALERTA | 11 | press |
| exp_milei_violencia_estadios | MILEI: EL PARTIDO FUERA DE LA CANCHA | 13 | press |
| exp_milei_violencia_estadios_followup | IMPLEMENTACIÓN / MILEI: EL PARTIDO FUERA DE LA CANCHA | 15 | press |
| exp_milei_alerta_inundacion | MILEI: LA SIRENA ANTES DEL AGUA | 17 | press |
| exp_milei_alerta_inundacion_followup | IMPLEMENTACIÓN / MILEI: LA SIRENA ANTES DEL AGUA | 19 | press |
| exp_milei_hospitales_federales | MILEI: EL HOSPITAL Y LOS VOTOS | 1 | congress |
| exp_milei_hospitales_federales_followup | IMPLEMENTACIÓN / MILEI: EL HOSPITAL Y LOS VOTOS | 3 | congress |
| exp_milei_calendario_escolar | MILEI: UN CALENDARIO, MUCHAS PROVINCIAS | 5 | congress |
| exp_milei_calendario_escolar_followup | IMPLEMENTACIÓN / MILEI: UN CALENDARIO, MUCHAS PROVINCIAS | 7 | congress |
| exp_milei_transporte_metropolitano | MILEI: QUIÉN PAGA EL COLECTIVO | 9 | congress |
| exp_milei_transporte_metropolitano_followup | IMPLEMENTACIÓN / MILEI: QUIÉN PAGA EL COLECTIVO | 11 | congress |
| exp_milei_justicia_provincias | MILEI: TRIBUNALES Y ACUERDOS | 13 | congress |
| exp_milei_justicia_provincias_followup | IMPLEMENTACIÓN / MILEI: TRIBUNALES Y ACUERDOS | 15 | congress |
| exp_milei_bosques_federal | MILEI: EL FONDO DEL BOSQUE | 17 | congress |
| exp_milei_bosques_federal_followup | IMPLEMENTACIÓN / MILEI: EL FONDO DEL BOSQUE | 19 | congress |
| exp_milei_mercosur_fronteras | MILEI: CAMIONES EN LA FRONTERA | 1 | diplomacy |
| exp_milei_mercosur_fronteras_followup | IMPLEMENTACIÓN / MILEI: CAMIONES EN LA FRONTERA | 3 | diplomacy |
| exp_milei_vacunas_acuerdo | MILEI: VACUNAS SIN FRONTERAS | 5 | diplomacy |
| exp_milei_vacunas_acuerdo_followup | IMPLEMENTACIÓN / MILEI: VACUNAS SIN FRONTERAS | 7 | diplomacy |
| exp_milei_antartida_cooperacion | MILEI: COOPERACIÓN EN EL HIELO | 9 | diplomacy |
| exp_milei_antartida_cooperacion_followup | IMPLEMENTACIÓN / MILEI: COOPERACIÓN EN EL HIELO | 11 | diplomacy |
| exp_milei_remesas_regionales | MILEI: EL COSTO DE ENVIAR DINERO | 13 | diplomacy |
| exp_milei_remesas_regionales_followup | IMPLEMENTACIÓN / MILEI: EL COSTO DE ENVIAR DINERO | 15 | diplomacy |
| exp_milei_exportacion_alimentos | MILEI: UN MERCADO PARA LA COSECHA | 17 | diplomacy |
| exp_milei_exportacion_alimentos_followup | IMPLEMENTACIÓN / MILEI: UN MERCADO PARA LA COSECHA | 19 | diplomacy |
| exp_milei_compras_medicamentos | MILEI: EL PRECIO DE LA PASTILLA | 1 | press |
| exp_milei_compras_medicamentos_followup | IMPLEMENTACIÓN / MILEI: EL PRECIO DE LA PASTILLA | 3 | press |
| exp_milei_publicidad_oficial | MILEI: LA PAUTA A LA VISTA | 5 | press |
| exp_milei_publicidad_oficial_followup | IMPLEMENTACIÓN / MILEI: LA PAUTA A LA VISTA | 7 | press |
| exp_milei_licitacion_escuelas | MILEI: AULAS Y SOBRES CERRADOS | 9 | press |
| exp_milei_licitacion_escuelas_followup | IMPLEMENTACIÓN / MILEI: AULAS Y SOBRES CERRADOS | 11 | press |
| exp_milei_patrimonio_funcionarios | MILEI: DECLARACIONES PENDIENTES | 13 | press |
| exp_milei_patrimonio_funcionarios_followup | IMPLEMENTACIÓN / MILEI: DECLARACIONES PENDIENTES | 15 | press |
| exp_milei_algoritmos_estado | MILEI: EL ALGORITMO DECIDE | 17 | press |
| exp_milei_algoritmos_estado_followup | IMPLEMENTACIÓN / MILEI: EL ALGORITMO DECIDE | 19 | press |
| exp_milei_satelite_incendios | MILEI: OJOS SOBRE EL FUEGO | 1 | office |
| exp_milei_satelite_incendios_followup | IMPLEMENTACIÓN / MILEI: OJOS SOBRE EL FUEGO | 3 | office |
| exp_milei_semillas_sequia | MILEI: SEMILLAS CONTRA LA SEQUÍA | 5 | office |
| exp_milei_semillas_sequia_followup | IMPLEMENTACIÓN / MILEI: SEMILLAS CONTRA LA SEQUÍA | 7 | office |
| exp_milei_reactor_medicina | MILEI: CIENCIA PARA EL DIAGNÓSTICO | 9 | office |
| exp_milei_reactor_medicina_followup | IMPLEMENTACIÓN / MILEI: CIENCIA PARA EL DIAGNÓSTICO | 11 | office |
| exp_milei_baterias_nacionales | MILEI: DEL MINERAL A LA BATERÍA | 13 | office |
| exp_milei_baterias_nacionales_followup | IMPLEMENTACIÓN / MILEI: DEL MINERAL A LA BATERÍA | 15 | office |
| exp_milei_resistencia_antibioticos | MILEI: BACTERIAS QUE RESISTEN | 17 | office |
| exp_milei_resistencia_antibioticos_followup | IMPLEMENTACIÓN / MILEI: BACTERIAS QUE RESISTEN | 19 | office |

## Massa

| ID | Tarjeta | Turno mínimo | Escena |
| --- | --- | --- | --- |
| exp_massa_subsidios_agua | MASSA: LA FACTURA DEL AGUA | 1 | office |
| exp_massa_subsidios_agua_followup | IMPLEMENTACIÓN / MASSA: LA FACTURA DEL AGUA | 3 | office |
| exp_massa_cajas_previsionales | MASSA: CAJAS EN ROJO | 5 | office |
| exp_massa_cajas_previsionales_followup | IMPLEMENTACIÓN / MASSA: CAJAS EN ROJO | 7 | office |
| exp_massa_aduana_digital | MASSA: LA ADUANA Y LOS PAPELES | 9 | office |
| exp_massa_aduana_digital_followup | IMPLEMENTACIÓN / MASSA: LA ADUANA Y LOS PAPELES | 11 | office |
| exp_massa_impuesto_inmuebles | MASSA: EL MAPA DEL IMPUESTO | 13 | office |
| exp_massa_impuesto_inmuebles_followup | IMPLEMENTACIÓN / MASSA: EL MAPA DEL IMPUESTO | 15 | office |
| exp_massa_gasto_tributario | MASSA: EXENCIONES BAJO LA LUPA | 17 | office |
| exp_massa_gasto_tributario_followup | IMPLEMENTACIÓN / MASSA: EXENCIONES BAJO LA LUPA | 19 | office |
| exp_massa_red_agua | MASSA: AGUA PARA EL INTERIOR | 1 | office |
| exp_massa_red_agua_followup | IMPLEMENTACIÓN / MASSA: AGUA PARA EL INTERIOR | 3 | office |
| exp_massa_trenes_carga | MASSA: VÍAS PARA LA COSECHA | 5 | office |
| exp_massa_trenes_carga_followup | IMPLEMENTACIÓN / MASSA: VÍAS PARA LA COSECHA | 7 | office |
| exp_massa_puertos_fluviales | MASSA: EL PUERTO SE QUEDA CHICO | 9 | office |
| exp_massa_puertos_fluviales_followup | IMPLEMENTACIÓN / MASSA: EL PUERTO SE QUEDA CHICO | 11 | office |
| exp_massa_vivienda_suelo | MASSA: LOTES SIN SERVICIOS | 13 | office |
| exp_massa_vivienda_suelo_followup | IMPLEMENTACIÓN / MASSA: LOTES SIN SERVICIOS | 15 | office |
| exp_massa_fibra_rural | MASSA: EL ÚLTIMO KILÓMETRO DIGITAL | 17 | office |
| exp_massa_fibra_rural_followup | IMPLEMENTACIÓN / MASSA: EL ÚLTIMO KILÓMETRO DIGITAL | 19 | office |
| exp_massa_alquiler_temporal | MASSA: LA CIUDAD EN ALQUILER | 1 | congress |
| exp_massa_alquiler_temporal_followup | IMPLEMENTACIÓN / MASSA: LA CIUDAD EN ALQUILER | 3 | congress |
| exp_massa_litio_licencias | MASSA: LICENCIAS EN EL SALAR | 5 | congress |
| exp_massa_litio_licencias_followup | IMPLEMENTACIÓN / MASSA: LICENCIAS EN EL SALAR | 7 | congress |
| exp_massa_energia_distribuida | MASSA: PANELES EN LOS TECHOS | 9 | congress |
| exp_massa_energia_distribuida_followup | IMPLEMENTACIÓN / MASSA: PANELES EN LOS TECHOS | 11 | congress |
| exp_massa_datos_personales | MASSA: ¿DE QUIÉN SON LOS DATOS? | 13 | congress |
| exp_massa_datos_personales_followup | IMPLEMENTACIÓN / MASSA: ¿DE QUIÉN SON LOS DATOS? | 15 | congress |
| exp_massa_pesca_cuotas | MASSA: CUOTAS EN EL MAR | 17 | congress |
| exp_massa_pesca_cuotas_followup | IMPLEMENTACIÓN / MASSA: CUOTAS EN EL MAR | 19 | congress |
| exp_massa_guardias_hospital | MASSA: LA GUARDIA NO DA ABASTO | 1 | office |
| exp_massa_guardias_hospital_followup | IMPLEMENTACIÓN / MASSA: LA GUARDIA NO DA ABASTO | 3 | office |
| exp_massa_comedores_escolares | MASSA: UN PLATO EN LA ESCUELA | 5 | office |
| exp_massa_comedores_escolares_followup | IMPLEMENTACIÓN / MASSA: UN PLATO EN LA ESCUELA | 7 | office |
| exp_massa_discapacidad_acceso | MASSA: RAMPAS Y DERECHOS | 9 | office |
| exp_massa_discapacidad_acceso_followup | IMPLEMENTACIÓN / MASSA: RAMPAS Y DERECHOS | 11 | office |
| exp_massa_salud_mental | MASSA: UNA RED DE ESCUCHA | 13 | office |
| exp_massa_salud_mental_followup | IMPLEMENTACIÓN / MASSA: UNA RED DE ESCUCHA | 15 | office |
| exp_massa_cuidados_mayores | MASSA: QUIÉN CUIDA A LOS MAYORES | 17 | office |
| exp_massa_cuidados_mayores_followup | IMPLEMENTACIÓN / MASSA: QUIÉN CUIDA A LOS MAYORES | 19 | office |
| exp_massa_plataformas_reparto | MASSA: EL REPARTO Y LOS DERECHOS | 1 | congress |
| exp_massa_plataformas_reparto_followup | IMPLEMENTACIÓN / MASSA: EL REPARTO Y LOS DERECHOS | 3 | congress |
| exp_massa_cosecha_temporal | MASSA: TRABAJO DE COSECHA | 5 | congress |
| exp_massa_cosecha_temporal_followup | IMPLEMENTACIÓN / MASSA: TRABAJO DE COSECHA | 7 | congress |
| exp_massa_reconversion_autopartes | MASSA: LA FÁBRICA CAMBIA DE MOTOR | 9 | congress |
| exp_massa_reconversion_autopartes_followup | IMPLEMENTACIÓN / MASSA: LA FÁBRICA CAMBIA DE MOTOR | 11 | congress |
| exp_massa_enfermeria_turnos | MASSA: TURNOS QUE AGOTAN | 13 | congress |
| exp_massa_enfermeria_turnos_followup | IMPLEMENTACIÓN / MASSA: TURNOS QUE AGOTAN | 15 | congress |
| exp_massa_teletrabajo | MASSA: LA OFICINA EN CASA | 17 | congress |
| exp_massa_teletrabajo_followup | IMPLEMENTACIÓN / MASSA: LA OFICINA EN CASA | 19 | congress |
| exp_massa_seguridad_estaciones | MASSA: ANDENES SIN CUIDADO | 1 | press |
| exp_massa_seguridad_estaciones_followup | IMPLEMENTACIÓN / MASSA: ANDENES SIN CUIDADO | 3 | press |
| exp_massa_ciberfraude | MASSA: ESTAFAS EN EL TELÉFONO | 5 | press |
| exp_massa_ciberfraude_followup | IMPLEMENTACIÓN / MASSA: ESTAFAS EN EL TELÉFONO | 7 | press |
| exp_massa_incendios_brigadas | MASSA: BRIGADAS EN ALERTA | 9 | press |
| exp_massa_incendios_brigadas_followup | IMPLEMENTACIÓN / MASSA: BRIGADAS EN ALERTA | 11 | press |
| exp_massa_violencia_estadios | MASSA: EL PARTIDO FUERA DE LA CANCHA | 13 | press |
| exp_massa_violencia_estadios_followup | IMPLEMENTACIÓN / MASSA: EL PARTIDO FUERA DE LA CANCHA | 15 | press |
| exp_massa_alerta_inundacion | MASSA: LA SIRENA ANTES DEL AGUA | 17 | press |
| exp_massa_alerta_inundacion_followup | IMPLEMENTACIÓN / MASSA: LA SIRENA ANTES DEL AGUA | 19 | press |
| exp_massa_hospitales_federales | MASSA: EL HOSPITAL Y LOS VOTOS | 1 | congress |
| exp_massa_hospitales_federales_followup | IMPLEMENTACIÓN / MASSA: EL HOSPITAL Y LOS VOTOS | 3 | congress |
| exp_massa_calendario_escolar | MASSA: UN CALENDARIO, MUCHAS PROVINCIAS | 5 | congress |
| exp_massa_calendario_escolar_followup | IMPLEMENTACIÓN / MASSA: UN CALENDARIO, MUCHAS PROVINCIAS | 7 | congress |
| exp_massa_transporte_metropolitano | MASSA: QUIÉN PAGA EL COLECTIVO | 9 | congress |
| exp_massa_transporte_metropolitano_followup | IMPLEMENTACIÓN / MASSA: QUIÉN PAGA EL COLECTIVO | 11 | congress |
| exp_massa_justicia_provincias | MASSA: TRIBUNALES Y ACUERDOS | 13 | congress |
| exp_massa_justicia_provincias_followup | IMPLEMENTACIÓN / MASSA: TRIBUNALES Y ACUERDOS | 15 | congress |
| exp_massa_bosques_federal | MASSA: EL FONDO DEL BOSQUE | 17 | congress |
| exp_massa_bosques_federal_followup | IMPLEMENTACIÓN / MASSA: EL FONDO DEL BOSQUE | 19 | congress |
| exp_massa_mercosur_fronteras | MASSA: CAMIONES EN LA FRONTERA | 1 | diplomacy |
| exp_massa_mercosur_fronteras_followup | IMPLEMENTACIÓN / MASSA: CAMIONES EN LA FRONTERA | 3 | diplomacy |
| exp_massa_vacunas_acuerdo | MASSA: VACUNAS SIN FRONTERAS | 5 | diplomacy |
| exp_massa_vacunas_acuerdo_followup | IMPLEMENTACIÓN / MASSA: VACUNAS SIN FRONTERAS | 7 | diplomacy |
| exp_massa_antartida_cooperacion | MASSA: COOPERACIÓN EN EL HIELO | 9 | diplomacy |
| exp_massa_antartida_cooperacion_followup | IMPLEMENTACIÓN / MASSA: COOPERACIÓN EN EL HIELO | 11 | diplomacy |
| exp_massa_remesas_regionales | MASSA: EL COSTO DE ENVIAR DINERO | 13 | diplomacy |
| exp_massa_remesas_regionales_followup | IMPLEMENTACIÓN / MASSA: EL COSTO DE ENVIAR DINERO | 15 | diplomacy |
| exp_massa_exportacion_alimentos | MASSA: UN MERCADO PARA LA COSECHA | 17 | diplomacy |
| exp_massa_exportacion_alimentos_followup | IMPLEMENTACIÓN / MASSA: UN MERCADO PARA LA COSECHA | 19 | diplomacy |
| exp_massa_compras_medicamentos | MASSA: EL PRECIO DE LA PASTILLA | 1 | press |
| exp_massa_compras_medicamentos_followup | IMPLEMENTACIÓN / MASSA: EL PRECIO DE LA PASTILLA | 3 | press |
| exp_massa_publicidad_oficial | MASSA: LA PAUTA A LA VISTA | 5 | press |
| exp_massa_publicidad_oficial_followup | IMPLEMENTACIÓN / MASSA: LA PAUTA A LA VISTA | 7 | press |
| exp_massa_licitacion_escuelas | MASSA: AULAS Y SOBRES CERRADOS | 9 | press |
| exp_massa_licitacion_escuelas_followup | IMPLEMENTACIÓN / MASSA: AULAS Y SOBRES CERRADOS | 11 | press |
| exp_massa_patrimonio_funcionarios | MASSA: DECLARACIONES PENDIENTES | 13 | press |
| exp_massa_patrimonio_funcionarios_followup | IMPLEMENTACIÓN / MASSA: DECLARACIONES PENDIENTES | 15 | press |
| exp_massa_algoritmos_estado | MASSA: EL ALGORITMO DECIDE | 17 | press |
| exp_massa_algoritmos_estado_followup | IMPLEMENTACIÓN / MASSA: EL ALGORITMO DECIDE | 19 | press |
| exp_massa_satelite_incendios | MASSA: OJOS SOBRE EL FUEGO | 1 | office |
| exp_massa_satelite_incendios_followup | IMPLEMENTACIÓN / MASSA: OJOS SOBRE EL FUEGO | 3 | office |
| exp_massa_semillas_sequia | MASSA: SEMILLAS CONTRA LA SEQUÍA | 5 | office |
| exp_massa_semillas_sequia_followup | IMPLEMENTACIÓN / MASSA: SEMILLAS CONTRA LA SEQUÍA | 7 | office |
| exp_massa_reactor_medicina | MASSA: CIENCIA PARA EL DIAGNÓSTICO | 9 | office |
| exp_massa_reactor_medicina_followup | IMPLEMENTACIÓN / MASSA: CIENCIA PARA EL DIAGNÓSTICO | 11 | office |
| exp_massa_baterias_nacionales | MASSA: DEL MINERAL A LA BATERÍA | 13 | office |
| exp_massa_baterias_nacionales_followup | IMPLEMENTACIÓN / MASSA: DEL MINERAL A LA BATERÍA | 15 | office |
| exp_massa_resistencia_antibioticos | MASSA: BACTERIAS QUE RESISTEN | 17 | office |
| exp_massa_resistencia_antibioticos_followup | IMPLEMENTACIÓN / MASSA: BACTERIAS QUE RESISTEN | 19 | office |

## Bullrich

| ID | Tarjeta | Turno mínimo | Escena |
| --- | --- | --- | --- |
| exp_bullrich_subsidios_agua | BULLRICH: LA FACTURA DEL AGUA | 1 | office |
| exp_bullrich_subsidios_agua_followup | IMPLEMENTACIÓN / BULLRICH: LA FACTURA DEL AGUA | 3 | office |
| exp_bullrich_cajas_previsionales | BULLRICH: CAJAS EN ROJO | 5 | office |
| exp_bullrich_cajas_previsionales_followup | IMPLEMENTACIÓN / BULLRICH: CAJAS EN ROJO | 7 | office |
| exp_bullrich_aduana_digital | BULLRICH: LA ADUANA Y LOS PAPELES | 9 | office |
| exp_bullrich_aduana_digital_followup | IMPLEMENTACIÓN / BULLRICH: LA ADUANA Y LOS PAPELES | 11 | office |
| exp_bullrich_impuesto_inmuebles | BULLRICH: EL MAPA DEL IMPUESTO | 13 | office |
| exp_bullrich_impuesto_inmuebles_followup | IMPLEMENTACIÓN / BULLRICH: EL MAPA DEL IMPUESTO | 15 | office |
| exp_bullrich_gasto_tributario | BULLRICH: EXENCIONES BAJO LA LUPA | 17 | office |
| exp_bullrich_gasto_tributario_followup | IMPLEMENTACIÓN / BULLRICH: EXENCIONES BAJO LA LUPA | 19 | office |
| exp_bullrich_red_agua | BULLRICH: AGUA PARA EL INTERIOR | 1 | office |
| exp_bullrich_red_agua_followup | IMPLEMENTACIÓN / BULLRICH: AGUA PARA EL INTERIOR | 3 | office |
| exp_bullrich_trenes_carga | BULLRICH: VÍAS PARA LA COSECHA | 5 | office |
| exp_bullrich_trenes_carga_followup | IMPLEMENTACIÓN / BULLRICH: VÍAS PARA LA COSECHA | 7 | office |
| exp_bullrich_puertos_fluviales | BULLRICH: EL PUERTO SE QUEDA CHICO | 9 | office |
| exp_bullrich_puertos_fluviales_followup | IMPLEMENTACIÓN / BULLRICH: EL PUERTO SE QUEDA CHICO | 11 | office |
| exp_bullrich_vivienda_suelo | BULLRICH: LOTES SIN SERVICIOS | 13 | office |
| exp_bullrich_vivienda_suelo_followup | IMPLEMENTACIÓN / BULLRICH: LOTES SIN SERVICIOS | 15 | office |
| exp_bullrich_fibra_rural | BULLRICH: EL ÚLTIMO KILÓMETRO DIGITAL | 17 | office |
| exp_bullrich_fibra_rural_followup | IMPLEMENTACIÓN / BULLRICH: EL ÚLTIMO KILÓMETRO DIGITAL | 19 | office |
| exp_bullrich_alquiler_temporal | BULLRICH: LA CIUDAD EN ALQUILER | 1 | congress |
| exp_bullrich_alquiler_temporal_followup | IMPLEMENTACIÓN / BULLRICH: LA CIUDAD EN ALQUILER | 3 | congress |
| exp_bullrich_litio_licencias | BULLRICH: LICENCIAS EN EL SALAR | 5 | congress |
| exp_bullrich_litio_licencias_followup | IMPLEMENTACIÓN / BULLRICH: LICENCIAS EN EL SALAR | 7 | congress |
| exp_bullrich_energia_distribuida | BULLRICH: PANELES EN LOS TECHOS | 9 | congress |
| exp_bullrich_energia_distribuida_followup | IMPLEMENTACIÓN / BULLRICH: PANELES EN LOS TECHOS | 11 | congress |
| exp_bullrich_datos_personales | BULLRICH: ¿DE QUIÉN SON LOS DATOS? | 13 | congress |
| exp_bullrich_datos_personales_followup | IMPLEMENTACIÓN / BULLRICH: ¿DE QUIÉN SON LOS DATOS? | 15 | congress |
| exp_bullrich_pesca_cuotas | BULLRICH: CUOTAS EN EL MAR | 17 | congress |
| exp_bullrich_pesca_cuotas_followup | IMPLEMENTACIÓN / BULLRICH: CUOTAS EN EL MAR | 19 | congress |
| exp_bullrich_guardias_hospital | BULLRICH: LA GUARDIA NO DA ABASTO | 1 | office |
| exp_bullrich_guardias_hospital_followup | IMPLEMENTACIÓN / BULLRICH: LA GUARDIA NO DA ABASTO | 3 | office |
| exp_bullrich_comedores_escolares | BULLRICH: UN PLATO EN LA ESCUELA | 5 | office |
| exp_bullrich_comedores_escolares_followup | IMPLEMENTACIÓN / BULLRICH: UN PLATO EN LA ESCUELA | 7 | office |
| exp_bullrich_discapacidad_acceso | BULLRICH: RAMPAS Y DERECHOS | 9 | office |
| exp_bullrich_discapacidad_acceso_followup | IMPLEMENTACIÓN / BULLRICH: RAMPAS Y DERECHOS | 11 | office |
| exp_bullrich_salud_mental | BULLRICH: UNA RED DE ESCUCHA | 13 | office |
| exp_bullrich_salud_mental_followup | IMPLEMENTACIÓN / BULLRICH: UNA RED DE ESCUCHA | 15 | office |
| exp_bullrich_cuidados_mayores | BULLRICH: QUIÉN CUIDA A LOS MAYORES | 17 | office |
| exp_bullrich_cuidados_mayores_followup | IMPLEMENTACIÓN / BULLRICH: QUIÉN CUIDA A LOS MAYORES | 19 | office |
| exp_bullrich_plataformas_reparto | BULLRICH: EL REPARTO Y LOS DERECHOS | 1 | congress |
| exp_bullrich_plataformas_reparto_followup | IMPLEMENTACIÓN / BULLRICH: EL REPARTO Y LOS DERECHOS | 3 | congress |
| exp_bullrich_cosecha_temporal | BULLRICH: TRABAJO DE COSECHA | 5 | congress |
| exp_bullrich_cosecha_temporal_followup | IMPLEMENTACIÓN / BULLRICH: TRABAJO DE COSECHA | 7 | congress |
| exp_bullrich_reconversion_autopartes | BULLRICH: LA FÁBRICA CAMBIA DE MOTOR | 9 | congress |
| exp_bullrich_reconversion_autopartes_followup | IMPLEMENTACIÓN / BULLRICH: LA FÁBRICA CAMBIA DE MOTOR | 11 | congress |
| exp_bullrich_enfermeria_turnos | BULLRICH: TURNOS QUE AGOTAN | 13 | congress |
| exp_bullrich_enfermeria_turnos_followup | IMPLEMENTACIÓN / BULLRICH: TURNOS QUE AGOTAN | 15 | congress |
| exp_bullrich_teletrabajo | BULLRICH: LA OFICINA EN CASA | 17 | congress |
| exp_bullrich_teletrabajo_followup | IMPLEMENTACIÓN / BULLRICH: LA OFICINA EN CASA | 19 | congress |
| exp_bullrich_seguridad_estaciones | BULLRICH: ANDENES SIN CUIDADO | 1 | press |
| exp_bullrich_seguridad_estaciones_followup | IMPLEMENTACIÓN / BULLRICH: ANDENES SIN CUIDADO | 3 | press |
| exp_bullrich_ciberfraude | BULLRICH: ESTAFAS EN EL TELÉFONO | 5 | press |
| exp_bullrich_ciberfraude_followup | IMPLEMENTACIÓN / BULLRICH: ESTAFAS EN EL TELÉFONO | 7 | press |
| exp_bullrich_incendios_brigadas | BULLRICH: BRIGADAS EN ALERTA | 9 | press |
| exp_bullrich_incendios_brigadas_followup | IMPLEMENTACIÓN / BULLRICH: BRIGADAS EN ALERTA | 11 | press |
| exp_bullrich_violencia_estadios | BULLRICH: EL PARTIDO FUERA DE LA CANCHA | 13 | press |
| exp_bullrich_violencia_estadios_followup | IMPLEMENTACIÓN / BULLRICH: EL PARTIDO FUERA DE LA CANCHA | 15 | press |
| exp_bullrich_alerta_inundacion | BULLRICH: LA SIRENA ANTES DEL AGUA | 17 | press |
| exp_bullrich_alerta_inundacion_followup | IMPLEMENTACIÓN / BULLRICH: LA SIRENA ANTES DEL AGUA | 19 | press |
| exp_bullrich_hospitales_federales | BULLRICH: EL HOSPITAL Y LOS VOTOS | 1 | congress |
| exp_bullrich_hospitales_federales_followup | IMPLEMENTACIÓN / BULLRICH: EL HOSPITAL Y LOS VOTOS | 3 | congress |
| exp_bullrich_calendario_escolar | BULLRICH: UN CALENDARIO, MUCHAS PROVINCIAS | 5 | congress |
| exp_bullrich_calendario_escolar_followup | IMPLEMENTACIÓN / BULLRICH: UN CALENDARIO, MUCHAS PROVINCIAS | 7 | congress |
| exp_bullrich_transporte_metropolitano | BULLRICH: QUIÉN PAGA EL COLECTIVO | 9 | congress |
| exp_bullrich_transporte_metropolitano_followup | IMPLEMENTACIÓN / BULLRICH: QUIÉN PAGA EL COLECTIVO | 11 | congress |
| exp_bullrich_justicia_provincias | BULLRICH: TRIBUNALES Y ACUERDOS | 13 | congress |
| exp_bullrich_justicia_provincias_followup | IMPLEMENTACIÓN / BULLRICH: TRIBUNALES Y ACUERDOS | 15 | congress |
| exp_bullrich_bosques_federal | BULLRICH: EL FONDO DEL BOSQUE | 17 | congress |
| exp_bullrich_bosques_federal_followup | IMPLEMENTACIÓN / BULLRICH: EL FONDO DEL BOSQUE | 19 | congress |
| exp_bullrich_mercosur_fronteras | BULLRICH: CAMIONES EN LA FRONTERA | 1 | diplomacy |
| exp_bullrich_mercosur_fronteras_followup | IMPLEMENTACIÓN / BULLRICH: CAMIONES EN LA FRONTERA | 3 | diplomacy |
| exp_bullrich_vacunas_acuerdo | BULLRICH: VACUNAS SIN FRONTERAS | 5 | diplomacy |
| exp_bullrich_vacunas_acuerdo_followup | IMPLEMENTACIÓN / BULLRICH: VACUNAS SIN FRONTERAS | 7 | diplomacy |
| exp_bullrich_antartida_cooperacion | BULLRICH: COOPERACIÓN EN EL HIELO | 9 | diplomacy |
| exp_bullrich_antartida_cooperacion_followup | IMPLEMENTACIÓN / BULLRICH: COOPERACIÓN EN EL HIELO | 11 | diplomacy |
| exp_bullrich_remesas_regionales | BULLRICH: EL COSTO DE ENVIAR DINERO | 13 | diplomacy |
| exp_bullrich_remesas_regionales_followup | IMPLEMENTACIÓN / BULLRICH: EL COSTO DE ENVIAR DINERO | 15 | diplomacy |
| exp_bullrich_exportacion_alimentos | BULLRICH: UN MERCADO PARA LA COSECHA | 17 | diplomacy |
| exp_bullrich_exportacion_alimentos_followup | IMPLEMENTACIÓN / BULLRICH: UN MERCADO PARA LA COSECHA | 19 | diplomacy |
| exp_bullrich_compras_medicamentos | BULLRICH: EL PRECIO DE LA PASTILLA | 1 | press |
| exp_bullrich_compras_medicamentos_followup | IMPLEMENTACIÓN / BULLRICH: EL PRECIO DE LA PASTILLA | 3 | press |
| exp_bullrich_publicidad_oficial | BULLRICH: LA PAUTA A LA VISTA | 5 | press |
| exp_bullrich_publicidad_oficial_followup | IMPLEMENTACIÓN / BULLRICH: LA PAUTA A LA VISTA | 7 | press |
| exp_bullrich_licitacion_escuelas | BULLRICH: AULAS Y SOBRES CERRADOS | 9 | press |
| exp_bullrich_licitacion_escuelas_followup | IMPLEMENTACIÓN / BULLRICH: AULAS Y SOBRES CERRADOS | 11 | press |
| exp_bullrich_patrimonio_funcionarios | BULLRICH: DECLARACIONES PENDIENTES | 13 | press |
| exp_bullrich_patrimonio_funcionarios_followup | IMPLEMENTACIÓN / BULLRICH: DECLARACIONES PENDIENTES | 15 | press |
| exp_bullrich_algoritmos_estado | BULLRICH: EL ALGORITMO DECIDE | 17 | press |
| exp_bullrich_algoritmos_estado_followup | IMPLEMENTACIÓN / BULLRICH: EL ALGORITMO DECIDE | 19 | press |
| exp_bullrich_satelite_incendios | BULLRICH: OJOS SOBRE EL FUEGO | 1 | office |
| exp_bullrich_satelite_incendios_followup | IMPLEMENTACIÓN / BULLRICH: OJOS SOBRE EL FUEGO | 3 | office |
| exp_bullrich_semillas_sequia | BULLRICH: SEMILLAS CONTRA LA SEQUÍA | 5 | office |
| exp_bullrich_semillas_sequia_followup | IMPLEMENTACIÓN / BULLRICH: SEMILLAS CONTRA LA SEQUÍA | 7 | office |
| exp_bullrich_reactor_medicina | BULLRICH: CIENCIA PARA EL DIAGNÓSTICO | 9 | office |
| exp_bullrich_reactor_medicina_followup | IMPLEMENTACIÓN / BULLRICH: CIENCIA PARA EL DIAGNÓSTICO | 11 | office |
| exp_bullrich_baterias_nacionales | BULLRICH: DEL MINERAL A LA BATERÍA | 13 | office |
| exp_bullrich_baterias_nacionales_followup | IMPLEMENTACIÓN / BULLRICH: DEL MINERAL A LA BATERÍA | 15 | office |
| exp_bullrich_resistencia_antibioticos | BULLRICH: BACTERIAS QUE RESISTEN | 17 | office |
| exp_bullrich_resistencia_antibioticos_followup | IMPLEMENTACIÓN / BULLRICH: BACTERIAS QUE RESISTEN | 19 | office |

## Bregman

| ID | Tarjeta | Turno mínimo | Escena |
| --- | --- | --- | --- |
| exp_bregman_subsidios_agua | BREGMAN: LA FACTURA DEL AGUA | 1 | office |
| exp_bregman_subsidios_agua_followup | IMPLEMENTACIÓN / BREGMAN: LA FACTURA DEL AGUA | 3 | office |
| exp_bregman_cajas_previsionales | BREGMAN: CAJAS EN ROJO | 5 | office |
| exp_bregman_cajas_previsionales_followup | IMPLEMENTACIÓN / BREGMAN: CAJAS EN ROJO | 7 | office |
| exp_bregman_aduana_digital | BREGMAN: LA ADUANA Y LOS PAPELES | 9 | office |
| exp_bregman_aduana_digital_followup | IMPLEMENTACIÓN / BREGMAN: LA ADUANA Y LOS PAPELES | 11 | office |
| exp_bregman_impuesto_inmuebles | BREGMAN: EL MAPA DEL IMPUESTO | 13 | office |
| exp_bregman_impuesto_inmuebles_followup | IMPLEMENTACIÓN / BREGMAN: EL MAPA DEL IMPUESTO | 15 | office |
| exp_bregman_gasto_tributario | BREGMAN: EXENCIONES BAJO LA LUPA | 17 | office |
| exp_bregman_gasto_tributario_followup | IMPLEMENTACIÓN / BREGMAN: EXENCIONES BAJO LA LUPA | 19 | office |
| exp_bregman_red_agua | BREGMAN: AGUA PARA EL INTERIOR | 1 | office |
| exp_bregman_red_agua_followup | IMPLEMENTACIÓN / BREGMAN: AGUA PARA EL INTERIOR | 3 | office |
| exp_bregman_trenes_carga | BREGMAN: VÍAS PARA LA COSECHA | 5 | office |
| exp_bregman_trenes_carga_followup | IMPLEMENTACIÓN / BREGMAN: VÍAS PARA LA COSECHA | 7 | office |
| exp_bregman_puertos_fluviales | BREGMAN: EL PUERTO SE QUEDA CHICO | 9 | office |
| exp_bregman_puertos_fluviales_followup | IMPLEMENTACIÓN / BREGMAN: EL PUERTO SE QUEDA CHICO | 11 | office |
| exp_bregman_vivienda_suelo | BREGMAN: LOTES SIN SERVICIOS | 13 | office |
| exp_bregman_vivienda_suelo_followup | IMPLEMENTACIÓN / BREGMAN: LOTES SIN SERVICIOS | 15 | office |
| exp_bregman_fibra_rural | BREGMAN: EL ÚLTIMO KILÓMETRO DIGITAL | 17 | office |
| exp_bregman_fibra_rural_followup | IMPLEMENTACIÓN / BREGMAN: EL ÚLTIMO KILÓMETRO DIGITAL | 19 | office |
| exp_bregman_alquiler_temporal | BREGMAN: LA CIUDAD EN ALQUILER | 1 | congress |
| exp_bregman_alquiler_temporal_followup | IMPLEMENTACIÓN / BREGMAN: LA CIUDAD EN ALQUILER | 3 | congress |
| exp_bregman_litio_licencias | BREGMAN: LICENCIAS EN EL SALAR | 5 | congress |
| exp_bregman_litio_licencias_followup | IMPLEMENTACIÓN / BREGMAN: LICENCIAS EN EL SALAR | 7 | congress |
| exp_bregman_energia_distribuida | BREGMAN: PANELES EN LOS TECHOS | 9 | congress |
| exp_bregman_energia_distribuida_followup | IMPLEMENTACIÓN / BREGMAN: PANELES EN LOS TECHOS | 11 | congress |
| exp_bregman_datos_personales | BREGMAN: ¿DE QUIÉN SON LOS DATOS? | 13 | congress |
| exp_bregman_datos_personales_followup | IMPLEMENTACIÓN / BREGMAN: ¿DE QUIÉN SON LOS DATOS? | 15 | congress |
| exp_bregman_pesca_cuotas | BREGMAN: CUOTAS EN EL MAR | 17 | congress |
| exp_bregman_pesca_cuotas_followup | IMPLEMENTACIÓN / BREGMAN: CUOTAS EN EL MAR | 19 | congress |
| exp_bregman_guardias_hospital | BREGMAN: LA GUARDIA NO DA ABASTO | 1 | office |
| exp_bregman_guardias_hospital_followup | IMPLEMENTACIÓN / BREGMAN: LA GUARDIA NO DA ABASTO | 3 | office |
| exp_bregman_comedores_escolares | BREGMAN: UN PLATO EN LA ESCUELA | 5 | office |
| exp_bregman_comedores_escolares_followup | IMPLEMENTACIÓN / BREGMAN: UN PLATO EN LA ESCUELA | 7 | office |
| exp_bregman_discapacidad_acceso | BREGMAN: RAMPAS Y DERECHOS | 9 | office |
| exp_bregman_discapacidad_acceso_followup | IMPLEMENTACIÓN / BREGMAN: RAMPAS Y DERECHOS | 11 | office |
| exp_bregman_salud_mental | BREGMAN: UNA RED DE ESCUCHA | 13 | office |
| exp_bregman_salud_mental_followup | IMPLEMENTACIÓN / BREGMAN: UNA RED DE ESCUCHA | 15 | office |
| exp_bregman_cuidados_mayores | BREGMAN: QUIÉN CUIDA A LOS MAYORES | 17 | office |
| exp_bregman_cuidados_mayores_followup | IMPLEMENTACIÓN / BREGMAN: QUIÉN CUIDA A LOS MAYORES | 19 | office |
| exp_bregman_plataformas_reparto | BREGMAN: EL REPARTO Y LOS DERECHOS | 1 | congress |
| exp_bregman_plataformas_reparto_followup | IMPLEMENTACIÓN / BREGMAN: EL REPARTO Y LOS DERECHOS | 3 | congress |
| exp_bregman_cosecha_temporal | BREGMAN: TRABAJO DE COSECHA | 5 | congress |
| exp_bregman_cosecha_temporal_followup | IMPLEMENTACIÓN / BREGMAN: TRABAJO DE COSECHA | 7 | congress |
| exp_bregman_reconversion_autopartes | BREGMAN: LA FÁBRICA CAMBIA DE MOTOR | 9 | congress |
| exp_bregman_reconversion_autopartes_followup | IMPLEMENTACIÓN / BREGMAN: LA FÁBRICA CAMBIA DE MOTOR | 11 | congress |
| exp_bregman_enfermeria_turnos | BREGMAN: TURNOS QUE AGOTAN | 13 | congress |
| exp_bregman_enfermeria_turnos_followup | IMPLEMENTACIÓN / BREGMAN: TURNOS QUE AGOTAN | 15 | congress |
| exp_bregman_teletrabajo | BREGMAN: LA OFICINA EN CASA | 17 | congress |
| exp_bregman_teletrabajo_followup | IMPLEMENTACIÓN / BREGMAN: LA OFICINA EN CASA | 19 | congress |
| exp_bregman_seguridad_estaciones | BREGMAN: ANDENES SIN CUIDADO | 1 | press |
| exp_bregman_seguridad_estaciones_followup | IMPLEMENTACIÓN / BREGMAN: ANDENES SIN CUIDADO | 3 | press |
| exp_bregman_ciberfraude | BREGMAN: ESTAFAS EN EL TELÉFONO | 5 | press |
| exp_bregman_ciberfraude_followup | IMPLEMENTACIÓN / BREGMAN: ESTAFAS EN EL TELÉFONO | 7 | press |
| exp_bregman_incendios_brigadas | BREGMAN: BRIGADAS EN ALERTA | 9 | press |
| exp_bregman_incendios_brigadas_followup | IMPLEMENTACIÓN / BREGMAN: BRIGADAS EN ALERTA | 11 | press |
| exp_bregman_violencia_estadios | BREGMAN: EL PARTIDO FUERA DE LA CANCHA | 13 | press |
| exp_bregman_violencia_estadios_followup | IMPLEMENTACIÓN / BREGMAN: EL PARTIDO FUERA DE LA CANCHA | 15 | press |
| exp_bregman_alerta_inundacion | BREGMAN: LA SIRENA ANTES DEL AGUA | 17 | press |
| exp_bregman_alerta_inundacion_followup | IMPLEMENTACIÓN / BREGMAN: LA SIRENA ANTES DEL AGUA | 19 | press |
| exp_bregman_hospitales_federales | BREGMAN: EL HOSPITAL Y LOS VOTOS | 1 | congress |
| exp_bregman_hospitales_federales_followup | IMPLEMENTACIÓN / BREGMAN: EL HOSPITAL Y LOS VOTOS | 3 | congress |
| exp_bregman_calendario_escolar | BREGMAN: UN CALENDARIO, MUCHAS PROVINCIAS | 5 | congress |
| exp_bregman_calendario_escolar_followup | IMPLEMENTACIÓN / BREGMAN: UN CALENDARIO, MUCHAS PROVINCIAS | 7 | congress |
| exp_bregman_transporte_metropolitano | BREGMAN: QUIÉN PAGA EL COLECTIVO | 9 | congress |
| exp_bregman_transporte_metropolitano_followup | IMPLEMENTACIÓN / BREGMAN: QUIÉN PAGA EL COLECTIVO | 11 | congress |
| exp_bregman_justicia_provincias | BREGMAN: TRIBUNALES Y ACUERDOS | 13 | congress |
| exp_bregman_justicia_provincias_followup | IMPLEMENTACIÓN / BREGMAN: TRIBUNALES Y ACUERDOS | 15 | congress |
| exp_bregman_bosques_federal | BREGMAN: EL FONDO DEL BOSQUE | 17 | congress |
| exp_bregman_bosques_federal_followup | IMPLEMENTACIÓN / BREGMAN: EL FONDO DEL BOSQUE | 19 | congress |
| exp_bregman_mercosur_fronteras | BREGMAN: CAMIONES EN LA FRONTERA | 1 | diplomacy |
| exp_bregman_mercosur_fronteras_followup | IMPLEMENTACIÓN / BREGMAN: CAMIONES EN LA FRONTERA | 3 | diplomacy |
| exp_bregman_vacunas_acuerdo | BREGMAN: VACUNAS SIN FRONTERAS | 5 | diplomacy |
| exp_bregman_vacunas_acuerdo_followup | IMPLEMENTACIÓN / BREGMAN: VACUNAS SIN FRONTERAS | 7 | diplomacy |
| exp_bregman_antartida_cooperacion | BREGMAN: COOPERACIÓN EN EL HIELO | 9 | diplomacy |
| exp_bregman_antartida_cooperacion_followup | IMPLEMENTACIÓN / BREGMAN: COOPERACIÓN EN EL HIELO | 11 | diplomacy |
| exp_bregman_remesas_regionales | BREGMAN: EL COSTO DE ENVIAR DINERO | 13 | diplomacy |
| exp_bregman_remesas_regionales_followup | IMPLEMENTACIÓN / BREGMAN: EL COSTO DE ENVIAR DINERO | 15 | diplomacy |
| exp_bregman_exportacion_alimentos | BREGMAN: UN MERCADO PARA LA COSECHA | 17 | diplomacy |
| exp_bregman_exportacion_alimentos_followup | IMPLEMENTACIÓN / BREGMAN: UN MERCADO PARA LA COSECHA | 19 | diplomacy |
| exp_bregman_compras_medicamentos | BREGMAN: EL PRECIO DE LA PASTILLA | 1 | press |
| exp_bregman_compras_medicamentos_followup | IMPLEMENTACIÓN / BREGMAN: EL PRECIO DE LA PASTILLA | 3 | press |
| exp_bregman_publicidad_oficial | BREGMAN: LA PAUTA A LA VISTA | 5 | press |
| exp_bregman_publicidad_oficial_followup | IMPLEMENTACIÓN / BREGMAN: LA PAUTA A LA VISTA | 7 | press |
| exp_bregman_licitacion_escuelas | BREGMAN: AULAS Y SOBRES CERRADOS | 9 | press |
| exp_bregman_licitacion_escuelas_followup | IMPLEMENTACIÓN / BREGMAN: AULAS Y SOBRES CERRADOS | 11 | press |
| exp_bregman_patrimonio_funcionarios | BREGMAN: DECLARACIONES PENDIENTES | 13 | press |
| exp_bregman_patrimonio_funcionarios_followup | IMPLEMENTACIÓN / BREGMAN: DECLARACIONES PENDIENTES | 15 | press |
| exp_bregman_algoritmos_estado | BREGMAN: EL ALGORITMO DECIDE | 17 | press |
| exp_bregman_algoritmos_estado_followup | IMPLEMENTACIÓN / BREGMAN: EL ALGORITMO DECIDE | 19 | press |
| exp_bregman_satelite_incendios | BREGMAN: OJOS SOBRE EL FUEGO | 1 | office |
| exp_bregman_satelite_incendios_followup | IMPLEMENTACIÓN / BREGMAN: OJOS SOBRE EL FUEGO | 3 | office |
| exp_bregman_semillas_sequia | BREGMAN: SEMILLAS CONTRA LA SEQUÍA | 5 | office |
| exp_bregman_semillas_sequia_followup | IMPLEMENTACIÓN / BREGMAN: SEMILLAS CONTRA LA SEQUÍA | 7 | office |
| exp_bregman_reactor_medicina | BREGMAN: CIENCIA PARA EL DIAGNÓSTICO | 9 | office |
| exp_bregman_reactor_medicina_followup | IMPLEMENTACIÓN / BREGMAN: CIENCIA PARA EL DIAGNÓSTICO | 11 | office |
| exp_bregman_baterias_nacionales | BREGMAN: DEL MINERAL A LA BATERÍA | 13 | office |
| exp_bregman_baterias_nacionales_followup | IMPLEMENTACIÓN / BREGMAN: DEL MINERAL A LA BATERÍA | 15 | office |
| exp_bregman_resistencia_antibioticos | BREGMAN: BACTERIAS QUE RESISTEN | 17 | office |
| exp_bregman_resistencia_antibioticos_followup | IMPLEMENTACIÓN / BREGMAN: BACTERIAS QUE RESISTEN | 19 | office |

## Schiaretti

| ID | Tarjeta | Turno mínimo | Escena |
| --- | --- | --- | --- |
| exp_schiaretti_subsidios_agua | SCHIARETTI: LA FACTURA DEL AGUA | 1 | office |
| exp_schiaretti_subsidios_agua_followup | IMPLEMENTACIÓN / SCHIARETTI: LA FACTURA DEL AGUA | 3 | office |
| exp_schiaretti_cajas_previsionales | SCHIARETTI: CAJAS EN ROJO | 5 | office |
| exp_schiaretti_cajas_previsionales_followup | IMPLEMENTACIÓN / SCHIARETTI: CAJAS EN ROJO | 7 | office |
| exp_schiaretti_aduana_digital | SCHIARETTI: LA ADUANA Y LOS PAPELES | 9 | office |
| exp_schiaretti_aduana_digital_followup | IMPLEMENTACIÓN / SCHIARETTI: LA ADUANA Y LOS PAPELES | 11 | office |
| exp_schiaretti_impuesto_inmuebles | SCHIARETTI: EL MAPA DEL IMPUESTO | 13 | office |
| exp_schiaretti_impuesto_inmuebles_followup | IMPLEMENTACIÓN / SCHIARETTI: EL MAPA DEL IMPUESTO | 15 | office |
| exp_schiaretti_gasto_tributario | SCHIARETTI: EXENCIONES BAJO LA LUPA | 17 | office |
| exp_schiaretti_gasto_tributario_followup | IMPLEMENTACIÓN / SCHIARETTI: EXENCIONES BAJO LA LUPA | 19 | office |
| exp_schiaretti_red_agua | SCHIARETTI: AGUA PARA EL INTERIOR | 1 | office |
| exp_schiaretti_red_agua_followup | IMPLEMENTACIÓN / SCHIARETTI: AGUA PARA EL INTERIOR | 3 | office |
| exp_schiaretti_trenes_carga | SCHIARETTI: VÍAS PARA LA COSECHA | 5 | office |
| exp_schiaretti_trenes_carga_followup | IMPLEMENTACIÓN / SCHIARETTI: VÍAS PARA LA COSECHA | 7 | office |
| exp_schiaretti_puertos_fluviales | SCHIARETTI: EL PUERTO SE QUEDA CHICO | 9 | office |
| exp_schiaretti_puertos_fluviales_followup | IMPLEMENTACIÓN / SCHIARETTI: EL PUERTO SE QUEDA CHICO | 11 | office |
| exp_schiaretti_vivienda_suelo | SCHIARETTI: LOTES SIN SERVICIOS | 13 | office |
| exp_schiaretti_vivienda_suelo_followup | IMPLEMENTACIÓN / SCHIARETTI: LOTES SIN SERVICIOS | 15 | office |
| exp_schiaretti_fibra_rural | SCHIARETTI: EL ÚLTIMO KILÓMETRO DIGITAL | 17 | office |
| exp_schiaretti_fibra_rural_followup | IMPLEMENTACIÓN / SCHIARETTI: EL ÚLTIMO KILÓMETRO DIGITAL | 19 | office |
| exp_schiaretti_alquiler_temporal | SCHIARETTI: LA CIUDAD EN ALQUILER | 1 | congress |
| exp_schiaretti_alquiler_temporal_followup | IMPLEMENTACIÓN / SCHIARETTI: LA CIUDAD EN ALQUILER | 3 | congress |
| exp_schiaretti_litio_licencias | SCHIARETTI: LICENCIAS EN EL SALAR | 5 | congress |
| exp_schiaretti_litio_licencias_followup | IMPLEMENTACIÓN / SCHIARETTI: LICENCIAS EN EL SALAR | 7 | congress |
| exp_schiaretti_energia_distribuida | SCHIARETTI: PANELES EN LOS TECHOS | 9 | congress |
| exp_schiaretti_energia_distribuida_followup | IMPLEMENTACIÓN / SCHIARETTI: PANELES EN LOS TECHOS | 11 | congress |
| exp_schiaretti_datos_personales | SCHIARETTI: ¿DE QUIÉN SON LOS DATOS? | 13 | congress |
| exp_schiaretti_datos_personales_followup | IMPLEMENTACIÓN / SCHIARETTI: ¿DE QUIÉN SON LOS DATOS? | 15 | congress |
| exp_schiaretti_pesca_cuotas | SCHIARETTI: CUOTAS EN EL MAR | 17 | congress |
| exp_schiaretti_pesca_cuotas_followup | IMPLEMENTACIÓN / SCHIARETTI: CUOTAS EN EL MAR | 19 | congress |
| exp_schiaretti_guardias_hospital | SCHIARETTI: LA GUARDIA NO DA ABASTO | 1 | office |
| exp_schiaretti_guardias_hospital_followup | IMPLEMENTACIÓN / SCHIARETTI: LA GUARDIA NO DA ABASTO | 3 | office |
| exp_schiaretti_comedores_escolares | SCHIARETTI: UN PLATO EN LA ESCUELA | 5 | office |
| exp_schiaretti_comedores_escolares_followup | IMPLEMENTACIÓN / SCHIARETTI: UN PLATO EN LA ESCUELA | 7 | office |
| exp_schiaretti_discapacidad_acceso | SCHIARETTI: RAMPAS Y DERECHOS | 9 | office |
| exp_schiaretti_discapacidad_acceso_followup | IMPLEMENTACIÓN / SCHIARETTI: RAMPAS Y DERECHOS | 11 | office |
| exp_schiaretti_salud_mental | SCHIARETTI: UNA RED DE ESCUCHA | 13 | office |
| exp_schiaretti_salud_mental_followup | IMPLEMENTACIÓN / SCHIARETTI: UNA RED DE ESCUCHA | 15 | office |
| exp_schiaretti_cuidados_mayores | SCHIARETTI: QUIÉN CUIDA A LOS MAYORES | 17 | office |
| exp_schiaretti_cuidados_mayores_followup | IMPLEMENTACIÓN / SCHIARETTI: QUIÉN CUIDA A LOS MAYORES | 19 | office |
| exp_schiaretti_plataformas_reparto | SCHIARETTI: EL REPARTO Y LOS DERECHOS | 1 | congress |
| exp_schiaretti_plataformas_reparto_followup | IMPLEMENTACIÓN / SCHIARETTI: EL REPARTO Y LOS DERECHOS | 3 | congress |
| exp_schiaretti_cosecha_temporal | SCHIARETTI: TRABAJO DE COSECHA | 5 | congress |
| exp_schiaretti_cosecha_temporal_followup | IMPLEMENTACIÓN / SCHIARETTI: TRABAJO DE COSECHA | 7 | congress |
| exp_schiaretti_reconversion_autopartes | SCHIARETTI: LA FÁBRICA CAMBIA DE MOTOR | 9 | congress |
| exp_schiaretti_reconversion_autopartes_followup | IMPLEMENTACIÓN / SCHIARETTI: LA FÁBRICA CAMBIA DE MOTOR | 11 | congress |
| exp_schiaretti_enfermeria_turnos | SCHIARETTI: TURNOS QUE AGOTAN | 13 | congress |
| exp_schiaretti_enfermeria_turnos_followup | IMPLEMENTACIÓN / SCHIARETTI: TURNOS QUE AGOTAN | 15 | congress |
| exp_schiaretti_teletrabajo | SCHIARETTI: LA OFICINA EN CASA | 17 | congress |
| exp_schiaretti_teletrabajo_followup | IMPLEMENTACIÓN / SCHIARETTI: LA OFICINA EN CASA | 19 | congress |
| exp_schiaretti_seguridad_estaciones | SCHIARETTI: ANDENES SIN CUIDADO | 1 | press |
| exp_schiaretti_seguridad_estaciones_followup | IMPLEMENTACIÓN / SCHIARETTI: ANDENES SIN CUIDADO | 3 | press |
| exp_schiaretti_ciberfraude | SCHIARETTI: ESTAFAS EN EL TELÉFONO | 5 | press |
| exp_schiaretti_ciberfraude_followup | IMPLEMENTACIÓN / SCHIARETTI: ESTAFAS EN EL TELÉFONO | 7 | press |
| exp_schiaretti_incendios_brigadas | SCHIARETTI: BRIGADAS EN ALERTA | 9 | press |
| exp_schiaretti_incendios_brigadas_followup | IMPLEMENTACIÓN / SCHIARETTI: BRIGADAS EN ALERTA | 11 | press |
| exp_schiaretti_violencia_estadios | SCHIARETTI: EL PARTIDO FUERA DE LA CANCHA | 13 | press |
| exp_schiaretti_violencia_estadios_followup | IMPLEMENTACIÓN / SCHIARETTI: EL PARTIDO FUERA DE LA CANCHA | 15 | press |
| exp_schiaretti_alerta_inundacion | SCHIARETTI: LA SIRENA ANTES DEL AGUA | 17 | press |
| exp_schiaretti_alerta_inundacion_followup | IMPLEMENTACIÓN / SCHIARETTI: LA SIRENA ANTES DEL AGUA | 19 | press |
| exp_schiaretti_hospitales_federales | SCHIARETTI: EL HOSPITAL Y LOS VOTOS | 1 | congress |
| exp_schiaretti_hospitales_federales_followup | IMPLEMENTACIÓN / SCHIARETTI: EL HOSPITAL Y LOS VOTOS | 3 | congress |
| exp_schiaretti_calendario_escolar | SCHIARETTI: UN CALENDARIO, MUCHAS PROVINCIAS | 5 | congress |
| exp_schiaretti_calendario_escolar_followup | IMPLEMENTACIÓN / SCHIARETTI: UN CALENDARIO, MUCHAS PROVINCIAS | 7 | congress |
| exp_schiaretti_transporte_metropolitano | SCHIARETTI: QUIÉN PAGA EL COLECTIVO | 9 | congress |
| exp_schiaretti_transporte_metropolitano_followup | IMPLEMENTACIÓN / SCHIARETTI: QUIÉN PAGA EL COLECTIVO | 11 | congress |
| exp_schiaretti_justicia_provincias | SCHIARETTI: TRIBUNALES Y ACUERDOS | 13 | congress |
| exp_schiaretti_justicia_provincias_followup | IMPLEMENTACIÓN / SCHIARETTI: TRIBUNALES Y ACUERDOS | 15 | congress |
| exp_schiaretti_bosques_federal | SCHIARETTI: EL FONDO DEL BOSQUE | 17 | congress |
| exp_schiaretti_bosques_federal_followup | IMPLEMENTACIÓN / SCHIARETTI: EL FONDO DEL BOSQUE | 19 | congress |
| exp_schiaretti_mercosur_fronteras | SCHIARETTI: CAMIONES EN LA FRONTERA | 1 | diplomacy |
| exp_schiaretti_mercosur_fronteras_followup | IMPLEMENTACIÓN / SCHIARETTI: CAMIONES EN LA FRONTERA | 3 | diplomacy |
| exp_schiaretti_vacunas_acuerdo | SCHIARETTI: VACUNAS SIN FRONTERAS | 5 | diplomacy |
| exp_schiaretti_vacunas_acuerdo_followup | IMPLEMENTACIÓN / SCHIARETTI: VACUNAS SIN FRONTERAS | 7 | diplomacy |
| exp_schiaretti_antartida_cooperacion | SCHIARETTI: COOPERACIÓN EN EL HIELO | 9 | diplomacy |
| exp_schiaretti_antartida_cooperacion_followup | IMPLEMENTACIÓN / SCHIARETTI: COOPERACIÓN EN EL HIELO | 11 | diplomacy |
| exp_schiaretti_remesas_regionales | SCHIARETTI: EL COSTO DE ENVIAR DINERO | 13 | diplomacy |
| exp_schiaretti_remesas_regionales_followup | IMPLEMENTACIÓN / SCHIARETTI: EL COSTO DE ENVIAR DINERO | 15 | diplomacy |
| exp_schiaretti_exportacion_alimentos | SCHIARETTI: UN MERCADO PARA LA COSECHA | 17 | diplomacy |
| exp_schiaretti_exportacion_alimentos_followup | IMPLEMENTACIÓN / SCHIARETTI: UN MERCADO PARA LA COSECHA | 19 | diplomacy |
| exp_schiaretti_compras_medicamentos | SCHIARETTI: EL PRECIO DE LA PASTILLA | 1 | press |
| exp_schiaretti_compras_medicamentos_followup | IMPLEMENTACIÓN / SCHIARETTI: EL PRECIO DE LA PASTILLA | 3 | press |
| exp_schiaretti_publicidad_oficial | SCHIARETTI: LA PAUTA A LA VISTA | 5 | press |
| exp_schiaretti_publicidad_oficial_followup | IMPLEMENTACIÓN / SCHIARETTI: LA PAUTA A LA VISTA | 7 | press |
| exp_schiaretti_licitacion_escuelas | SCHIARETTI: AULAS Y SOBRES CERRADOS | 9 | press |
| exp_schiaretti_licitacion_escuelas_followup | IMPLEMENTACIÓN / SCHIARETTI: AULAS Y SOBRES CERRADOS | 11 | press |
| exp_schiaretti_patrimonio_funcionarios | SCHIARETTI: DECLARACIONES PENDIENTES | 13 | press |
| exp_schiaretti_patrimonio_funcionarios_followup | IMPLEMENTACIÓN / SCHIARETTI: DECLARACIONES PENDIENTES | 15 | press |
| exp_schiaretti_algoritmos_estado | SCHIARETTI: EL ALGORITMO DECIDE | 17 | press |
| exp_schiaretti_algoritmos_estado_followup | IMPLEMENTACIÓN / SCHIARETTI: EL ALGORITMO DECIDE | 19 | press |
| exp_schiaretti_satelite_incendios | SCHIARETTI: OJOS SOBRE EL FUEGO | 1 | office |
| exp_schiaretti_satelite_incendios_followup | IMPLEMENTACIÓN / SCHIARETTI: OJOS SOBRE EL FUEGO | 3 | office |
| exp_schiaretti_semillas_sequia | SCHIARETTI: SEMILLAS CONTRA LA SEQUÍA | 5 | office |
| exp_schiaretti_semillas_sequia_followup | IMPLEMENTACIÓN / SCHIARETTI: SEMILLAS CONTRA LA SEQUÍA | 7 | office |
| exp_schiaretti_reactor_medicina | SCHIARETTI: CIENCIA PARA EL DIAGNÓSTICO | 9 | office |
| exp_schiaretti_reactor_medicina_followup | IMPLEMENTACIÓN / SCHIARETTI: CIENCIA PARA EL DIAGNÓSTICO | 11 | office |
| exp_schiaretti_baterias_nacionales | SCHIARETTI: DEL MINERAL A LA BATERÍA | 13 | office |
| exp_schiaretti_baterias_nacionales_followup | IMPLEMENTACIÓN / SCHIARETTI: DEL MINERAL A LA BATERÍA | 15 | office |
| exp_schiaretti_resistencia_antibioticos | SCHIARETTI: BACTERIAS QUE RESISTEN | 17 | office |
| exp_schiaretti_resistencia_antibioticos_followup | IMPLEMENTACIÓN / SCHIARETTI: BACTERIAS QUE RESISTEN | 19 | office |

## Larreta

| ID | Tarjeta | Turno mínimo | Escena |
| --- | --- | --- | --- |
| exp_larreta_subsidios_agua | LARRETA: LA FACTURA DEL AGUA | 1 | office |
| exp_larreta_subsidios_agua_followup | IMPLEMENTACIÓN / LARRETA: LA FACTURA DEL AGUA | 3 | office |
| exp_larreta_cajas_previsionales | LARRETA: CAJAS EN ROJO | 5 | office |
| exp_larreta_cajas_previsionales_followup | IMPLEMENTACIÓN / LARRETA: CAJAS EN ROJO | 7 | office |
| exp_larreta_aduana_digital | LARRETA: LA ADUANA Y LOS PAPELES | 9 | office |
| exp_larreta_aduana_digital_followup | IMPLEMENTACIÓN / LARRETA: LA ADUANA Y LOS PAPELES | 11 | office |
| exp_larreta_impuesto_inmuebles | LARRETA: EL MAPA DEL IMPUESTO | 13 | office |
| exp_larreta_impuesto_inmuebles_followup | IMPLEMENTACIÓN / LARRETA: EL MAPA DEL IMPUESTO | 15 | office |
| exp_larreta_gasto_tributario | LARRETA: EXENCIONES BAJO LA LUPA | 17 | office |
| exp_larreta_gasto_tributario_followup | IMPLEMENTACIÓN / LARRETA: EXENCIONES BAJO LA LUPA | 19 | office |
| exp_larreta_red_agua | LARRETA: AGUA PARA EL INTERIOR | 1 | office |
| exp_larreta_red_agua_followup | IMPLEMENTACIÓN / LARRETA: AGUA PARA EL INTERIOR | 3 | office |
| exp_larreta_trenes_carga | LARRETA: VÍAS PARA LA COSECHA | 5 | office |
| exp_larreta_trenes_carga_followup | IMPLEMENTACIÓN / LARRETA: VÍAS PARA LA COSECHA | 7 | office |
| exp_larreta_puertos_fluviales | LARRETA: EL PUERTO SE QUEDA CHICO | 9 | office |
| exp_larreta_puertos_fluviales_followup | IMPLEMENTACIÓN / LARRETA: EL PUERTO SE QUEDA CHICO | 11 | office |
| exp_larreta_vivienda_suelo | LARRETA: LOTES SIN SERVICIOS | 13 | office |
| exp_larreta_vivienda_suelo_followup | IMPLEMENTACIÓN / LARRETA: LOTES SIN SERVICIOS | 15 | office |
| exp_larreta_fibra_rural | LARRETA: EL ÚLTIMO KILÓMETRO DIGITAL | 17 | office |
| exp_larreta_fibra_rural_followup | IMPLEMENTACIÓN / LARRETA: EL ÚLTIMO KILÓMETRO DIGITAL | 19 | office |
| exp_larreta_alquiler_temporal | LARRETA: LA CIUDAD EN ALQUILER | 1 | congress |
| exp_larreta_alquiler_temporal_followup | IMPLEMENTACIÓN / LARRETA: LA CIUDAD EN ALQUILER | 3 | congress |
| exp_larreta_litio_licencias | LARRETA: LICENCIAS EN EL SALAR | 5 | congress |
| exp_larreta_litio_licencias_followup | IMPLEMENTACIÓN / LARRETA: LICENCIAS EN EL SALAR | 7 | congress |
| exp_larreta_energia_distribuida | LARRETA: PANELES EN LOS TECHOS | 9 | congress |
| exp_larreta_energia_distribuida_followup | IMPLEMENTACIÓN / LARRETA: PANELES EN LOS TECHOS | 11 | congress |
| exp_larreta_datos_personales | LARRETA: ¿DE QUIÉN SON LOS DATOS? | 13 | congress |
| exp_larreta_datos_personales_followup | IMPLEMENTACIÓN / LARRETA: ¿DE QUIÉN SON LOS DATOS? | 15 | congress |
| exp_larreta_pesca_cuotas | LARRETA: CUOTAS EN EL MAR | 17 | congress |
| exp_larreta_pesca_cuotas_followup | IMPLEMENTACIÓN / LARRETA: CUOTAS EN EL MAR | 19 | congress |
| exp_larreta_guardias_hospital | LARRETA: LA GUARDIA NO DA ABASTO | 1 | office |
| exp_larreta_guardias_hospital_followup | IMPLEMENTACIÓN / LARRETA: LA GUARDIA NO DA ABASTO | 3 | office |
| exp_larreta_comedores_escolares | LARRETA: UN PLATO EN LA ESCUELA | 5 | office |
| exp_larreta_comedores_escolares_followup | IMPLEMENTACIÓN / LARRETA: UN PLATO EN LA ESCUELA | 7 | office |
| exp_larreta_discapacidad_acceso | LARRETA: RAMPAS Y DERECHOS | 9 | office |
| exp_larreta_discapacidad_acceso_followup | IMPLEMENTACIÓN / LARRETA: RAMPAS Y DERECHOS | 11 | office |
| exp_larreta_salud_mental | LARRETA: UNA RED DE ESCUCHA | 13 | office |
| exp_larreta_salud_mental_followup | IMPLEMENTACIÓN / LARRETA: UNA RED DE ESCUCHA | 15 | office |
| exp_larreta_cuidados_mayores | LARRETA: QUIÉN CUIDA A LOS MAYORES | 17 | office |
| exp_larreta_cuidados_mayores_followup | IMPLEMENTACIÓN / LARRETA: QUIÉN CUIDA A LOS MAYORES | 19 | office |
| exp_larreta_plataformas_reparto | LARRETA: EL REPARTO Y LOS DERECHOS | 1 | congress |
| exp_larreta_plataformas_reparto_followup | IMPLEMENTACIÓN / LARRETA: EL REPARTO Y LOS DERECHOS | 3 | congress |
| exp_larreta_cosecha_temporal | LARRETA: TRABAJO DE COSECHA | 5 | congress |
| exp_larreta_cosecha_temporal_followup | IMPLEMENTACIÓN / LARRETA: TRABAJO DE COSECHA | 7 | congress |
| exp_larreta_reconversion_autopartes | LARRETA: LA FÁBRICA CAMBIA DE MOTOR | 9 | congress |
| exp_larreta_reconversion_autopartes_followup | IMPLEMENTACIÓN / LARRETA: LA FÁBRICA CAMBIA DE MOTOR | 11 | congress |
| exp_larreta_enfermeria_turnos | LARRETA: TURNOS QUE AGOTAN | 13 | congress |
| exp_larreta_enfermeria_turnos_followup | IMPLEMENTACIÓN / LARRETA: TURNOS QUE AGOTAN | 15 | congress |
| exp_larreta_teletrabajo | LARRETA: LA OFICINA EN CASA | 17 | congress |
| exp_larreta_teletrabajo_followup | IMPLEMENTACIÓN / LARRETA: LA OFICINA EN CASA | 19 | congress |
| exp_larreta_seguridad_estaciones | LARRETA: ANDENES SIN CUIDADO | 1 | press |
| exp_larreta_seguridad_estaciones_followup | IMPLEMENTACIÓN / LARRETA: ANDENES SIN CUIDADO | 3 | press |
| exp_larreta_ciberfraude | LARRETA: ESTAFAS EN EL TELÉFONO | 5 | press |
| exp_larreta_ciberfraude_followup | IMPLEMENTACIÓN / LARRETA: ESTAFAS EN EL TELÉFONO | 7 | press |
| exp_larreta_incendios_brigadas | LARRETA: BRIGADAS EN ALERTA | 9 | press |
| exp_larreta_incendios_brigadas_followup | IMPLEMENTACIÓN / LARRETA: BRIGADAS EN ALERTA | 11 | press |
| exp_larreta_violencia_estadios | LARRETA: EL PARTIDO FUERA DE LA CANCHA | 13 | press |
| exp_larreta_violencia_estadios_followup | IMPLEMENTACIÓN / LARRETA: EL PARTIDO FUERA DE LA CANCHA | 15 | press |
| exp_larreta_alerta_inundacion | LARRETA: LA SIRENA ANTES DEL AGUA | 17 | press |
| exp_larreta_alerta_inundacion_followup | IMPLEMENTACIÓN / LARRETA: LA SIRENA ANTES DEL AGUA | 19 | press |
| exp_larreta_hospitales_federales | LARRETA: EL HOSPITAL Y LOS VOTOS | 1 | congress |
| exp_larreta_hospitales_federales_followup | IMPLEMENTACIÓN / LARRETA: EL HOSPITAL Y LOS VOTOS | 3 | congress |
| exp_larreta_calendario_escolar | LARRETA: UN CALENDARIO, MUCHAS PROVINCIAS | 5 | congress |
| exp_larreta_calendario_escolar_followup | IMPLEMENTACIÓN / LARRETA: UN CALENDARIO, MUCHAS PROVINCIAS | 7 | congress |
| exp_larreta_transporte_metropolitano | LARRETA: QUIÉN PAGA EL COLECTIVO | 9 | congress |
| exp_larreta_transporte_metropolitano_followup | IMPLEMENTACIÓN / LARRETA: QUIÉN PAGA EL COLECTIVO | 11 | congress |
| exp_larreta_justicia_provincias | LARRETA: TRIBUNALES Y ACUERDOS | 13 | congress |
| exp_larreta_justicia_provincias_followup | IMPLEMENTACIÓN / LARRETA: TRIBUNALES Y ACUERDOS | 15 | congress |
| exp_larreta_bosques_federal | LARRETA: EL FONDO DEL BOSQUE | 17 | congress |
| exp_larreta_bosques_federal_followup | IMPLEMENTACIÓN / LARRETA: EL FONDO DEL BOSQUE | 19 | congress |
| exp_larreta_mercosur_fronteras | LARRETA: CAMIONES EN LA FRONTERA | 1 | diplomacy |
| exp_larreta_mercosur_fronteras_followup | IMPLEMENTACIÓN / LARRETA: CAMIONES EN LA FRONTERA | 3 | diplomacy |
| exp_larreta_vacunas_acuerdo | LARRETA: VACUNAS SIN FRONTERAS | 5 | diplomacy |
| exp_larreta_vacunas_acuerdo_followup | IMPLEMENTACIÓN / LARRETA: VACUNAS SIN FRONTERAS | 7 | diplomacy |
| exp_larreta_antartida_cooperacion | LARRETA: COOPERACIÓN EN EL HIELO | 9 | diplomacy |
| exp_larreta_antartida_cooperacion_followup | IMPLEMENTACIÓN / LARRETA: COOPERACIÓN EN EL HIELO | 11 | diplomacy |
| exp_larreta_remesas_regionales | LARRETA: EL COSTO DE ENVIAR DINERO | 13 | diplomacy |
| exp_larreta_remesas_regionales_followup | IMPLEMENTACIÓN / LARRETA: EL COSTO DE ENVIAR DINERO | 15 | diplomacy |
| exp_larreta_exportacion_alimentos | LARRETA: UN MERCADO PARA LA COSECHA | 17 | diplomacy |
| exp_larreta_exportacion_alimentos_followup | IMPLEMENTACIÓN / LARRETA: UN MERCADO PARA LA COSECHA | 19 | diplomacy |
| exp_larreta_compras_medicamentos | LARRETA: EL PRECIO DE LA PASTILLA | 1 | press |
| exp_larreta_compras_medicamentos_followup | IMPLEMENTACIÓN / LARRETA: EL PRECIO DE LA PASTILLA | 3 | press |
| exp_larreta_publicidad_oficial | LARRETA: LA PAUTA A LA VISTA | 5 | press |
| exp_larreta_publicidad_oficial_followup | IMPLEMENTACIÓN / LARRETA: LA PAUTA A LA VISTA | 7 | press |
| exp_larreta_licitacion_escuelas | LARRETA: AULAS Y SOBRES CERRADOS | 9 | press |
| exp_larreta_licitacion_escuelas_followup | IMPLEMENTACIÓN / LARRETA: AULAS Y SOBRES CERRADOS | 11 | press |
| exp_larreta_patrimonio_funcionarios | LARRETA: DECLARACIONES PENDIENTES | 13 | press |
| exp_larreta_patrimonio_funcionarios_followup | IMPLEMENTACIÓN / LARRETA: DECLARACIONES PENDIENTES | 15 | press |
| exp_larreta_algoritmos_estado | LARRETA: EL ALGORITMO DECIDE | 17 | press |
| exp_larreta_algoritmos_estado_followup | IMPLEMENTACIÓN / LARRETA: EL ALGORITMO DECIDE | 19 | press |
| exp_larreta_satelite_incendios | LARRETA: OJOS SOBRE EL FUEGO | 1 | office |
| exp_larreta_satelite_incendios_followup | IMPLEMENTACIÓN / LARRETA: OJOS SOBRE EL FUEGO | 3 | office |
| exp_larreta_semillas_sequia | LARRETA: SEMILLAS CONTRA LA SEQUÍA | 5 | office |
| exp_larreta_semillas_sequia_followup | IMPLEMENTACIÓN / LARRETA: SEMILLAS CONTRA LA SEQUÍA | 7 | office |
| exp_larreta_reactor_medicina | LARRETA: CIENCIA PARA EL DIAGNÓSTICO | 9 | office |
| exp_larreta_reactor_medicina_followup | IMPLEMENTACIÓN / LARRETA: CIENCIA PARA EL DIAGNÓSTICO | 11 | office |
| exp_larreta_baterias_nacionales | LARRETA: DEL MINERAL A LA BATERÍA | 13 | office |
| exp_larreta_baterias_nacionales_followup | IMPLEMENTACIÓN / LARRETA: DEL MINERAL A LA BATERÍA | 15 | office |
| exp_larreta_resistencia_antibioticos | LARRETA: BACTERIAS QUE RESISTEN | 17 | office |
| exp_larreta_resistencia_antibioticos_followup | IMPLEMENTACIÓN / LARRETA: BACTERIAS QUE RESISTEN | 19 | office |

## Néstor Kirchner

| ID | Tarjeta | Turno mínimo | Escena |
| --- | --- | --- | --- |
| exp_nestor_subsidios_agua | NÉSTOR KIRCHNER: LA FACTURA DEL AGUA | 1 | office |
| exp_nestor_subsidios_agua_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: LA FACTURA DEL AGUA | 3 | office |
| exp_nestor_cajas_previsionales | NÉSTOR KIRCHNER: CAJAS EN ROJO | 5 | office |
| exp_nestor_cajas_previsionales_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: CAJAS EN ROJO | 7 | office |
| exp_nestor_aduana_digital | NÉSTOR KIRCHNER: LA ADUANA Y LOS PAPELES | 9 | office |
| exp_nestor_aduana_digital_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: LA ADUANA Y LOS PAPELES | 11 | office |
| exp_nestor_impuesto_inmuebles | NÉSTOR KIRCHNER: EL MAPA DEL IMPUESTO | 13 | office |
| exp_nestor_impuesto_inmuebles_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: EL MAPA DEL IMPUESTO | 15 | office |
| exp_nestor_gasto_tributario | NÉSTOR KIRCHNER: EXENCIONES BAJO LA LUPA | 17 | office |
| exp_nestor_gasto_tributario_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: EXENCIONES BAJO LA LUPA | 19 | office |
| exp_nestor_red_agua | NÉSTOR KIRCHNER: AGUA PARA EL INTERIOR | 1 | office |
| exp_nestor_red_agua_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: AGUA PARA EL INTERIOR | 3 | office |
| exp_nestor_trenes_carga | NÉSTOR KIRCHNER: VÍAS PARA LA COSECHA | 5 | office |
| exp_nestor_trenes_carga_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: VÍAS PARA LA COSECHA | 7 | office |
| exp_nestor_puertos_fluviales | NÉSTOR KIRCHNER: EL PUERTO SE QUEDA CHICO | 9 | office |
| exp_nestor_puertos_fluviales_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: EL PUERTO SE QUEDA CHICO | 11 | office |
| exp_nestor_vivienda_suelo | NÉSTOR KIRCHNER: LOTES SIN SERVICIOS | 13 | office |
| exp_nestor_vivienda_suelo_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: LOTES SIN SERVICIOS | 15 | office |
| exp_nestor_fibra_rural | NÉSTOR KIRCHNER: EL ÚLTIMO KILÓMETRO DIGITAL | 17 | office |
| exp_nestor_fibra_rural_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: EL ÚLTIMO KILÓMETRO DIGITAL | 19 | office |
| exp_nestor_alquiler_temporal | NÉSTOR KIRCHNER: LA CIUDAD EN ALQUILER | 1 | congress |
| exp_nestor_alquiler_temporal_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: LA CIUDAD EN ALQUILER | 3 | congress |
| exp_nestor_litio_licencias | NÉSTOR KIRCHNER: LICENCIAS EN EL SALAR | 5 | congress |
| exp_nestor_litio_licencias_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: LICENCIAS EN EL SALAR | 7 | congress |
| exp_nestor_energia_distribuida | NÉSTOR KIRCHNER: PANELES EN LOS TECHOS | 9 | congress |
| exp_nestor_energia_distribuida_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: PANELES EN LOS TECHOS | 11 | congress |
| exp_nestor_datos_personales | NÉSTOR KIRCHNER: ¿DE QUIÉN SON LOS DATOS? | 13 | congress |
| exp_nestor_datos_personales_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: ¿DE QUIÉN SON LOS DATOS? | 15 | congress |
| exp_nestor_pesca_cuotas | NÉSTOR KIRCHNER: CUOTAS EN EL MAR | 17 | congress |
| exp_nestor_pesca_cuotas_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: CUOTAS EN EL MAR | 19 | congress |
| exp_nestor_guardias_hospital | NÉSTOR KIRCHNER: LA GUARDIA NO DA ABASTO | 1 | office |
| exp_nestor_guardias_hospital_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: LA GUARDIA NO DA ABASTO | 3 | office |
| exp_nestor_comedores_escolares | NÉSTOR KIRCHNER: UN PLATO EN LA ESCUELA | 5 | office |
| exp_nestor_comedores_escolares_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: UN PLATO EN LA ESCUELA | 7 | office |
| exp_nestor_discapacidad_acceso | NÉSTOR KIRCHNER: RAMPAS Y DERECHOS | 9 | office |
| exp_nestor_discapacidad_acceso_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: RAMPAS Y DERECHOS | 11 | office |
| exp_nestor_salud_mental | NÉSTOR KIRCHNER: UNA RED DE ESCUCHA | 13 | office |
| exp_nestor_salud_mental_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: UNA RED DE ESCUCHA | 15 | office |
| exp_nestor_cuidados_mayores | NÉSTOR KIRCHNER: QUIÉN CUIDA A LOS MAYORES | 17 | office |
| exp_nestor_cuidados_mayores_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: QUIÉN CUIDA A LOS MAYORES | 19 | office |
| exp_nestor_plataformas_reparto | NÉSTOR KIRCHNER: EL REPARTO Y LOS DERECHOS | 1 | congress |
| exp_nestor_plataformas_reparto_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: EL REPARTO Y LOS DERECHOS | 3 | congress |
| exp_nestor_cosecha_temporal | NÉSTOR KIRCHNER: TRABAJO DE COSECHA | 5 | congress |
| exp_nestor_cosecha_temporal_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: TRABAJO DE COSECHA | 7 | congress |
| exp_nestor_reconversion_autopartes | NÉSTOR KIRCHNER: LA FÁBRICA CAMBIA DE MOTOR | 9 | congress |
| exp_nestor_reconversion_autopartes_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: LA FÁBRICA CAMBIA DE MOTOR | 11 | congress |
| exp_nestor_enfermeria_turnos | NÉSTOR KIRCHNER: TURNOS QUE AGOTAN | 13 | congress |
| exp_nestor_enfermeria_turnos_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: TURNOS QUE AGOTAN | 15 | congress |
| exp_nestor_teletrabajo | NÉSTOR KIRCHNER: LA OFICINA EN CASA | 17 | congress |
| exp_nestor_teletrabajo_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: LA OFICINA EN CASA | 19 | congress |
| exp_nestor_seguridad_estaciones | NÉSTOR KIRCHNER: ANDENES SIN CUIDADO | 1 | press |
| exp_nestor_seguridad_estaciones_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: ANDENES SIN CUIDADO | 3 | press |
| exp_nestor_ciberfraude | NÉSTOR KIRCHNER: ESTAFAS EN EL TELÉFONO | 5 | press |
| exp_nestor_ciberfraude_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: ESTAFAS EN EL TELÉFONO | 7 | press |
| exp_nestor_incendios_brigadas | NÉSTOR KIRCHNER: BRIGADAS EN ALERTA | 9 | press |
| exp_nestor_incendios_brigadas_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: BRIGADAS EN ALERTA | 11 | press |
| exp_nestor_violencia_estadios | NÉSTOR KIRCHNER: EL PARTIDO FUERA DE LA CANCHA | 13 | press |
| exp_nestor_violencia_estadios_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: EL PARTIDO FUERA DE LA CANCHA | 15 | press |
| exp_nestor_alerta_inundacion | NÉSTOR KIRCHNER: LA SIRENA ANTES DEL AGUA | 17 | press |
| exp_nestor_alerta_inundacion_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: LA SIRENA ANTES DEL AGUA | 19 | press |
| exp_nestor_hospitales_federales | NÉSTOR KIRCHNER: EL HOSPITAL Y LOS VOTOS | 1 | congress |
| exp_nestor_hospitales_federales_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: EL HOSPITAL Y LOS VOTOS | 3 | congress |
| exp_nestor_calendario_escolar | NÉSTOR KIRCHNER: UN CALENDARIO, MUCHAS PROVINCIAS | 5 | congress |
| exp_nestor_calendario_escolar_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: UN CALENDARIO, MUCHAS PROVINCIAS | 7 | congress |
| exp_nestor_transporte_metropolitano | NÉSTOR KIRCHNER: QUIÉN PAGA EL COLECTIVO | 9 | congress |
| exp_nestor_transporte_metropolitano_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: QUIÉN PAGA EL COLECTIVO | 11 | congress |
| exp_nestor_justicia_provincias | NÉSTOR KIRCHNER: TRIBUNALES Y ACUERDOS | 13 | congress |
| exp_nestor_justicia_provincias_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: TRIBUNALES Y ACUERDOS | 15 | congress |
| exp_nestor_bosques_federal | NÉSTOR KIRCHNER: EL FONDO DEL BOSQUE | 17 | congress |
| exp_nestor_bosques_federal_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: EL FONDO DEL BOSQUE | 19 | congress |
| exp_nestor_mercosur_fronteras | NÉSTOR KIRCHNER: CAMIONES EN LA FRONTERA | 1 | diplomacy |
| exp_nestor_mercosur_fronteras_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: CAMIONES EN LA FRONTERA | 3 | diplomacy |
| exp_nestor_vacunas_acuerdo | NÉSTOR KIRCHNER: VACUNAS SIN FRONTERAS | 5 | diplomacy |
| exp_nestor_vacunas_acuerdo_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: VACUNAS SIN FRONTERAS | 7 | diplomacy |
| exp_nestor_antartida_cooperacion | NÉSTOR KIRCHNER: COOPERACIÓN EN EL HIELO | 9 | diplomacy |
| exp_nestor_antartida_cooperacion_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: COOPERACIÓN EN EL HIELO | 11 | diplomacy |
| exp_nestor_remesas_regionales | NÉSTOR KIRCHNER: EL COSTO DE ENVIAR DINERO | 13 | diplomacy |
| exp_nestor_remesas_regionales_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: EL COSTO DE ENVIAR DINERO | 15 | diplomacy |
| exp_nestor_exportacion_alimentos | NÉSTOR KIRCHNER: UN MERCADO PARA LA COSECHA | 17 | diplomacy |
| exp_nestor_exportacion_alimentos_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: UN MERCADO PARA LA COSECHA | 19 | diplomacy |
| exp_nestor_compras_medicamentos | NÉSTOR KIRCHNER: EL PRECIO DE LA PASTILLA | 1 | press |
| exp_nestor_compras_medicamentos_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: EL PRECIO DE LA PASTILLA | 3 | press |
| exp_nestor_publicidad_oficial | NÉSTOR KIRCHNER: LA PAUTA A LA VISTA | 5 | press |
| exp_nestor_publicidad_oficial_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: LA PAUTA A LA VISTA | 7 | press |
| exp_nestor_licitacion_escuelas | NÉSTOR KIRCHNER: AULAS Y SOBRES CERRADOS | 9 | press |
| exp_nestor_licitacion_escuelas_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: AULAS Y SOBRES CERRADOS | 11 | press |
| exp_nestor_patrimonio_funcionarios | NÉSTOR KIRCHNER: DECLARACIONES PENDIENTES | 13 | press |
| exp_nestor_patrimonio_funcionarios_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: DECLARACIONES PENDIENTES | 15 | press |
| exp_nestor_algoritmos_estado | NÉSTOR KIRCHNER: EL ALGORITMO DECIDE | 17 | press |
| exp_nestor_algoritmos_estado_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: EL ALGORITMO DECIDE | 19 | press |
| exp_nestor_satelite_incendios | NÉSTOR KIRCHNER: OJOS SOBRE EL FUEGO | 1 | office |
| exp_nestor_satelite_incendios_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: OJOS SOBRE EL FUEGO | 3 | office |
| exp_nestor_semillas_sequia | NÉSTOR KIRCHNER: SEMILLAS CONTRA LA SEQUÍA | 5 | office |
| exp_nestor_semillas_sequia_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: SEMILLAS CONTRA LA SEQUÍA | 7 | office |
| exp_nestor_reactor_medicina | NÉSTOR KIRCHNER: CIENCIA PARA EL DIAGNÓSTICO | 9 | office |
| exp_nestor_reactor_medicina_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: CIENCIA PARA EL DIAGNÓSTICO | 11 | office |
| exp_nestor_baterias_nacionales | NÉSTOR KIRCHNER: DEL MINERAL A LA BATERÍA | 13 | office |
| exp_nestor_baterias_nacionales_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: DEL MINERAL A LA BATERÍA | 15 | office |
| exp_nestor_resistencia_antibioticos | NÉSTOR KIRCHNER: BACTERIAS QUE RESISTEN | 17 | office |
| exp_nestor_resistencia_antibioticos_followup | IMPLEMENTACIÓN / NÉSTOR KIRCHNER: BACTERIAS QUE RESISTEN | 19 | office |

## Cristina Fernández de Kirchner

| ID | Tarjeta | Turno mínimo | Escena |
| --- | --- | --- | --- |
| exp_cristina_subsidios_agua | CRISTINA FERNÁNDEZ DE KIRCHNER: LA FACTURA DEL AGUA | 1 | office |
| exp_cristina_subsidios_agua_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: LA FACTURA DEL AGUA | 3 | office |
| exp_cristina_cajas_previsionales | CRISTINA FERNÁNDEZ DE KIRCHNER: CAJAS EN ROJO | 5 | office |
| exp_cristina_cajas_previsionales_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: CAJAS EN ROJO | 7 | office |
| exp_cristina_aduana_digital | CRISTINA FERNÁNDEZ DE KIRCHNER: LA ADUANA Y LOS PAPELES | 9 | office |
| exp_cristina_aduana_digital_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: LA ADUANA Y LOS PAPELES | 11 | office |
| exp_cristina_impuesto_inmuebles | CRISTINA FERNÁNDEZ DE KIRCHNER: EL MAPA DEL IMPUESTO | 13 | office |
| exp_cristina_impuesto_inmuebles_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: EL MAPA DEL IMPUESTO | 15 | office |
| exp_cristina_gasto_tributario | CRISTINA FERNÁNDEZ DE KIRCHNER: EXENCIONES BAJO LA LUPA | 17 | office |
| exp_cristina_gasto_tributario_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: EXENCIONES BAJO LA LUPA | 19 | office |
| exp_cristina_red_agua | CRISTINA FERNÁNDEZ DE KIRCHNER: AGUA PARA EL INTERIOR | 1 | office |
| exp_cristina_red_agua_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: AGUA PARA EL INTERIOR | 3 | office |
| exp_cristina_trenes_carga | CRISTINA FERNÁNDEZ DE KIRCHNER: VÍAS PARA LA COSECHA | 5 | office |
| exp_cristina_trenes_carga_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: VÍAS PARA LA COSECHA | 7 | office |
| exp_cristina_puertos_fluviales | CRISTINA FERNÁNDEZ DE KIRCHNER: EL PUERTO SE QUEDA CHICO | 9 | office |
| exp_cristina_puertos_fluviales_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: EL PUERTO SE QUEDA CHICO | 11 | office |
| exp_cristina_vivienda_suelo | CRISTINA FERNÁNDEZ DE KIRCHNER: LOTES SIN SERVICIOS | 13 | office |
| exp_cristina_vivienda_suelo_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: LOTES SIN SERVICIOS | 15 | office |
| exp_cristina_fibra_rural | CRISTINA FERNÁNDEZ DE KIRCHNER: EL ÚLTIMO KILÓMETRO DIGITAL | 17 | office |
| exp_cristina_fibra_rural_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: EL ÚLTIMO KILÓMETRO DIGITAL | 19 | office |
| exp_cristina_alquiler_temporal | CRISTINA FERNÁNDEZ DE KIRCHNER: LA CIUDAD EN ALQUILER | 1 | congress |
| exp_cristina_alquiler_temporal_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: LA CIUDAD EN ALQUILER | 3 | congress |
| exp_cristina_litio_licencias | CRISTINA FERNÁNDEZ DE KIRCHNER: LICENCIAS EN EL SALAR | 5 | congress |
| exp_cristina_litio_licencias_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: LICENCIAS EN EL SALAR | 7 | congress |
| exp_cristina_energia_distribuida | CRISTINA FERNÁNDEZ DE KIRCHNER: PANELES EN LOS TECHOS | 9 | congress |
| exp_cristina_energia_distribuida_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: PANELES EN LOS TECHOS | 11 | congress |
| exp_cristina_datos_personales | CRISTINA FERNÁNDEZ DE KIRCHNER: ¿DE QUIÉN SON LOS DATOS? | 13 | congress |
| exp_cristina_datos_personales_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: ¿DE QUIÉN SON LOS DATOS? | 15 | congress |
| exp_cristina_pesca_cuotas | CRISTINA FERNÁNDEZ DE KIRCHNER: CUOTAS EN EL MAR | 17 | congress |
| exp_cristina_pesca_cuotas_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: CUOTAS EN EL MAR | 19 | congress |
| exp_cristina_guardias_hospital | CRISTINA FERNÁNDEZ DE KIRCHNER: LA GUARDIA NO DA ABASTO | 1 | office |
| exp_cristina_guardias_hospital_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: LA GUARDIA NO DA ABASTO | 3 | office |
| exp_cristina_comedores_escolares | CRISTINA FERNÁNDEZ DE KIRCHNER: UN PLATO EN LA ESCUELA | 5 | office |
| exp_cristina_comedores_escolares_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: UN PLATO EN LA ESCUELA | 7 | office |
| exp_cristina_discapacidad_acceso | CRISTINA FERNÁNDEZ DE KIRCHNER: RAMPAS Y DERECHOS | 9 | office |
| exp_cristina_discapacidad_acceso_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: RAMPAS Y DERECHOS | 11 | office |
| exp_cristina_salud_mental | CRISTINA FERNÁNDEZ DE KIRCHNER: UNA RED DE ESCUCHA | 13 | office |
| exp_cristina_salud_mental_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: UNA RED DE ESCUCHA | 15 | office |
| exp_cristina_cuidados_mayores | CRISTINA FERNÁNDEZ DE KIRCHNER: QUIÉN CUIDA A LOS MAYORES | 17 | office |
| exp_cristina_cuidados_mayores_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: QUIÉN CUIDA A LOS MAYORES | 19 | office |
| exp_cristina_plataformas_reparto | CRISTINA FERNÁNDEZ DE KIRCHNER: EL REPARTO Y LOS DERECHOS | 1 | congress |
| exp_cristina_plataformas_reparto_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: EL REPARTO Y LOS DERECHOS | 3 | congress |
| exp_cristina_cosecha_temporal | CRISTINA FERNÁNDEZ DE KIRCHNER: TRABAJO DE COSECHA | 5 | congress |
| exp_cristina_cosecha_temporal_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: TRABAJO DE COSECHA | 7 | congress |
| exp_cristina_reconversion_autopartes | CRISTINA FERNÁNDEZ DE KIRCHNER: LA FÁBRICA CAMBIA DE MOTOR | 9 | congress |
| exp_cristina_reconversion_autopartes_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: LA FÁBRICA CAMBIA DE MOTOR | 11 | congress |
| exp_cristina_enfermeria_turnos | CRISTINA FERNÁNDEZ DE KIRCHNER: TURNOS QUE AGOTAN | 13 | congress |
| exp_cristina_enfermeria_turnos_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: TURNOS QUE AGOTAN | 15 | congress |
| exp_cristina_teletrabajo | CRISTINA FERNÁNDEZ DE KIRCHNER: LA OFICINA EN CASA | 17 | congress |
| exp_cristina_teletrabajo_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: LA OFICINA EN CASA | 19 | congress |
| exp_cristina_seguridad_estaciones | CRISTINA FERNÁNDEZ DE KIRCHNER: ANDENES SIN CUIDADO | 1 | press |
| exp_cristina_seguridad_estaciones_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: ANDENES SIN CUIDADO | 3 | press |
| exp_cristina_ciberfraude | CRISTINA FERNÁNDEZ DE KIRCHNER: ESTAFAS EN EL TELÉFONO | 5 | press |
| exp_cristina_ciberfraude_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: ESTAFAS EN EL TELÉFONO | 7 | press |
| exp_cristina_incendios_brigadas | CRISTINA FERNÁNDEZ DE KIRCHNER: BRIGADAS EN ALERTA | 9 | press |
| exp_cristina_incendios_brigadas_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: BRIGADAS EN ALERTA | 11 | press |
| exp_cristina_violencia_estadios | CRISTINA FERNÁNDEZ DE KIRCHNER: EL PARTIDO FUERA DE LA CANCHA | 13 | press |
| exp_cristina_violencia_estadios_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: EL PARTIDO FUERA DE LA CANCHA | 15 | press |
| exp_cristina_alerta_inundacion | CRISTINA FERNÁNDEZ DE KIRCHNER: LA SIRENA ANTES DEL AGUA | 17 | press |
| exp_cristina_alerta_inundacion_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: LA SIRENA ANTES DEL AGUA | 19 | press |
| exp_cristina_hospitales_federales | CRISTINA FERNÁNDEZ DE KIRCHNER: EL HOSPITAL Y LOS VOTOS | 1 | congress |
| exp_cristina_hospitales_federales_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: EL HOSPITAL Y LOS VOTOS | 3 | congress |
| exp_cristina_calendario_escolar | CRISTINA FERNÁNDEZ DE KIRCHNER: UN CALENDARIO, MUCHAS PROVINCIAS | 5 | congress |
| exp_cristina_calendario_escolar_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: UN CALENDARIO, MUCHAS PROVINCIAS | 7 | congress |
| exp_cristina_transporte_metropolitano | CRISTINA FERNÁNDEZ DE KIRCHNER: QUIÉN PAGA EL COLECTIVO | 9 | congress |
| exp_cristina_transporte_metropolitano_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: QUIÉN PAGA EL COLECTIVO | 11 | congress |
| exp_cristina_justicia_provincias | CRISTINA FERNÁNDEZ DE KIRCHNER: TRIBUNALES Y ACUERDOS | 13 | congress |
| exp_cristina_justicia_provincias_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: TRIBUNALES Y ACUERDOS | 15 | congress |
| exp_cristina_bosques_federal | CRISTINA FERNÁNDEZ DE KIRCHNER: EL FONDO DEL BOSQUE | 17 | congress |
| exp_cristina_bosques_federal_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: EL FONDO DEL BOSQUE | 19 | congress |
| exp_cristina_mercosur_fronteras | CRISTINA FERNÁNDEZ DE KIRCHNER: CAMIONES EN LA FRONTERA | 1 | diplomacy |
| exp_cristina_mercosur_fronteras_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: CAMIONES EN LA FRONTERA | 3 | diplomacy |
| exp_cristina_vacunas_acuerdo | CRISTINA FERNÁNDEZ DE KIRCHNER: VACUNAS SIN FRONTERAS | 5 | diplomacy |
| exp_cristina_vacunas_acuerdo_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: VACUNAS SIN FRONTERAS | 7 | diplomacy |
| exp_cristina_antartida_cooperacion | CRISTINA FERNÁNDEZ DE KIRCHNER: COOPERACIÓN EN EL HIELO | 9 | diplomacy |
| exp_cristina_antartida_cooperacion_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: COOPERACIÓN EN EL HIELO | 11 | diplomacy |
| exp_cristina_remesas_regionales | CRISTINA FERNÁNDEZ DE KIRCHNER: EL COSTO DE ENVIAR DINERO | 13 | diplomacy |
| exp_cristina_remesas_regionales_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: EL COSTO DE ENVIAR DINERO | 15 | diplomacy |
| exp_cristina_exportacion_alimentos | CRISTINA FERNÁNDEZ DE KIRCHNER: UN MERCADO PARA LA COSECHA | 17 | diplomacy |
| exp_cristina_exportacion_alimentos_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: UN MERCADO PARA LA COSECHA | 19 | diplomacy |
| exp_cristina_compras_medicamentos | CRISTINA FERNÁNDEZ DE KIRCHNER: EL PRECIO DE LA PASTILLA | 1 | press |
| exp_cristina_compras_medicamentos_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: EL PRECIO DE LA PASTILLA | 3 | press |
| exp_cristina_publicidad_oficial | CRISTINA FERNÁNDEZ DE KIRCHNER: LA PAUTA A LA VISTA | 5 | press |
| exp_cristina_publicidad_oficial_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: LA PAUTA A LA VISTA | 7 | press |
| exp_cristina_licitacion_escuelas | CRISTINA FERNÁNDEZ DE KIRCHNER: AULAS Y SOBRES CERRADOS | 9 | press |
| exp_cristina_licitacion_escuelas_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: AULAS Y SOBRES CERRADOS | 11 | press |
| exp_cristina_patrimonio_funcionarios | CRISTINA FERNÁNDEZ DE KIRCHNER: DECLARACIONES PENDIENTES | 13 | press |
| exp_cristina_patrimonio_funcionarios_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: DECLARACIONES PENDIENTES | 15 | press |
| exp_cristina_algoritmos_estado | CRISTINA FERNÁNDEZ DE KIRCHNER: EL ALGORITMO DECIDE | 17 | press |
| exp_cristina_algoritmos_estado_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: EL ALGORITMO DECIDE | 19 | press |
| exp_cristina_satelite_incendios | CRISTINA FERNÁNDEZ DE KIRCHNER: OJOS SOBRE EL FUEGO | 1 | office |
| exp_cristina_satelite_incendios_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: OJOS SOBRE EL FUEGO | 3 | office |
| exp_cristina_semillas_sequia | CRISTINA FERNÁNDEZ DE KIRCHNER: SEMILLAS CONTRA LA SEQUÍA | 5 | office |
| exp_cristina_semillas_sequia_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: SEMILLAS CONTRA LA SEQUÍA | 7 | office |
| exp_cristina_reactor_medicina | CRISTINA FERNÁNDEZ DE KIRCHNER: CIENCIA PARA EL DIAGNÓSTICO | 9 | office |
| exp_cristina_reactor_medicina_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: CIENCIA PARA EL DIAGNÓSTICO | 11 | office |
| exp_cristina_baterias_nacionales | CRISTINA FERNÁNDEZ DE KIRCHNER: DEL MINERAL A LA BATERÍA | 13 | office |
| exp_cristina_baterias_nacionales_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: DEL MINERAL A LA BATERÍA | 15 | office |
| exp_cristina_resistencia_antibioticos | CRISTINA FERNÁNDEZ DE KIRCHNER: BACTERIAS QUE RESISTEN | 17 | office |
| exp_cristina_resistencia_antibioticos_followup | IMPLEMENTACIÓN / CRISTINA FERNÁNDEZ DE KIRCHNER: BACTERIAS QUE RESISTEN | 19 | office |

## Macri

| ID | Tarjeta | Turno mínimo | Escena |
| --- | --- | --- | --- |
| exp_macri_subsidios_agua | MACRI: LA FACTURA DEL AGUA | 1 | office |
| exp_macri_subsidios_agua_followup | IMPLEMENTACIÓN / MACRI: LA FACTURA DEL AGUA | 3 | office |
| exp_macri_cajas_previsionales | MACRI: CAJAS EN ROJO | 5 | office |
| exp_macri_cajas_previsionales_followup | IMPLEMENTACIÓN / MACRI: CAJAS EN ROJO | 7 | office |
| exp_macri_aduana_digital | MACRI: LA ADUANA Y LOS PAPELES | 9 | office |
| exp_macri_aduana_digital_followup | IMPLEMENTACIÓN / MACRI: LA ADUANA Y LOS PAPELES | 11 | office |
| exp_macri_impuesto_inmuebles | MACRI: EL MAPA DEL IMPUESTO | 13 | office |
| exp_macri_impuesto_inmuebles_followup | IMPLEMENTACIÓN / MACRI: EL MAPA DEL IMPUESTO | 15 | office |
| exp_macri_gasto_tributario | MACRI: EXENCIONES BAJO LA LUPA | 17 | office |
| exp_macri_gasto_tributario_followup | IMPLEMENTACIÓN / MACRI: EXENCIONES BAJO LA LUPA | 19 | office |
| exp_macri_red_agua | MACRI: AGUA PARA EL INTERIOR | 1 | office |
| exp_macri_red_agua_followup | IMPLEMENTACIÓN / MACRI: AGUA PARA EL INTERIOR | 3 | office |
| exp_macri_trenes_carga | MACRI: VÍAS PARA LA COSECHA | 5 | office |
| exp_macri_trenes_carga_followup | IMPLEMENTACIÓN / MACRI: VÍAS PARA LA COSECHA | 7 | office |
| exp_macri_puertos_fluviales | MACRI: EL PUERTO SE QUEDA CHICO | 9 | office |
| exp_macri_puertos_fluviales_followup | IMPLEMENTACIÓN / MACRI: EL PUERTO SE QUEDA CHICO | 11 | office |
| exp_macri_vivienda_suelo | MACRI: LOTES SIN SERVICIOS | 13 | office |
| exp_macri_vivienda_suelo_followup | IMPLEMENTACIÓN / MACRI: LOTES SIN SERVICIOS | 15 | office |
| exp_macri_fibra_rural | MACRI: EL ÚLTIMO KILÓMETRO DIGITAL | 17 | office |
| exp_macri_fibra_rural_followup | IMPLEMENTACIÓN / MACRI: EL ÚLTIMO KILÓMETRO DIGITAL | 19 | office |
| exp_macri_alquiler_temporal | MACRI: LA CIUDAD EN ALQUILER | 1 | congress |
| exp_macri_alquiler_temporal_followup | IMPLEMENTACIÓN / MACRI: LA CIUDAD EN ALQUILER | 3 | congress |
| exp_macri_litio_licencias | MACRI: LICENCIAS EN EL SALAR | 5 | congress |
| exp_macri_litio_licencias_followup | IMPLEMENTACIÓN / MACRI: LICENCIAS EN EL SALAR | 7 | congress |
| exp_macri_energia_distribuida | MACRI: PANELES EN LOS TECHOS | 9 | congress |
| exp_macri_energia_distribuida_followup | IMPLEMENTACIÓN / MACRI: PANELES EN LOS TECHOS | 11 | congress |
| exp_macri_datos_personales | MACRI: ¿DE QUIÉN SON LOS DATOS? | 13 | congress |
| exp_macri_datos_personales_followup | IMPLEMENTACIÓN / MACRI: ¿DE QUIÉN SON LOS DATOS? | 15 | congress |
| exp_macri_pesca_cuotas | MACRI: CUOTAS EN EL MAR | 17 | congress |
| exp_macri_pesca_cuotas_followup | IMPLEMENTACIÓN / MACRI: CUOTAS EN EL MAR | 19 | congress |
| exp_macri_guardias_hospital | MACRI: LA GUARDIA NO DA ABASTO | 1 | office |
| exp_macri_guardias_hospital_followup | IMPLEMENTACIÓN / MACRI: LA GUARDIA NO DA ABASTO | 3 | office |
| exp_macri_comedores_escolares | MACRI: UN PLATO EN LA ESCUELA | 5 | office |
| exp_macri_comedores_escolares_followup | IMPLEMENTACIÓN / MACRI: UN PLATO EN LA ESCUELA | 7 | office |
| exp_macri_discapacidad_acceso | MACRI: RAMPAS Y DERECHOS | 9 | office |
| exp_macri_discapacidad_acceso_followup | IMPLEMENTACIÓN / MACRI: RAMPAS Y DERECHOS | 11 | office |
| exp_macri_salud_mental | MACRI: UNA RED DE ESCUCHA | 13 | office |
| exp_macri_salud_mental_followup | IMPLEMENTACIÓN / MACRI: UNA RED DE ESCUCHA | 15 | office |
| exp_macri_cuidados_mayores | MACRI: QUIÉN CUIDA A LOS MAYORES | 17 | office |
| exp_macri_cuidados_mayores_followup | IMPLEMENTACIÓN / MACRI: QUIÉN CUIDA A LOS MAYORES | 19 | office |
| exp_macri_plataformas_reparto | MACRI: EL REPARTO Y LOS DERECHOS | 1 | congress |
| exp_macri_plataformas_reparto_followup | IMPLEMENTACIÓN / MACRI: EL REPARTO Y LOS DERECHOS | 3 | congress |
| exp_macri_cosecha_temporal | MACRI: TRABAJO DE COSECHA | 5 | congress |
| exp_macri_cosecha_temporal_followup | IMPLEMENTACIÓN / MACRI: TRABAJO DE COSECHA | 7 | congress |
| exp_macri_reconversion_autopartes | MACRI: LA FÁBRICA CAMBIA DE MOTOR | 9 | congress |
| exp_macri_reconversion_autopartes_followup | IMPLEMENTACIÓN / MACRI: LA FÁBRICA CAMBIA DE MOTOR | 11 | congress |
| exp_macri_enfermeria_turnos | MACRI: TURNOS QUE AGOTAN | 13 | congress |
| exp_macri_enfermeria_turnos_followup | IMPLEMENTACIÓN / MACRI: TURNOS QUE AGOTAN | 15 | congress |
| exp_macri_teletrabajo | MACRI: LA OFICINA EN CASA | 17 | congress |
| exp_macri_teletrabajo_followup | IMPLEMENTACIÓN / MACRI: LA OFICINA EN CASA | 19 | congress |
| exp_macri_seguridad_estaciones | MACRI: ANDENES SIN CUIDADO | 1 | press |
| exp_macri_seguridad_estaciones_followup | IMPLEMENTACIÓN / MACRI: ANDENES SIN CUIDADO | 3 | press |
| exp_macri_ciberfraude | MACRI: ESTAFAS EN EL TELÉFONO | 5 | press |
| exp_macri_ciberfraude_followup | IMPLEMENTACIÓN / MACRI: ESTAFAS EN EL TELÉFONO | 7 | press |
| exp_macri_incendios_brigadas | MACRI: BRIGADAS EN ALERTA | 9 | press |
| exp_macri_incendios_brigadas_followup | IMPLEMENTACIÓN / MACRI: BRIGADAS EN ALERTA | 11 | press |
| exp_macri_violencia_estadios | MACRI: EL PARTIDO FUERA DE LA CANCHA | 13 | press |
| exp_macri_violencia_estadios_followup | IMPLEMENTACIÓN / MACRI: EL PARTIDO FUERA DE LA CANCHA | 15 | press |
| exp_macri_alerta_inundacion | MACRI: LA SIRENA ANTES DEL AGUA | 17 | press |
| exp_macri_alerta_inundacion_followup | IMPLEMENTACIÓN / MACRI: LA SIRENA ANTES DEL AGUA | 19 | press |
| exp_macri_hospitales_federales | MACRI: EL HOSPITAL Y LOS VOTOS | 1 | congress |
| exp_macri_hospitales_federales_followup | IMPLEMENTACIÓN / MACRI: EL HOSPITAL Y LOS VOTOS | 3 | congress |
| exp_macri_calendario_escolar | MACRI: UN CALENDARIO, MUCHAS PROVINCIAS | 5 | congress |
| exp_macri_calendario_escolar_followup | IMPLEMENTACIÓN / MACRI: UN CALENDARIO, MUCHAS PROVINCIAS | 7 | congress |
| exp_macri_transporte_metropolitano | MACRI: QUIÉN PAGA EL COLECTIVO | 9 | congress |
| exp_macri_transporte_metropolitano_followup | IMPLEMENTACIÓN / MACRI: QUIÉN PAGA EL COLECTIVO | 11 | congress |
| exp_macri_justicia_provincias | MACRI: TRIBUNALES Y ACUERDOS | 13 | congress |
| exp_macri_justicia_provincias_followup | IMPLEMENTACIÓN / MACRI: TRIBUNALES Y ACUERDOS | 15 | congress |
| exp_macri_bosques_federal | MACRI: EL FONDO DEL BOSQUE | 17 | congress |
| exp_macri_bosques_federal_followup | IMPLEMENTACIÓN / MACRI: EL FONDO DEL BOSQUE | 19 | congress |
| exp_macri_mercosur_fronteras | MACRI: CAMIONES EN LA FRONTERA | 1 | diplomacy |
| exp_macri_mercosur_fronteras_followup | IMPLEMENTACIÓN / MACRI: CAMIONES EN LA FRONTERA | 3 | diplomacy |
| exp_macri_vacunas_acuerdo | MACRI: VACUNAS SIN FRONTERAS | 5 | diplomacy |
| exp_macri_vacunas_acuerdo_followup | IMPLEMENTACIÓN / MACRI: VACUNAS SIN FRONTERAS | 7 | diplomacy |
| exp_macri_antartida_cooperacion | MACRI: COOPERACIÓN EN EL HIELO | 9 | diplomacy |
| exp_macri_antartida_cooperacion_followup | IMPLEMENTACIÓN / MACRI: COOPERACIÓN EN EL HIELO | 11 | diplomacy |
| exp_macri_remesas_regionales | MACRI: EL COSTO DE ENVIAR DINERO | 13 | diplomacy |
| exp_macri_remesas_regionales_followup | IMPLEMENTACIÓN / MACRI: EL COSTO DE ENVIAR DINERO | 15 | diplomacy |
| exp_macri_exportacion_alimentos | MACRI: UN MERCADO PARA LA COSECHA | 17 | diplomacy |
| exp_macri_exportacion_alimentos_followup | IMPLEMENTACIÓN / MACRI: UN MERCADO PARA LA COSECHA | 19 | diplomacy |
| exp_macri_compras_medicamentos | MACRI: EL PRECIO DE LA PASTILLA | 1 | press |
| exp_macri_compras_medicamentos_followup | IMPLEMENTACIÓN / MACRI: EL PRECIO DE LA PASTILLA | 3 | press |
| exp_macri_publicidad_oficial | MACRI: LA PAUTA A LA VISTA | 5 | press |
| exp_macri_publicidad_oficial_followup | IMPLEMENTACIÓN / MACRI: LA PAUTA A LA VISTA | 7 | press |
| exp_macri_licitacion_escuelas | MACRI: AULAS Y SOBRES CERRADOS | 9 | press |
| exp_macri_licitacion_escuelas_followup | IMPLEMENTACIÓN / MACRI: AULAS Y SOBRES CERRADOS | 11 | press |
| exp_macri_patrimonio_funcionarios | MACRI: DECLARACIONES PENDIENTES | 13 | press |
| exp_macri_patrimonio_funcionarios_followup | IMPLEMENTACIÓN / MACRI: DECLARACIONES PENDIENTES | 15 | press |
| exp_macri_algoritmos_estado | MACRI: EL ALGORITMO DECIDE | 17 | press |
| exp_macri_algoritmos_estado_followup | IMPLEMENTACIÓN / MACRI: EL ALGORITMO DECIDE | 19 | press |
| exp_macri_satelite_incendios | MACRI: OJOS SOBRE EL FUEGO | 1 | office |
| exp_macri_satelite_incendios_followup | IMPLEMENTACIÓN / MACRI: OJOS SOBRE EL FUEGO | 3 | office |
| exp_macri_semillas_sequia | MACRI: SEMILLAS CONTRA LA SEQUÍA | 5 | office |
| exp_macri_semillas_sequia_followup | IMPLEMENTACIÓN / MACRI: SEMILLAS CONTRA LA SEQUÍA | 7 | office |
| exp_macri_reactor_medicina | MACRI: CIENCIA PARA EL DIAGNÓSTICO | 9 | office |
| exp_macri_reactor_medicina_followup | IMPLEMENTACIÓN / MACRI: CIENCIA PARA EL DIAGNÓSTICO | 11 | office |
| exp_macri_baterias_nacionales | MACRI: DEL MINERAL A LA BATERÍA | 13 | office |
| exp_macri_baterias_nacionales_followup | IMPLEMENTACIÓN / MACRI: DEL MINERAL A LA BATERÍA | 15 | office |
| exp_macri_resistencia_antibioticos | MACRI: BACTERIAS QUE RESISTEN | 17 | office |
| exp_macri_resistencia_antibioticos_followup | IMPLEMENTACIÓN / MACRI: BACTERIAS QUE RESISTEN | 19 | office |

## Nicolás del Caño

| ID | Tarjeta | Turno mínimo | Escena |
| --- | --- | --- | --- |
| exp_del_cano_subsidios_agua | NICOLÁS DEL CAÑO: LA FACTURA DEL AGUA | 1 | office |
| exp_del_cano_subsidios_agua_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: LA FACTURA DEL AGUA | 3 | office |
| exp_del_cano_cajas_previsionales | NICOLÁS DEL CAÑO: CAJAS EN ROJO | 5 | office |
| exp_del_cano_cajas_previsionales_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: CAJAS EN ROJO | 7 | office |
| exp_del_cano_aduana_digital | NICOLÁS DEL CAÑO: LA ADUANA Y LOS PAPELES | 9 | office |
| exp_del_cano_aduana_digital_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: LA ADUANA Y LOS PAPELES | 11 | office |
| exp_del_cano_impuesto_inmuebles | NICOLÁS DEL CAÑO: EL MAPA DEL IMPUESTO | 13 | office |
| exp_del_cano_impuesto_inmuebles_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: EL MAPA DEL IMPUESTO | 15 | office |
| exp_del_cano_gasto_tributario | NICOLÁS DEL CAÑO: EXENCIONES BAJO LA LUPA | 17 | office |
| exp_del_cano_gasto_tributario_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: EXENCIONES BAJO LA LUPA | 19 | office |
| exp_del_cano_red_agua | NICOLÁS DEL CAÑO: AGUA PARA EL INTERIOR | 1 | office |
| exp_del_cano_red_agua_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: AGUA PARA EL INTERIOR | 3 | office |
| exp_del_cano_trenes_carga | NICOLÁS DEL CAÑO: VÍAS PARA LA COSECHA | 5 | office |
| exp_del_cano_trenes_carga_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: VÍAS PARA LA COSECHA | 7 | office |
| exp_del_cano_puertos_fluviales | NICOLÁS DEL CAÑO: EL PUERTO SE QUEDA CHICO | 9 | office |
| exp_del_cano_puertos_fluviales_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: EL PUERTO SE QUEDA CHICO | 11 | office |
| exp_del_cano_vivienda_suelo | NICOLÁS DEL CAÑO: LOTES SIN SERVICIOS | 13 | office |
| exp_del_cano_vivienda_suelo_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: LOTES SIN SERVICIOS | 15 | office |
| exp_del_cano_fibra_rural | NICOLÁS DEL CAÑO: EL ÚLTIMO KILÓMETRO DIGITAL | 17 | office |
| exp_del_cano_fibra_rural_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: EL ÚLTIMO KILÓMETRO DIGITAL | 19 | office |
| exp_del_cano_alquiler_temporal | NICOLÁS DEL CAÑO: LA CIUDAD EN ALQUILER | 1 | congress |
| exp_del_cano_alquiler_temporal_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: LA CIUDAD EN ALQUILER | 3 | congress |
| exp_del_cano_litio_licencias | NICOLÁS DEL CAÑO: LICENCIAS EN EL SALAR | 5 | congress |
| exp_del_cano_litio_licencias_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: LICENCIAS EN EL SALAR | 7 | congress |
| exp_del_cano_energia_distribuida | NICOLÁS DEL CAÑO: PANELES EN LOS TECHOS | 9 | congress |
| exp_del_cano_energia_distribuida_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: PANELES EN LOS TECHOS | 11 | congress |
| exp_del_cano_datos_personales | NICOLÁS DEL CAÑO: ¿DE QUIÉN SON LOS DATOS? | 13 | congress |
| exp_del_cano_datos_personales_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: ¿DE QUIÉN SON LOS DATOS? | 15 | congress |
| exp_del_cano_pesca_cuotas | NICOLÁS DEL CAÑO: CUOTAS EN EL MAR | 17 | congress |
| exp_del_cano_pesca_cuotas_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: CUOTAS EN EL MAR | 19 | congress |
| exp_del_cano_guardias_hospital | NICOLÁS DEL CAÑO: LA GUARDIA NO DA ABASTO | 1 | office |
| exp_del_cano_guardias_hospital_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: LA GUARDIA NO DA ABASTO | 3 | office |
| exp_del_cano_comedores_escolares | NICOLÁS DEL CAÑO: UN PLATO EN LA ESCUELA | 5 | office |
| exp_del_cano_comedores_escolares_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: UN PLATO EN LA ESCUELA | 7 | office |
| exp_del_cano_discapacidad_acceso | NICOLÁS DEL CAÑO: RAMPAS Y DERECHOS | 9 | office |
| exp_del_cano_discapacidad_acceso_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: RAMPAS Y DERECHOS | 11 | office |
| exp_del_cano_salud_mental | NICOLÁS DEL CAÑO: UNA RED DE ESCUCHA | 13 | office |
| exp_del_cano_salud_mental_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: UNA RED DE ESCUCHA | 15 | office |
| exp_del_cano_cuidados_mayores | NICOLÁS DEL CAÑO: QUIÉN CUIDA A LOS MAYORES | 17 | office |
| exp_del_cano_cuidados_mayores_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: QUIÉN CUIDA A LOS MAYORES | 19 | office |
| exp_del_cano_plataformas_reparto | NICOLÁS DEL CAÑO: EL REPARTO Y LOS DERECHOS | 1 | congress |
| exp_del_cano_plataformas_reparto_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: EL REPARTO Y LOS DERECHOS | 3 | congress |
| exp_del_cano_cosecha_temporal | NICOLÁS DEL CAÑO: TRABAJO DE COSECHA | 5 | congress |
| exp_del_cano_cosecha_temporal_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: TRABAJO DE COSECHA | 7 | congress |
| exp_del_cano_reconversion_autopartes | NICOLÁS DEL CAÑO: LA FÁBRICA CAMBIA DE MOTOR | 9 | congress |
| exp_del_cano_reconversion_autopartes_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: LA FÁBRICA CAMBIA DE MOTOR | 11 | congress |
| exp_del_cano_enfermeria_turnos | NICOLÁS DEL CAÑO: TURNOS QUE AGOTAN | 13 | congress |
| exp_del_cano_enfermeria_turnos_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: TURNOS QUE AGOTAN | 15 | congress |
| exp_del_cano_teletrabajo | NICOLÁS DEL CAÑO: LA OFICINA EN CASA | 17 | congress |
| exp_del_cano_teletrabajo_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: LA OFICINA EN CASA | 19 | congress |
| exp_del_cano_seguridad_estaciones | NICOLÁS DEL CAÑO: ANDENES SIN CUIDADO | 1 | press |
| exp_del_cano_seguridad_estaciones_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: ANDENES SIN CUIDADO | 3 | press |
| exp_del_cano_ciberfraude | NICOLÁS DEL CAÑO: ESTAFAS EN EL TELÉFONO | 5 | press |
| exp_del_cano_ciberfraude_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: ESTAFAS EN EL TELÉFONO | 7 | press |
| exp_del_cano_incendios_brigadas | NICOLÁS DEL CAÑO: BRIGADAS EN ALERTA | 9 | press |
| exp_del_cano_incendios_brigadas_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: BRIGADAS EN ALERTA | 11 | press |
| exp_del_cano_violencia_estadios | NICOLÁS DEL CAÑO: EL PARTIDO FUERA DE LA CANCHA | 13 | press |
| exp_del_cano_violencia_estadios_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: EL PARTIDO FUERA DE LA CANCHA | 15 | press |
| exp_del_cano_alerta_inundacion | NICOLÁS DEL CAÑO: LA SIRENA ANTES DEL AGUA | 17 | press |
| exp_del_cano_alerta_inundacion_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: LA SIRENA ANTES DEL AGUA | 19 | press |
| exp_del_cano_hospitales_federales | NICOLÁS DEL CAÑO: EL HOSPITAL Y LOS VOTOS | 1 | congress |
| exp_del_cano_hospitales_federales_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: EL HOSPITAL Y LOS VOTOS | 3 | congress |
| exp_del_cano_calendario_escolar | NICOLÁS DEL CAÑO: UN CALENDARIO, MUCHAS PROVINCIAS | 5 | congress |
| exp_del_cano_calendario_escolar_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: UN CALENDARIO, MUCHAS PROVINCIAS | 7 | congress |
| exp_del_cano_transporte_metropolitano | NICOLÁS DEL CAÑO: QUIÉN PAGA EL COLECTIVO | 9 | congress |
| exp_del_cano_transporte_metropolitano_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: QUIÉN PAGA EL COLECTIVO | 11 | congress |
| exp_del_cano_justicia_provincias | NICOLÁS DEL CAÑO: TRIBUNALES Y ACUERDOS | 13 | congress |
| exp_del_cano_justicia_provincias_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: TRIBUNALES Y ACUERDOS | 15 | congress |
| exp_del_cano_bosques_federal | NICOLÁS DEL CAÑO: EL FONDO DEL BOSQUE | 17 | congress |
| exp_del_cano_bosques_federal_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: EL FONDO DEL BOSQUE | 19 | congress |
| exp_del_cano_mercosur_fronteras | NICOLÁS DEL CAÑO: CAMIONES EN LA FRONTERA | 1 | diplomacy |
| exp_del_cano_mercosur_fronteras_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: CAMIONES EN LA FRONTERA | 3 | diplomacy |
| exp_del_cano_vacunas_acuerdo | NICOLÁS DEL CAÑO: VACUNAS SIN FRONTERAS | 5 | diplomacy |
| exp_del_cano_vacunas_acuerdo_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: VACUNAS SIN FRONTERAS | 7 | diplomacy |
| exp_del_cano_antartida_cooperacion | NICOLÁS DEL CAÑO: COOPERACIÓN EN EL HIELO | 9 | diplomacy |
| exp_del_cano_antartida_cooperacion_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: COOPERACIÓN EN EL HIELO | 11 | diplomacy |
| exp_del_cano_remesas_regionales | NICOLÁS DEL CAÑO: EL COSTO DE ENVIAR DINERO | 13 | diplomacy |
| exp_del_cano_remesas_regionales_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: EL COSTO DE ENVIAR DINERO | 15 | diplomacy |
| exp_del_cano_exportacion_alimentos | NICOLÁS DEL CAÑO: UN MERCADO PARA LA COSECHA | 17 | diplomacy |
| exp_del_cano_exportacion_alimentos_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: UN MERCADO PARA LA COSECHA | 19 | diplomacy |
| exp_del_cano_compras_medicamentos | NICOLÁS DEL CAÑO: EL PRECIO DE LA PASTILLA | 1 | press |
| exp_del_cano_compras_medicamentos_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: EL PRECIO DE LA PASTILLA | 3 | press |
| exp_del_cano_publicidad_oficial | NICOLÁS DEL CAÑO: LA PAUTA A LA VISTA | 5 | press |
| exp_del_cano_publicidad_oficial_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: LA PAUTA A LA VISTA | 7 | press |
| exp_del_cano_licitacion_escuelas | NICOLÁS DEL CAÑO: AULAS Y SOBRES CERRADOS | 9 | press |
| exp_del_cano_licitacion_escuelas_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: AULAS Y SOBRES CERRADOS | 11 | press |
| exp_del_cano_patrimonio_funcionarios | NICOLÁS DEL CAÑO: DECLARACIONES PENDIENTES | 13 | press |
| exp_del_cano_patrimonio_funcionarios_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: DECLARACIONES PENDIENTES | 15 | press |
| exp_del_cano_algoritmos_estado | NICOLÁS DEL CAÑO: EL ALGORITMO DECIDE | 17 | press |
| exp_del_cano_algoritmos_estado_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: EL ALGORITMO DECIDE | 19 | press |
| exp_del_cano_satelite_incendios | NICOLÁS DEL CAÑO: OJOS SOBRE EL FUEGO | 1 | office |
| exp_del_cano_satelite_incendios_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: OJOS SOBRE EL FUEGO | 3 | office |
| exp_del_cano_semillas_sequia | NICOLÁS DEL CAÑO: SEMILLAS CONTRA LA SEQUÍA | 5 | office |
| exp_del_cano_semillas_sequia_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: SEMILLAS CONTRA LA SEQUÍA | 7 | office |
| exp_del_cano_reactor_medicina | NICOLÁS DEL CAÑO: CIENCIA PARA EL DIAGNÓSTICO | 9 | office |
| exp_del_cano_reactor_medicina_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: CIENCIA PARA EL DIAGNÓSTICO | 11 | office |
| exp_del_cano_baterias_nacionales | NICOLÁS DEL CAÑO: DEL MINERAL A LA BATERÍA | 13 | office |
| exp_del_cano_baterias_nacionales_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: DEL MINERAL A LA BATERÍA | 15 | office |
| exp_del_cano_resistencia_antibioticos | NICOLÁS DEL CAÑO: BACTERIAS QUE RESISTEN | 17 | office |
| exp_del_cano_resistencia_antibioticos_followup | IMPLEMENTACIÓN / NICOLÁS DEL CAÑO: BACTERIAS QUE RESISTEN | 19 | office |
