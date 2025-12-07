import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getEventById, updateEvent } from '../api/api';

export default function EditEventScreen({ route, navigation }) {
  const { eventId } = route.params;
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
    budget: '',
    status: 'planning',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const response = await getEventById(eventId);
      
      if (response.success) {
        const event = response.data;
        setFormData({
          name: event.name,
          date: event.date.split('T')[0], // Convert to YYYY-MM-DD
          time: event.time,
          location: event.location,
          description: event.description || '',
          budget: event.budget ? event.budget.toString() : '',
          status: event.status,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load event data');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    }

    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.date)) {
        newErrors.date = 'Date must be in YYYY-MM-DD format';
      }
    }

    if (!formData.time.trim()) {
      newErrors.time = 'Time is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    try {
      const eventData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : 0,
      };

      const response = await updateEvent(eventId, eventData);

      if (response.success) {
        Alert.alert('Success', 'Event updated successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update event. Please try again.');
      console.error('Update event error:', error);
    }
  };

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading event data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Event Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Name *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="e.g., Sarah's Birthday Party"
            value={formData.name}
            onChangeText={(value) => updateFormData('name', value)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date * (YYYY-MM-DD)</Text>
          <TextInput
            style={[styles.input, errors.date && styles.inputError]}
            placeholder="e.g., 2025-08-15"
            value={formData.date}
            onChangeText={(value) => updateFormData('date', value)}
          />
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
          <Text style={styles.helperText}>Format: YYYY-MM-DD (e.g., 2025-12-25)</Text>
        </View>

        {/* Time */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time * (HH:MM)</Text>
          <TextInput
            style={[styles.input, errors.time && styles.inputError]}
            placeholder="e.g., 18:00"
            value={formData.time}
            onChangeText={(value) => updateFormData('time', value)}
          />
          {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}
          <Text style={styles.helperText}>24-hour format (e.g., 14:30 or 18:00)</Text>
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={[styles.input, errors.location && styles.inputError]}
            placeholder="e.g., Grand Hotel Ballroom"
            value={formData.location}
            onChangeText={(value) => updateFormData('location', value)}
          />
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Brief description of your event"
            value={formData.description}
            onChangeText={(value) => updateFormData('description', value)}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Budget */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Budget (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 5000"
            value={formData.budget}
            onChangeText={(value) => updateFormData('budget', value)}
            keyboardType="numeric"
          />
          <Text style={styles.helperText}>Enter amount in dollars (numbers only)</Text>
        </View>

        {/* Status */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusContainer}>
            {['planning', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  formData.status === status && styles.statusButtonActive,
                ]}
                onPress={() => updateFormData('status', status)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    formData.status === status && styles.statusButtonTextActive,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Update Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Update Event</Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    marginTop: 4,
  },
  helperText: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  statusButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  statusButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
});
