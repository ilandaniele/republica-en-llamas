# Revisión de inflación — 24 de octubre de 2026

Se corrigieron 90 opciones de 54 tarjetas. El criterio es el mecanismo de cada decisión, sin bonificaciones o penalizaciones por identidad partidaria ni por la categoría de la tarjeta.

## Criterios de las tarjetas

- Cambiar estadísticas, entregar el mando, negociar una transición, recibir refugiados o levantar el estado de sitio no modifica directamente los precios. Se conservan las consecuencias políticas y de confianza pertinentes; la asistencia y la movilización militar tienen un costo presupuestario.
- El ajuste fiscal, las transferencias, los subsidios y la inversión pública actúan mediante el déficit y los demás fundamentos. Se quitaron saltos adicionales de inflación que duplicaban ese canal. Un préstamo, una visita oficial o el anuncio de un acuerdo tampoco estabiliza precios automáticamente.
- Devaluar debilita la moneda y tiene traslado a precios. Defender la paridad fortalece la moneda y consume reservas. Subir tasas en la crisis de reservas tiene un efecto desinflacionario y un costo de crecimiento.
- Revertir o reducir tarifas tiene un efecto directo a la baja y un costo fiscal. Trasladar el encarecimiento energético al usuario aumenta precios y reduce el costo del subsidio. Los controles de precios tienen un efecto inmediato limitado; los desequilibrios y la pérdida de confianza pueden contrarrestarlo en el mismo turno.
- Se mantienen efectos directos para emisión, cambios de liquidez, medidas monetarias, devaluaciones, tarifas y shocks de costos explícitos. Las magnitudes son reglas de juego, no estimaciones económicas calibradas.

Los canales generales de demanda, oferta, moneda y expectativas se contrastaron con [Inflation: Prices on the Rise, FMI](https://www.imf.org/en/publications/fandd/issues/series/back-to-basics/inflation) y [What Causes Inflation?, Reserva Federal de Cleveland](https://www.clevelandfed.org/center-for-inflation-research/inflation-explained-your-guide-to-inflation-basics/what-causes-inflation). Estas fuentes no determinan los coeficientes del juego.

## Cálculo y explicación

La economía sigue evolucionando cada turno aunque la decisión sea política. No se congela la inflación según la categoría de la tarjeta. El modelo conserva su convergencia gradual hacia los fundamentos de déficit, confianza y moneda; las consecuencias fiscales de los shocks entran en esos fundamentos a partir del turno siguiente.

El desglose ahora parte de la inflación anterior a la decisión y suma el efecto directo realmente aplicado, los factores macroeconómicos, el escenario histórico y los límites del indicador. Incluye dificultad, multiplicador Express y topes. La suma coincide con el cambio total y el valor mostrado coincide con el estado final. Los cambios se expresan en puntos porcentuales; la tasa final conserva `%`.

Se eliminó el reinicio incondicional a cero en convertibilidad, que borraba incluso una devaluación explícita. Los shocks existentes tienen su última aplicación antes de expirar; los nuevos empiezan el turno siguiente. No se cambiaron sus probabilidades de aparición.

## Verificación y publicación

Las regresiones cubren decisiones políticas sin salto directo, devaluación, defensa cambiaria, tasas, ajuste fiscal, tarifas, modos de dificultad, Express, escenarios, límites y vencimiento de shocks. Las simulaciones existentes vuelven a reproducir partidas completas con todos los presidentes y contextos. La interfaz distingue el efecto directo del resultado total.

El bundle local del motor para las funciones se regeneró. Web y funciones deben publicarse con la misma versión; no se desplegó ni se hizo commit. Los cambios de reglas pueden modificar la reproducción de partidas guardadas con la versión anterior.

## Opciones corregidas


- arg_005_c
- arg_005_d
- arg_007_b
- arg_011_b
- char_min_002_a
- char_min_002_c
- char_min_003_a
- char_min_003_d
- cri_hyper_001_b
- cri_hyper_002_b
- cri_hyper_003_b
- cri_hyper_003_c
- cri_social_001_c
- eco_001_b
- eco_001_c
- eco_003_a
- eco_003_b
- eco_005_a
- eco_005_b
- eco_005_c
- eco_006_a
- eco_008_a
- eco_009_a
- eco_009_b
- eco_009_c
- eco_011_a
- eco_013_a
- eco_014_a
- eco_015_a
- eco_015_b
- eco_chain_001_a
- eco_chain_001_b
- eco_chain_001_c
- eco_chain_001_d
- eco_chain_003_a
- eco_chain_003_b
- eco_chain_003_c
- geo_001_a
- geo_001_b
- geo_001_d
- geo_002_a
- geo_002_b
- geo_002_c
- geo_005_a
- geo_005_c
- geo_008_b
- hist_conv_001_b
- hist_conv_003_c
- hist_corral_002_c
- hist_corral_003_a
- hist_corral_003_c
- hist_hiper_001_a
- hist_hiper_001_b
- hist_hiper_001_c
- hist_hiper_002_a
- hist_hiper_002_b
- hist_hiper_002_c
- hist_hiper_003_b
- hist_kirch_001_c
- hist_kirch_002_a
- hist_kirch_002_b
- hist_kirch_002_c
- hist_kirch_003_a
- hist_kirch_003_c
- hist_mal_003_c
- hist_rod_001_b
- hist_rod_002_a
- hist_rod_002_b
- hist_rod_002_c
- hist_rod_003_a
- hist_rod_003_c
- int_002_a
- int_003_a
- int_003_c
- int_004_c
- int_006_a
- int_008_a
- int_009_b
- int_011_a
- int_014_a
- int_015_a
- life_cur_001_b
- life_mkt_001_a
- new_007_a
- new_008_b
- new_008_c
- party_pro_apertura_c
- scn_020_b
- scn_020_c
- scn_020_d
