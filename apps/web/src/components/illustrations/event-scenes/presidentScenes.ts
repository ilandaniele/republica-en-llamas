import manifest from '../../../assets/image-manifest.json';
import { PRESIDENT_EXPANSION_ART } from '@republica/game-engine';
import { politicianFor } from '../portraits/portraits.js';
import { PRESIDENT_STORY_ART } from './presidentStoryArt.js';

export const PRESIDENT_SCENE_IDS = [
  'milei',
  'massa',
  'bullrich',
  'bregman',
  'schiaretti',
  'larreta',
  'nestor',
  'cristina',
  'macri',
  'del_cano',
  'kicillof',
  'grabois',
] as const;
export const PRESIDENT_CONTEXTS = ['office', 'congress', 'press', 'diplomacy', 'crisis'] as const;
export type PresidentContext = (typeof PRESIDENT_CONTEXTS)[number];

const BASE_CONTEXTS: Record<string, PresidentContext> = {
  pol_congress: 'congress',
  pol_veto: 'office',
  pol_scandal: 'press',
  arg_congreso_ley: 'congress',
  arg_fmi_negocio: 'diplomacy',
  int_imf: 'diplomacy',
  int_war: 'crisis',
  guerra_join: 'crisis',
  guerra_nuke_threat: 'crisis',
  crisis: 'crisis',
  crisis_impeachment: 'crisis',
};

// Only replace scenes in which the player is acting as president. Events about
// named historical people, citizens, disasters or alleged crimes keep their art.
const EVENT_CONTEXTS: Record<string, PresidentContext> = {
  pol_003: 'office',
  pol_004: 'congress',
  pol_007: 'crisis',
  pol_009: 'diplomacy',
  pol_010: 'congress',
  pol_012: 'office',
  pol_014: 'office',
  pol_015: 'diplomacy',
  pol_chain_002: 'press',
  pol_chain_003: 'diplomacy',
  int_001: 'diplomacy',
  int_004: 'diplomacy',
  int_005: 'diplomacy',
  int_008: 'press',
  int_010: 'press',
  int_011: 'diplomacy',
  int_012: 'diplomacy',
  int_013: 'crisis',
  arg_006: 'office',
  arg_007: 'diplomacy',
  arg_014: 'crisis',
  scn_012: 'diplomacy',
  scn_013: 'office',
  scn_014: 'congress',
  scn_015: 'office',
  scn_018: 'diplomacy',
  scn_019: 'congress',
  new_006: 'diplomacy',
  geo_007: 'diplomacy',
  geo_008: 'diplomacy',
  guerra_001: 'crisis',
  guerra_002: 'crisis',
  malvinas_001: 'diplomacy',
};

export function presidentContext(scene: string, eventId: string): PresidentContext | undefined {
  if (PRESIDENT_EXPANSION_ART[eventId]) return PRESIDENT_EXPANSION_ART[eventId];
  if (PRESIDENT_STORY_ART[eventId]) return PRESIDENT_STORY_ART[eventId];
  if (eventId.startsWith('party_')) return 'office';
  if (eventId.startsWith('law_') || eventId.startsWith('session_law_')) return 'congress';
  if (eventId.startsWith('cri_')) return 'crisis';
  return EVENT_CONTEXTS[eventId] ?? BASE_CONTEXTS[scene];
}

export function selectPresidentScene(scene: string, eventId: string, presidentId: string): string {
  const context = presidentContext(scene, eventId);
  if (!context) return scene;
  const candidate = `president_${politicianFor(presidentId)}_${context}`;
  return (manifest as Record<string, string>)[candidate] ? candidate : scene;
}

export function presidentSceneEffect(scene: string): 'flash' | 'signal' | undefined {
  if (!scene.startsWith('president_')) return undefined;
  return scene.endsWith('_press') || scene.endsWith('_congress') ? 'flash' : 'signal';
}
