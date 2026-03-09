import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useMobileGameStore } from '../stores/gameStore.js';
import { useRewardedAd } from '../hooks/useRewardedAd.js';
import { trackGameOver } from '../lib/analytics.js';

const HEADLINES: Record<string, string> = {
  hyperinflation: 'HIPERINFLACIÓN: La República Colapsa',
  popularityCollapse: 'EL PUEBLO ABANDONA AL PRESIDENTE',
  socialCollapse: 'COLAPSO SOCIAL TOTAL',
  bankrupt: 'BANCARROTA SOBERANA',
  impeachment: 'DESTITUCIÓN HISTÓRICA',
  term_complete: '¡MANDATO COMPLETADO!',
};

export default function GameOverScreen() {
  const router = useRouter();
  const gameState = useMobileGameStore((s) => s.gameState);
  const resetGame = useMobileGameStore((s) => s.resetGame);
  const restoreFromTurn = useMobileGameStore((s) => s.restoreFromTurn);

  if (!gameState) { router.replace('/'); return null; }

  const reason = gameState.gameOverReason ?? 'hyperinflation';
  const isWin = reason === 'term_complete';
  const headline = HEADLINES[reason] ?? 'EL GOBIERNO HA CAÍDO';
  const continueTurn = Math.max(1, gameState.turn - 3);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isLoaded: adReady, isLoading: adLoading, showAd, adsDisabled } = useRewardedAd({
    placement: 'game_over',
    onRewarded: () => {
      if (restoreFromTurn) restoreFromTurn(continueTurn);
      router.replace('/game');
    },
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    trackGameOver({
      turns_survived: gameState.turn,
      reason,
      score: gameState.score,
      difficulty: gameState.difficulty ?? 'normal',
      president: gameState.presidentId ?? 'ingeniero',
    });
  }, []);

  const handlePlayAgain = () => {
    resetGame();
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Newspaper header */}
      <View style={[styles.newspaper, isWin ? styles.newspaperWin : styles.newspaperLoss]}>
        <Text style={styles.newsPaper}>LA GACETA DE LA REPÚBLICA</Text>
        <Text style={[styles.headline, isWin ? styles.headlineWin : styles.headlineLoss]}>
          {headline}
        </Text>
      </View>

      {/* Score breakdown */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreTitle}>Informe Final</Text>
        <ScoreRow label="Turnos" value={`${gameState.turn}/50`} />
        <ScoreRow label="Popularidad" value={`${Math.round(gameState.political.popularity)}%`} />
        <ScoreRow label="Inflación" value={`${gameState.economic.inflation.toFixed(1)}%`} />
        <ScoreRow label="Leyes" value={String(gameState.congress.lawsPassedThisRun)} />
        <View style={styles.totalScore}>
          <Text style={styles.totalLabel}>PUNTAJE FINAL</Text>
          <Text style={[styles.totalValue, isWin ? styles.winScore : styles.lossScore]}>
            {gameState.score.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Rewarded ad continue */}
      {!isWin && !adsDisabled && (
        <TouchableOpacity
          onPress={showAd}
          style={[styles.continueButton, !adReady && styles.disabledButton]}
          disabled={!adReady || adLoading}
          activeOpacity={0.85}
        >
          {adLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueText}>
              📺 Ver anuncio → Continuar desde T{continueTurn}
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* Actions */}
      <TouchableOpacity onPress={handlePlayAgain} style={styles.playAgainButton} activeOpacity={0.9}>
        <Text style={styles.playAgainText}>UNA MÁS →</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/')} style={styles.homeButton}>
        <Text style={styles.homeText}>← Inicio</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ScoreRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={scoreStyles.row}>
      <Text style={scoreStyles.label}>{label}</Text>
      <Text style={scoreStyles.value}>{value}</Text>
    </View>
  );
}

const scoreStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: { fontSize: 13, color: '#606060', fontFamily: 'monospace' },
  value: { fontSize: 13, fontWeight: '700', color: '#202020', fontFamily: 'monospace' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#040c17' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  newspaper: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
  },
  newspaperWin: { backgroundColor: '#f0fff0', borderColor: '#16a34a' },
  newspaperLoss: { backgroundColor: '#fff5f5', borderColor: '#cc2222' },
  newsPaper: { fontSize: 10, color: '#606060', fontFamily: 'monospace', letterSpacing: 3, marginBottom: 8, textAlign: 'center' },
  headline: { fontSize: 22, fontWeight: '900', textAlign: 'center', lineHeight: 28 },
  headlineWin: { color: '#15803d' },
  headlineLoss: { color: '#b01d1d' },
  scoreCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  scoreTitle: { fontSize: 16, fontWeight: '800', color: '#202020', marginBottom: 12, fontFamily: 'serif' },
  totalScore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  totalLabel: { fontSize: 12, fontWeight: '700', color: '#404040', fontFamily: 'monospace', letterSpacing: 1 },
  totalValue: { fontSize: 26, fontWeight: '900', fontFamily: 'monospace' },
  winScore: { color: '#15803d' },
  lossScore: { color: '#b01d1d' },
  playAgainButton: {
    backgroundColor: '#cc2222',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginBottom: 10,
  },
  playAgainText: { color: '#f0f0f0', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  homeButton: { padding: 14, alignItems: 'center' },
  homeText: { color: '#606060', fontSize: 14, fontFamily: 'monospace' },
  continueButton: {
    backgroundColor: '#1a5276',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2e86c1',
  },
  disabledButton: { opacity: 0.5 },
  continueText: { color: '#aed6f1', fontSize: 14, fontWeight: '700', fontFamily: 'monospace' },
});
