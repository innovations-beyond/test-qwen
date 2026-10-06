import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import type { DessertItem } from '@/lib/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function Menu() {
  const [items, setItems] = useState<DessertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/desserts/`)
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading desserts...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>
          {item.serving_size ? <Text style={styles.serving}>{item.serving_size}</Text> : null}
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.availability}>
              {item.availability === 'both' ? 'Delivery + Pickup' : item.availability}
            </Text>
            <Link href="/cart" asChild>
              <TouchableOpacity style={styles.orderBtn}>
                <Text style={styles.orderBtnText}>Order</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: { fontSize: 17, fontWeight: '600', flex: 1, marginRight: 8 },
  price: { fontSize: 16, fontWeight: '700', color: '#8b2f5d' },
  serving: { fontSize: 13, color: '#6b6b6b', marginBottom: 4 },
  description: { fontSize: 14, color: '#6b6b6b', marginBottom: 12 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availability: { fontSize: 13, color: '#6b6b6b' },
  orderBtn: {
    backgroundColor: '#8b2f5d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  orderBtnText: { color: '#fff', fontWeight: '600' },
});
