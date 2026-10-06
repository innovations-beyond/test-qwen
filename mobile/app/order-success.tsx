import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function OrderSuccess() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>Order Placed!</Text>
      <Text style={styles.message}>
        Thank you for your order. You&rsquo;ll receive a confirmation email shortly.
      </Text>
      <Link href="/" style={styles.btn}>
        <Text style={styles.btnText}>Back to Home</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#8b2f5d', marginBottom: 12 },
  message: { fontSize: 16, color: '#6b6b6b', textAlign: 'center', marginBottom: 32 },
  btn: {
    backgroundColor: '#8b2f5d',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
