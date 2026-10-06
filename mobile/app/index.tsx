import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Joelle's Pastries</Text>
      <Text style={styles.subtitle}>Desserts worth celebrating</Text>

      <View style={styles.actions}>
        <Link href="/menu" asChild>
          <View style={styles.btnPrimary}>
            <Text style={styles.btnText}>Browse Menu</Text>
          </View>
        </Link>
        <Link href="/quotes" asChild>
          <View style={styles.btnSecondary}>
            <Text style={styles.btnText}>Plan an Event</Text>
          </View>
        </Link>
        <Link href="/account" asChild>
          <View style={styles.btnOutline}>
            <Text style={styles.btnText}>My Account</Text>
          </View>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fffbf7',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#8b2f5d',
    fontFamily: 'serif',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b6b6b',
    marginBottom: 40,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: '#8b2f5d',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnSecondary: {
    backgroundColor: '#f5e6d3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: '#8b2f5d',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
