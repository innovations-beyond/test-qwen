import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function Quotes() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [eventType, setEventType] = useState('');
  const [preferences, setPreferences] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !eventDate || !guestCount) {
      Alert.alert('Missing Info', 'Please fill in name, email, event date, and guest count.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/quotes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          event_date: eventDate,
          guest_count: parseInt(guestCount, 10),
          event_type: eventType,
          dessert_preferences: preferences,
        }),
      });
      if (res.ok) {
        Alert.alert('Success', 'Quote request submitted! We\'ll email you a proposal within 2 business days.');
        setName('');
        setEmail('');
        setEventDate('');
        setGuestCount('');
        setEventType('');
        setPreferences('');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.title}>Event Catering</Text>
      <Text style={styles.subtitle}>
        Tell us about your event and we&rsquo;ll send a custom dessert proposal.
      </Text>

      <TextInput style={styles.input} placeholder="Your Name *" value={name} onChangeText={setName} />
      <TextInput
        style={styles.input}
        placeholder="Email *"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput style={styles.input} placeholder="Event Date (YYYY-MM-DD) *" value={eventDate} onChangeText={setEventDate} />
      <TextInput
        style={styles.input}
        placeholder="Guest Count *"
        keyboardType="number-pad"
        value={guestCount}
        onChangeText={setGuestCount}
      />
      <TextInput style={styles.input} placeholder="Event Type (Wedding, Corporate...)" value={eventType} onChangeText={setEventType} />
      <TextInput
        style={styles.textarea}
        placeholder="Dessert preferences, dietary needs, themes..."
        multiline
        value={preferences}
        onChangeText={setPreferences}
      />

      <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.btnText}>{submitting ? 'Submitting...' : 'Request Quote'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffbf7' },
  title: { fontSize: 24, fontWeight: '700', color: '#8b2f5d', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#6b6b6b', marginBottom: 24 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e8d5c4',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  textarea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e8d5c4',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  btn: {
    backgroundColor: '#8b2f5d',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
