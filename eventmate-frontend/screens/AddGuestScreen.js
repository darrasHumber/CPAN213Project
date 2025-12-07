import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { addGuest } from '../api/api';

export default function AddGuestScreen({ route, navigation }) {
  const { eventId } = route.params;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rsvpStatus: 'pending',
    plusOne: false,
    dietaryRestrictions: '',
    notes: '',
  });

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Guest name is required');
      return;
    }

    try {
      const guestData = { ...formData, eventId };
      const response = await addGuest(guestData);
      
      if (response.success) {
        Alert.alert('Success', 'Guest added successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add guest');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Guest name"
            value={formData.name}
            onChangeText={(value) => setFormData({ ...formData, name: value })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            value={formData.email}
            onChangeText={(value) => setFormData({ ...formData, email: value })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="+1234567890"
            value={formData.phone}
            onChangeText={(value) => setFormData({ ...formData, phone: value })}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>RSVP Status</Text>
          <View style={styles.statusContainer}>
            {['pending', 'confirmed', 'declined'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[styles.statusButton, formData.rsvpStatus === status && styles.statusButtonActive]}
                onPress={() => setFormData({ ...formData, rsvpStatus: status })}
              >
                <Text style={[styles.statusButtonText, formData.rsvpStatus === status && styles.statusButtonTextActive]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.switchGroup}>
          <Text style={styles.label}>Plus One</Text>
          <Switch
            value={formData.plusOne}
            onValueChange={(value) => setFormData({ ...formData, plusOne: value })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dietary Restrictions</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Vegetarian, Gluten-free"
            value={formData.dietaryRestrictions}
            onChangeText={(value) => setFormData({ ...formData, dietaryRestrictions: value })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Additional notes"
            value={formData.notes}
            onChangeText={(value) => setFormData({ ...formData, notes: value })}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Guest</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  form: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, fontSize: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  statusContainer: { flexDirection: 'row', gap: 8 },
  statusButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#fff' },
  statusButtonActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  statusButtonText: { fontSize: 14, color: '#6b7280', textTransform: 'capitalize' },
  statusButtonTextActive: { color: '#fff', fontWeight: '600' },
  switchGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  submitButton: { backgroundColor: '#6366f1', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  cancelButton: { backgroundColor: '#fff', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#d1d5db' },
  cancelButtonText: { color: '#6b7280', fontSize: 16, fontWeight: '600' },
});
