import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { getEvents, deleteEvent } from '../api/api';

export default function EventListScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEvents();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents();
      
      if (response.success) {
        setEvents(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = (eventId, eventName) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${eventName}"? This will also delete all guests and vendors.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEvent(eventId);
              Alert.alert('Success', 'Event deleted successfully');
              fetchEvents();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  const renderEventCard = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetails', { eventId: item._id })}
      onLongPress={() => handleDeleteEvent(item._id, item.name)}
    >
      <View style={styles.eventHeader}>
        <Text style={styles.eventName}>{item.name}</Text>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={styles.eventLocation}>📍 {item.location}</Text>
      <Text style={styles.eventDate}>
        📅 {new Date(item.date).toLocaleDateString()} at {item.time}
      </Text>
      
      {item.description && (
        <Text style={styles.eventDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      
      <View style={styles.eventStats}>
        <Text style={styles.eventStat}>👥 {item.guestCount} guests</Text>
        <Text style={styles.eventStat}>🏢 {item.vendorCount} vendors</Text>
        {item.budget > 0 && (
          <Text style={styles.eventStat}>💰 ${item.budget.toLocaleString()}</Text>
        )}
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.tapText}>Tap to view details • Long press to delete</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchEvents} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No events yet</Text>
            <Text style={styles.emptySubtext}>Create your first event to get started!</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('CreateEvent')}
            >
              <Text style={styles.createButtonText}>+ Create Event</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      {events.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateEvent')}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const getStatusStyle = (status) => {
  switch (status) {
    case 'planning':
      return { backgroundColor: '#fef3c7' };
    case 'confirmed':
      return { backgroundColor: '#d1fae5' };
    case 'completed':
      return { backgroundColor: '#e0e7ff' };
    case 'cancelled':
      return { backgroundColor: '#fee2e2' };
    default:
      return { backgroundColor: '#f3f4f6' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContainer: {
    padding: 15,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    textTransform: 'capitalize',
  },
  eventLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 10,
  },
  eventStats: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  eventStat: {
    fontSize: 13,
    color: '#6b7280',
    marginRight: 15,
  },
  cardFooter: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  tapText: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
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
  fabIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
});
