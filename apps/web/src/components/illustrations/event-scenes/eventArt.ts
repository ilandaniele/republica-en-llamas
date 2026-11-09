export const EVENT_ART: Record<
  string,
  {
    scene: string;
    category: 'political' | 'economic' | 'social' | 'international' | 'crisis';
    effect: 'flash' | 'signal' | 'smoke' | 'embers' | 'confetti' | 'rain';
  }
> = {
  pol_001: {
    scene: 'event_pol_001',
    category: 'political',
    effect: 'flash',
  },
  eco_001: {
    scene: 'event_eco_001',
    category: 'economic',
    effect: 'signal',
  },
  soc_001: {
    scene: 'event_soc_001',
    category: 'social',
    effect: 'smoke',
  },
  int_001: {
    scene: 'event_int_001',
    category: 'international',
    effect: 'signal',
  },
  cri_debt_001: {
    scene: 'event_cri_debt_001',
    category: 'crisis',
    effect: 'signal',
  },
  char_min_001: {
    scene: 'event_char_min_001',
    category: 'economic',
    effect: 'signal',
  },
  life_pop_001: {
    scene: 'event_life_pop_001',
    category: 'political',
    effect: 'confetti',
  },
  arg_001: {
    scene: 'event_arg_001',
    category: 'economic',
    effect: 'signal',
  },
  hist_hiper_001: {
    scene: 'event_hist_hiper_001',
    category: 'economic',
    effect: 'signal',
  },
  scn_001: {
    scene: 'event_scn_001',
    category: 'political',
    effect: 'flash',
  },
  law_001: {
    scene: 'event_law_001',
    category: 'political',
    effect: 'flash',
  },
  session_law_001: {
    scene: 'event_session_law_001',
    category: 'political',
    effect: 'flash',
  },
  new_004: {
    scene: 'event_new_004',
    category: 'political',
    effect: 'flash',
  },
  con_001: {
    scene: 'event_con_001',
    category: 'political',
    effect: 'flash',
  },
  geo_001: {
    scene: 'event_geo_001',
    category: 'international',
    effect: 'signal',
  },
  malvinas_001: {
    scene: 'event_malvinas_001',
    category: 'political',
    effect: 'flash',
  },
  pol_002: {
    scene: 'event_pol_002',
    category: 'political',
    effect: 'smoke',
  },
  eco_002: {
    scene: 'event_eco_002',
    category: 'economic',
    effect: 'signal',
  },
  soc_002: {
    scene: 'event_soc_002',
    category: 'social',
    effect: 'smoke',
  },
  int_002: {
    scene: 'event_int_002',
    category: 'international',
    effect: 'signal',
  },
  cri_debt_002: {
    scene: 'event_cri_debt_002',
    category: 'crisis',
    effect: 'signal',
  },
  char_min_002: {
    scene: 'event_char_min_002',
    category: 'economic',
    effect: 'signal',
  },
  life_stab_001: {
    scene: 'event_life_stab_001',
    category: 'social',
    effect: 'signal',
  },
  arg_004: {
    scene: 'event_arg_004',
    category: 'political',
    effect: 'flash',
  },
  hist_hiper_002: {
    scene: 'event_hist_hiper_002',
    category: 'political',
    effect: 'flash',
  },
  scn_002: {
    scene: 'event_scn_002',
    category: 'social',
    effect: 'signal',
  },
  law_002: {
    scene: 'event_law_002',
    category: 'economic',
    effect: 'confetti',
  },
  session_law_002: {
    scene: 'event_session_law_002',
    category: 'economic',
    effect: 'signal',
  },
  new_006: {
    scene: 'event_new_006',
    category: 'international',
    effect: 'smoke',
  },
  con_002: {
    scene: 'event_con_002',
    category: 'political',
    effect: 'flash',
  },
  geo_007: {
    scene: 'event_geo_007',
    category: 'international',
    effect: 'signal',
  },
  malvinas_002: {
    scene: 'event_malvinas_002',
    category: 'international',
    effect: 'signal',
  },
  pol_003: {
    scene: 'event_pol_003',
    category: 'political',
    effect: 'flash',
  },
  eco_003: {
    scene: 'event_eco_003',
    category: 'economic',
    effect: 'signal',
  },
  soc_003: {
    scene: 'event_soc_003',
    category: 'social',
    effect: 'signal',
  },
  int_003: {
    scene: 'event_int_003',
    category: 'international',
    effect: 'signal',
  },
  cri_debt_003: {
    scene: 'event_cri_debt_003',
    category: 'crisis',
    effect: 'signal',
  },
  char_min_003: {
    scene: 'event_char_min_003',
    category: 'political',
    effect: 'flash',
  },
  life_inf_001: {
    scene: 'event_life_inf_001',
    category: 'economic',
    effect: 'signal',
  },
  arg_005: {
    scene: 'event_arg_005',
    category: 'economic',
    effect: 'signal',
  },
  hist_hiper_003: {
    scene: 'event_hist_hiper_003',
    category: 'economic',
    effect: 'signal',
  },
  scn_003: {
    scene: 'event_scn_003',
    category: 'economic',
    effect: 'signal',
  },
  law_003: {
    scene: 'event_law_003',
    category: 'social',
    effect: 'signal',
  },
  session_law_003: {
    scene: 'event_session_law_003',
    category: 'social',
    effect: 'signal',
  },
  new_007: {
    scene: 'event_new_007',
    category: 'social',
    effect: 'smoke',
  },
  con_003: {
    scene: 'event_con_003',
    category: 'political',
    effect: 'flash',
  },
  geo_008: {
    scene: 'event_geo_008',
    category: 'international',
    effect: 'signal',
  },
  malvinas_003: {
    scene: 'event_malvinas_003',
    category: 'international',
    effect: 'signal',
  },
  pol_004: {
    scene: 'event_pol_004',
    category: 'political',
    effect: 'flash',
  },
  eco_004: {
    scene: 'event_eco_004',
    category: 'economic',
    effect: 'signal',
  },
  soc_004: {
    scene: 'event_soc_004',
    category: 'social',
    effect: 'signal',
  },
  int_004: {
    scene: 'event_int_004',
    category: 'international',
    effect: 'signal',
  },
  cri_hyper_001: {
    scene: 'event_cri_hyper_001',
    category: 'crisis',
    effect: 'signal',
  },
  char_sind_001: {
    scene: 'event_char_sind_001',
    category: 'social',
    effect: 'signal',
  },
  life_mkt_001: {
    scene: 'event_life_mkt_001',
    category: 'economic',
    effect: 'signal',
  },
  arg_006: {
    scene: 'event_arg_006',
    category: 'political',
    effect: 'flash',
  },
  hist_corral_001: {
    scene: 'event_hist_corral_001',
    category: 'economic',
    effect: 'signal',
  },
  scn_004: {
    scene: 'event_scn_004',
    category: 'social',
    effect: 'signal',
  },
  law_004: {
    scene: 'event_law_004',
    category: 'economic',
    effect: 'signal',
  },
  session_law_004: {
    scene: 'event_session_law_004',
    category: 'social',
    effect: 'signal',
  },
  con_004: {
    scene: 'event_con_004',
    category: 'political',
    effect: 'flash',
  },
  geo_002: {
    scene: 'event_geo_002',
    category: 'international',
    effect: 'signal',
  },
  malvinas_004: {
    scene: 'event_malvinas_004',
    category: 'crisis',
    effect: 'signal',
  },
  pol_005: {
    scene: 'event_pol_005',
    category: 'political',
    effect: 'flash',
  },
  eco_005: {
    scene: 'event_eco_005',
    category: 'economic',
    effect: 'signal',
  },
  soc_005: {
    scene: 'event_soc_005',
    category: 'social',
    effect: 'signal',
  },
  int_005: {
    scene: 'event_int_005',
    category: 'international',
    effect: 'signal',
  },
  cri_hyper_002: {
    scene: 'event_cri_hyper_002',
    category: 'crisis',
    effect: 'signal',
  },
  char_sind_002: {
    scene: 'event_char_sind_002',
    category: 'social',
    effect: 'smoke',
  },
  life_cur_001: {
    scene: 'event_life_cur_001',
    category: 'economic',
    effect: 'signal',
  },
  arg_007: {
    scene: 'event_arg_007',
    category: 'economic',
    effect: 'signal',
  },
  hist_corral_002: {
    scene: 'event_hist_corral_002',
    category: 'political',
    effect: 'flash',
  },
  scn_005: {
    scene: 'event_scn_005',
    category: 'political',
    effect: 'flash',
  },
  law_005: {
    scene: 'event_law_005',
    category: 'economic',
    effect: 'signal',
  },
  session_law_005: {
    scene: 'event_session_law_005',
    category: 'political',
    effect: 'flash',
  },
  con_005: {
    scene: 'event_con_005',
    category: 'political',
    effect: 'flash',
  },
  geo_003: {
    scene: 'event_geo_003',
    category: 'international',
    effect: 'signal',
  },
  pol_006: {
    scene: 'event_pol_006',
    category: 'political',
    effect: 'flash',
  },
  eco_006: {
    scene: 'event_eco_006',
    category: 'economic',
    effect: 'signal',
  },
  soc_006: {
    scene: 'event_soc_006',
    category: 'social',
    effect: 'signal',
  },
  int_006: {
    scene: 'event_int_006',
    category: 'international',
    effect: 'signal',
  },
  cri_hyper_003: {
    scene: 'event_cri_hyper_003',
    category: 'crisis',
    effect: 'signal',
  },
  char_sind_003: {
    scene: 'event_char_sind_003',
    category: 'political',
    effect: 'flash',
  },
  life_res_001: {
    scene: 'event_life_res_001',
    category: 'international',
    effect: 'signal',
  },
  arg_008: {
    scene: 'event_arg_008',
    category: 'social',
    effect: 'smoke',
  },
  hist_corral_003: {
    scene: 'event_hist_corral_003',
    category: 'economic',
    effect: 'signal',
  },
  scn_006: {
    scene: 'event_scn_006',
    category: 'political',
    effect: 'flash',
  },
  law_006: {
    scene: 'event_law_006',
    category: 'international',
    effect: 'signal',
  },
  con_006: {
    scene: 'event_con_006',
    category: 'economic',
    effect: 'signal',
  },
  geo_004: {
    scene: 'event_geo_004',
    category: 'international',
    effect: 'signal',
  },
  pol_007: {
    scene: 'event_pol_007',
    category: 'political',
    effect: 'flash',
  },
  eco_007: {
    scene: 'event_eco_007',
    category: 'economic',
    effect: 'signal',
  },
  soc_007: {
    scene: 'event_soc_007',
    category: 'social',
    effect: 'signal',
  },
  int_007: {
    scene: 'event_int_007',
    category: 'international',
    effect: 'signal',
  },
  cri_social_001: {
    scene: 'event_cri_social_001',
    category: 'crisis',
    effect: 'signal',
  },
  char_per_001: {
    scene: 'event_char_per_001',
    category: 'political',
    effect: 'flash',
  },
  arg_009: {
    scene: 'event_arg_009',
    category: 'political',
    effect: 'smoke',
  },
  hist_conv_001: {
    scene: 'event_hist_conv_001',
    category: 'economic',
    effect: 'signal',
  },
  scn_007: {
    scene: 'event_scn_007',
    category: 'political',
    effect: 'flash',
  },
  law_007: {
    scene: 'event_law_007',
    category: 'economic',
    effect: 'signal',
  },
};
