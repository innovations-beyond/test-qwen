import { StyleSheet, Text, View } from 'react-native';

export default function Account() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Account</Text>
      <Text style={styles.message}>
        Sign in to view your order history, saved addresses, and reorder favorites.
      </Text>
      <Text style={styles.comingSoon}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  title: { fontSize: 24, fontWeight: '700', color: '#8b2f5d', marginBottom: 12 },
  message: { fontSize: 16, color: '#6b6b6b', textAlign: 'center', marginBottom: 16 },
  comingSoon: { fontSize: 14, color: '#999', fontStyle: 'italic' },
});
