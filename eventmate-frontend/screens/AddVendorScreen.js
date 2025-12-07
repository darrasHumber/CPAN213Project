import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { addVendor } from '../api/api';

export default function AddVendorScreen({ route, navigation }) {
  const { eventId } = route.params;
  const [formData, setFormData] = useState({
    name: '',
    category: 'catering',
    contactPerson: '',
    email: '',
    phone: '',
    quotedPrice: '',
    status: 'researching',
    notes: '',
  });

  const categories = ['venue', 'catering', 'decorations', 'entertainment', 'photography', 'transportation', 'florist', 'other'];
  const statuses = ['researching', 'contacted', 'quoted', 'booked', 'confirmed'];

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Vendor name is required');
      return;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return;
    }

    try {
      const vendorData = {
        ...formData,
        eventId,
        quotedPrice: formData.quotedPrice ? parseFloat(formData.quotedPrice) : 0,
      };
      const response = await addVendor(vendorData);
      
      if (response.success) {
        Alert.alert('Success', 'Vendor added successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add vendor');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vendor Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Vendor name"
            value={formData.name}
            onChangeText={(value) => setFormData({ ...formData, name: value })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryButton, formData.category === cat && styles.categoryButtonActive]}
                onPress={() => setFormData({ ...formData, category: cat })}
              >
                <Text style={[styles.categoryText, formData.category === cat && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Person</Text>
          <TextInput
            style={styles.input}
            placeholder="Contact name"
            value={formData.contactPerson}
            onChangeText={(value) => setFormData({ ...formData, contactPerson: value })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone *</Text>
          <TextInput
            style={styles.input}
            placeholder="+1234567890"
            value={formData.phone}
            onChangeText={(value) => setFormData({ ...formData, phone: value })}
            keyboardType="phone-pad"
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
          <Text style={styles.label}>Quoted Price</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            value={formData.quotedPrice}
            onChangeText={(value) => setFormData({ ...formData, quotedPrice: value })}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusContainer}>
            {statuses.map((status) => (
              <TouchableOpacity
                key={status}
                style={[styles.statusButton, formData.status === status && styles.statusButtonActive]}
                onPress={() => setFormData({ ...formData, status })}
              >
                <Text style={[styles.statusButtonText, formData.status === status && styles.statusButtonTextActive]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
          <Text style={styles.submitButtonText}>Add Vendor</Text>
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
  scrollContainer: { flexDirection: 'row' },
  categoryButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#fff', marginRight: 8 },
  categoryButtonActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  categoryText: { fontSize: 14, color: '#6b7280', textTransform: 'capitalize' },
  categoryTextActive: { color: '#fff', fontWeight: '600' },
  statusContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#fff' },
  statusButtonActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  statusButtonText: { fontSize: 13, color: '#6b7280', textTransform: 'capitalize' },
  statusButtonTextActive: { color: '#fff', fontWeight: '600' },
  submitButton: { backgroundColor: '#6366f1', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  cancelButton: { backgroundColor: '#fff', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#d1d5db' },
  cancelButtonText: { color: '#6b7280', fontSize: 16, fontWeight: '600' },
});
