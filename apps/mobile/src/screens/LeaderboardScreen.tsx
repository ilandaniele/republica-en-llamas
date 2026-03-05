import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function LeaderboardScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tabla de Líderes</Text>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={styles.back}>← Volver</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Configura las credenciales de Supabase{'\n'}
          para ver el ranking global.
        </Text>
        <Text style={styles.placeholderSub}>
          Copia .env.example a .env y completa{'\n'}EXPO_PUBLIC_SUPABASE_URL y ANON_KEY
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#040c17', padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#d4af37' },
  back: { fontSize: 14, color: '#808080', fontFamily: 'monospace' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: '#808080', fontFamily: 'monospace', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  placeholderSub: { color: '#404040', fontFamily: 'monospace', fontSize: 11, textAlign: 'center', marginTop: 12, lineHeight: 16 },
});
