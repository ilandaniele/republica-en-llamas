import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboard } from '../lib/api';

export default function LeaderboardScreen() {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({ queryKey: ['leaderboard'], queryFn: fetchLeaderboard });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tabla de Líderes</Text>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={styles.back}>← Volver</Text>
        </TouchableOpacity>
      </View>
      {isLoading && <Text style={styles.message}>Cargando tabla...</Text>}
      {error && <Text style={styles.message}>No se pudo cargar el ranking.</Text>}
      {data && data.length === 0 && <Text style={styles.message}>Aún no hay puntajes registrados.</Text>}
      <FlatList
        data={data ?? []}
        keyExtractor={(entry) => entry.id}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.name}>{item.username}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#040c17', padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#d4af37' },
  back: { fontSize: 14, color: '#808080', fontFamily: 'monospace' },
  message: { color: '#808080', fontFamily: 'monospace', fontSize: 13, textAlign: 'center', marginTop: 40 },
  row: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#14213d' },
  rank: { width: 32, color: '#d4af37', fontFamily: 'monospace' },
  name: { flex: 1, color: '#e0e0e0', fontFamily: 'monospace' },
  score: { color: '#d4af37', fontFamily: 'monospace', fontWeight: '700' },
});
