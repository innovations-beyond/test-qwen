import { StyleSheet, Text, View } from 'react-native';

export default function Cart() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Order</Text>
      <Text style={styles.empty}>Your cart is empty.</Text>
      <Text style={styles.hint}>Browse the menu to add desserts.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fffbf7' },
  title: { fontSize: 24, fontWeight: '700', color: '#8b2f5d', marginBottom: 24 },
  empty: { fontSize: 18, color: '#6b6b6b', marginBottom: 8 },
  hint: { fontSize: 14, color: '#999' },
});
