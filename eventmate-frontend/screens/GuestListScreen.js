import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { getGuestsByEvent, updateGuestRSVP, deleteGuest } from '../api/api';

export default function GuestListScreen({ route, navigation }) {
  const { eventId } = route.params;
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchGuests();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const response = await getGuestsByEvent(eventId);
      if (response.success) {
        setGuests(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch guests');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVPChange = async (guestId, currentStatus) => {
    const statuses = ['pending', 'confirmed', 'declined'];
    const currentIndex = statuses.indexOf(currentStatus);
    const newStatus = statuses[(currentIndex + 1) % statuses.length];
    
    try {
      await updateGuestRSVP(guestId, newStatus);
      fetchGuests();
    } catch (error) {
      Alert.alert('Error', 'Failed to update RSVP');
    }
  };

  const handleDeleteGuest = (guestId, guestName) => {
    Alert.alert('Delete Guest', `Remove ${guestName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await deleteGuest(guestId);
          fetchGuests();
        } catch (error) {
          Alert.alert('Error', 'Failed to delete guest');
        }
      }},
    ]);
  };

  const renderGuest = ({ item }) => (
    <TouchableOpacity
      style={styles.guestCard}
      onPress={() => handleRSVPChange(item._id, item.rsvpStatus)}
      onLongPress={() => handleDeleteGuest(item._id, item.name)}
    >
      <View style={styles.guestInfo}>
        <Text style={styles.guestName}>{item.name}</Text>
        {item.email && <Text style={styles.guestDetail}>📧 {item.email}</Text>}
        {item.phone && <Text style={styles.guestDetail}>📱 {item.phone}</Text>}
        {item.dietaryRestrictions && (
          <Text style={styles.guestDetail}>🍽️ {item.dietaryRestrictions}</Text>
        )}
      </View>
      <View style={[styles.rsvpBadge, getRSVPStyle(item.rsvpStatus)]}>
        <Text style={styles.rsvpText}>{item.rsvpStatus}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={guests}
        renderItem={renderGuest}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchGuests} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No guests yet</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddGuest', { eventId })}
            >
              <Text style={styles.addButtonText}>+ Add Guest</Text>
            </TouchableOpacity>
          </View>
        }
      />
      {guests.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddGuest', { eventId })}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const getRSVPStyle = (status) => {
  const styles = {
    confirmed: { backgroundColor: '#d1fae5' },
    pending: { backgroundColor: '#fef3c7' },
    declined: { backgroundColor: '#fee2e2' },
  };
  return styles[status] || { backgroundColor: '#f3f4f6' };
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  listContainer: { padding: 15 },
  guestCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guestInfo: { flex: 1 },
  guestName: { fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginBottom: 5 },
  guestDetail: { fontSize: 13, color: '#6b7280', marginBottom: 2 },
  rsvpBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  rsvpText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  emptyContainer: { alignItems: 'center', padding: 40, marginTop: 100 },
  emptyText: { fontSize: 18, color: '#6b7280', marginBottom: 20 },
  addButton: { backgroundColor: '#6366f1', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabIcon: { fontSize: 32, color: '#fff', fontWeight: 'bold' },
});
