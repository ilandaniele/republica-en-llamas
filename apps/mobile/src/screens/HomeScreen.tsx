import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import type { Difficulty } from '@republica/game-engine';
import { useMobileGameStore } from '../stores/gameStore.js';
// useMobileGameStore is the mobile-specific Zustand store

const DIFFICULTIES: { id: Difficulty; label: string; flavor: string }[] = [
  { id: 'easy', label: 'Fácil', flavor: 'El viento sopla a tu favor.' },
  { id: 'normal', label: 'Normal', flavor: 'La república tiembla.' },
  { id: 'hard', label: 'Difícil', flavor: 'El abismo te mira.' },
  { id: 'crisis', label: 'Crisis', flavor: 'Todo está en llamas.' },
];

export default function HomeScreen() {
  const router = useRouter();
  const startNewGame = useMobileGameStore((s) => s.startNewGame);
  const gameState = useMobileGameStore((s) => s.gameState);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');

  const handleStart = () => {
    startNewGame(selectedDifficulty);
    void router.push('/game');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoMain}>República</Text>
        <Text style={styles.logoSub}>en Llamas</Text>
        <Text style={styles.logoTagline}>SIMULADOR DE DECISIONES POLÍTICAS</Text>
      </View>

      {/* Difficulty selector */}
      <Text style={styles.sectionTitle}>DIFICULTAD</Text>
      {DIFFICULTIES.map((d) => (
        <TouchableOpacity
          key={d.id}
          onPress={() => setSelectedDifficulty(d.id)}
          style={[
            styles.difficultyCard,
            selectedDifficulty === d.id && styles.difficultyCardSelected,
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.difficultyLabel}>{d.label}</Text>
          <Text style={styles.difficultyFlavor}>{d.flavor}</Text>
        </TouchableOpacity>
      ))}

      {/* Buttons */}
      <TouchableOpacity onPress={handleStart} style={styles.primaryButton} activeOpacity={0.9}>
        <Text style={styles.primaryButtonText}>NUEVA PARTIDA</Text>
      </TouchableOpacity>

      {gameState && !gameState.isGameOver && (
        <TouchableOpacity
          onPress={() => router.push('/game')}
          style={styles.secondaryButton}
          activeOpacity={0.9}
        >
          <Text style={styles.secondaryButtonText}>
            Continuar — Turno {gameState.turn}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => router.push('/leaderboard')}
        style={styles.tertiaryButton}
      >
        <Text style={styles.tertiaryButtonText}>Tabla de Líderes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040c17',
  },
  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoMain: {
    fontSize: 42,
    fontWeight: '900',
    color: '#cc2222',
    letterSpacing: -1,
  },
  logoSub: {
    fontSize: 42,
    fontWeight: '900',
    color: '#d4af37',
    letterSpacing: -1,
    marginTop: -8,
  },
  logoTagline: {
    fontSize: 10,
    color: '#606060',
    letterSpacing: 3,
    marginTop: 8,
    fontFamily: 'monospace',
  },
  sectionTitle: {
    fontSize: 11,
    color: '#606060',
    letterSpacing: 3,
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  difficultyCard: {
    backgroundColor: '#091525',
    borderWidth: 1,
    borderColor: '#162d4a',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  difficultyCardSelected: {
    borderColor: '#d4af37',
    backgroundColor: '#162d4a',
  },
  difficultyLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f0f0f0',
    marginBottom: 4,
  },
  difficultyFlavor: {
    fontSize: 12,
    color: '#808080',
    fontStyle: 'italic',
  },
  primaryButton: {
    backgroundColor: '#cc2222',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#f0f0f0',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  secondaryButton: {
    backgroundColor: '#091525',
    borderWidth: 1,
    borderColor: '#162d4a',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: '#a0a0a0',
    fontSize: 14,
  },
  tertiaryButton: {
    padding: 14,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    color: '#606060',
    fontSize: 13,
    fontFamily: 'monospace',
  },
});
