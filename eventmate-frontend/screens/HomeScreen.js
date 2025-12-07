import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { getEvents } from '../api/api';

export default function HomeScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    planning: 0,
    confirmed: 0,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents();
      
      if (response.success) {
        setEvents(response.data);
        calculateStats(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch events. Make sure backend is running.');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (eventList) => {
    const now = new Date();
    const upcoming = eventList.filter(e => new Date(e.date) >= now).length;
    const planning = eventList.filter(e => e.status === 'planning').length;
    const confirmed = eventList.filter(e => e.status === 'confirmed').length;

    setStats({
      total: eventList.length,
      upcoming,
      planning,
      confirmed,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchEvents} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>EventMate</Text>
        <Text style={styles.subtitle}>Your Event Planning Assistant</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Events</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.upcoming}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.planning}</Text>
          <Text style={styles.statLabel}>Planning</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.confirmed}</Text>
          <Text style={styles.statLabel}>Confirmed</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Events', { screen: 'CreateEvent' })}
        >
          <Text style={styles.actionIcon}>➕</Text>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Create New Event</Text>
            <Text style={styles.actionSubtitle}>Start planning your event</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Events', { screen: 'EventList' })}
        >
          <Text style={styles.actionIcon}>📋</Text>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>View All Events</Text>
            <Text style={styles.actionSubtitle}>Manage your events</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Recent Events */}
      <View style={styles.recentContainer}>
        <Text style={styles.sectionTitle}>Recent Events</Text>
        
        {events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No events yet</Text>
            <Text style={styles.emptySubtext}>Create your first event to get started!</Text>
          </View>
        ) : (
          events.slice(0, 3).map((event) => (
            <TouchableOpacity
              key={event._id}
              style={styles.eventCard}
              onPress={() =>
                navigation.navigate('Events', {
                  screen: 'EventDetails',
                  params: { eventId: event._id },
                })
              }
            >
              <View style={styles.eventHeader}>
                <Text style={styles.eventName}>{event.name}</Text>
                <View style={[styles.statusBadge, getStatusStyle(event.status)]}>
                  <Text style={styles.statusText}>{event.status}</Text>
                </View>
              </View>
              <Text style={styles.eventLocation}>📍 {event.location}</Text>
              <Text style={styles.eventDate}>
                📅 {new Date(event.date).toLocaleDateString()} at {event.time}
              </Text>
              <View style={styles.eventStats}>
                <Text style={styles.eventStat}>👥 {event.guestCount} guests</Text>
                <Text style={styles.eventStat}>🏢 {event.vendorCount} vendors</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
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
  header: {
    backgroundColor: '#6366f1',
    padding: 30,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: -20,
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  actionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  recentContainer: {
    padding: 20,
  },
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
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
});
