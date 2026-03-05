import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
  SlideInDown,
} from 'react-native-reanimated';
import { useMobileGameStore } from '../stores/gameStore.js';

export default function GameScreen() {
  const router = useRouter();
  const gameState = useMobileGameStore((s) => s.gameState);
  const currentCard = useMobileGameStore((s) => s.currentCard);
  const pendingChoiceIndex = useMobileGameStore((s) => s.pendingChoiceIndex);
  const isAnimating = useMobileGameStore((s) => s.isAnimating);
  const selectChoice = useMobileGameStore((s) => s.selectChoice);
  const confirmChoice = useMobileGameStore((s) => s.confirmChoice);
  const advanceTurnAction = useMobileGameStore((s) => s.advanceTurnAction);

  useEffect(() => {
    if (!gameState) { router.replace('/'); return; }
    if (gameState.isGameOver) { router.replace('/gameover'); return; }
  }, [gameState, router]);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => advanceTurnAction(), 800);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, advanceTurnAction]);

  if (!gameState || !currentCard) return null;

  const { political, economic, congress } = gameState;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>República en Llamas</Text>
        <View style={styles.headerStats}>
          <Text style={styles.statText}>T{gameState.turn}/50</Text>
          <Text style={styles.statText}>{gameState.score.toLocaleString()}pts</Text>
        </View>
      </View>

      {/* Quick stats */}
      <View style={styles.statsRow}>
        <StatBadge label="Pop" value={Math.round(political.popularity)} max={100} />
        <StatBadge label="Est" value={Math.round(political.socialStability)} max={100} />
        <StatBadge label="Inf" value={Math.round(economic.inflation)} max={200} inverse />
        <StatBadge label="Déf" value={Math.round(economic.publicDeficit)} max={100} inverse />
        <StatBadge label="Mkt" value={Math.round(economic.marketConfidence)} max={100} />
      </View>

      {/* Crisis alerts */}
      {gameState.activeCrises.length > 0 && (
        <View style={styles.crisisBanner}>
          <Text style={styles.crisisText}>
            ⚠ {gameState.activeCrises.length} crisis activa{gameState.activeCrises.length > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Event card */}
      {!isAnimating && currentCard && (
        <Animated.View entering={SlideInDown.springify()} style={styles.eventCard}>
          <Text style={styles.cardCategory}>
            {currentCard.category.toUpperCase()}
          </Text>
          <Text style={styles.cardTitle}>{currentCard.id}</Text>

          {/* Choices */}
          <View style={styles.choices}>
            {currentCard.choices.map((choice, index) => {
              const isSelected = pendingChoiceIndex === index;
              return (
                <TouchableOpacity
                  key={choice.id}
                  onPress={() => pendingChoiceIndex === null && selectChoice(currentCard.id, index)}
                  style={[
                    styles.choiceCard,
                    isSelected && styles.choiceCardSelected,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.choiceLetter}>
                    {String.fromCharCode(65 + index)}.
                  </Text>
                  <Text style={styles.choiceText}>{choice.textKey}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {pendingChoiceIndex !== null && (
            <TouchableOpacity onPress={confirmChoice} style={styles.confirmButton} activeOpacity={0.9}>
              <Text style={styles.confirmButtonText}>Confirmar Decisión</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}

      {isAnimating && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Aplicando decisión...</Text>
        </View>
      )}
    </ScrollView>
  );
}

function StatBadge({ label, value, max, inverse = false }: {
  label: string;
  value: number;
  max: number;
  inverse?: boolean;
}) {
  const pct = (value / max) * 100;
  const isWarning = inverse ? pct > 65 : pct < 30;
  const textColor = isWarning ? '#e05555' : '#d4af37';

  return (
    <View style={badgeStyles.container}>
      <Text style={[badgeStyles.value, { color: textColor }]}>{value}</Text>
      <Text style={badgeStyles.label}>{label}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  label: {
    fontSize: 9,
    color: '#606060',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040c17',
  },
  content: {
    padding: 16,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#162d4a',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#d4af37',
  },
  headerStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statText: {
    fontSize: 13,
    color: '#d4af37',
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#091525',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  crisisBanner: {
    backgroundColor: '#8f1616',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  crisisText: {
    color: '#ffcccc',
    fontFamily: 'monospace',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '700',
  },
  eventCard: {
    backgroundColor: '#091525',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#162d4a',
    borderLeftWidth: 4,
    borderLeftColor: '#d4af37',
  },
  cardCategory: {
    fontSize: 10,
    color: '#d4af37',
    fontFamily: 'monospace',
    letterSpacing: 3,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f0f0f0',
    marginBottom: 12,
  },
  choices: {
    marginTop: 8,
    gap: 8,
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#162d4a',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  choiceCardSelected: {
    borderColor: '#d4af37',
    backgroundColor: '#1e3a5f',
  },
  choiceLetter: {
    fontSize: 13,
    fontWeight: '700',
    color: '#d4af37',
    fontFamily: 'monospace',
    width: 20,
  },
  choiceText: {
    fontSize: 13,
    color: '#e0e0e0',
    flex: 1,
    lineHeight: 18,
  },
  confirmButton: {
    backgroundColor: '#d4af37',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmButtonText: {
    color: '#040c17',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  loadingText: {
    color: '#d4af37',
    fontSize: 16,
    fontFamily: 'monospace',
  },
});
