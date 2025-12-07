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
import { getEventDetails } from '../api/api';

export default function EventDetailsScreen({ route, navigation }) {
  const { eventId } = route.params;
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEventDetails();
    });
    return unsubscribe;
  }, [navigation, eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await getEventDetails(eventId);
      
      if (response.success) {
        setEventData(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  if (!eventData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const { event, guests, guestStats, vendors, vendorStats } = eventData;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchEventDetails} />
      }
    >
      {/* Event Info Card */}
      <View style={styles.card}>
        <Text style={styles.eventName}>{event.name}</Text>
        <View style={[styles.statusBadge, getStatusStyle(event.status)]}>
          <Text style={styles.statusText}>{event.status}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.infoText}>
            {new Date(event.date).toLocaleDateString()} at {event.time}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.infoText}>{event.location}</Text>
        </View>
        
        {event.description && (
          <View style={styles.infoRow}>
            <Text style={styles.icon}>📝</Text>
            <Text style={styles.infoText}>{event.description}</Text>
          </View>
        )}
        
        {event.budget > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.icon}>💰</Text>
            <Text style={styles.infoText}>Budget: ${event.budget.toLocaleString()}</Text>
          </View>
        )}
      </View>

      {/* Statistics */}
      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{guestStats.total}</Text>
            <Text style={styles.statLabel}>Total Guests</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{guestStats.confirmed}</Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{vendorStats.total}</Text>
            <Text style={styles.statLabel}>Vendors</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{vendorStats.booked}</Text>
            <Text style={styles.statLabel}>Booked</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Manage</Text>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('EditEvent', { eventId: event._id })}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionIcon}>✏️</Text>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Edit Event</Text>
              <Text style={styles.actionSubtitle}>Update event details</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('GuestList', { eventId: event._id })}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionIcon}>👥</Text>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Guest List</Text>
              <Text style={styles.actionSubtitle}>
                {guestStats.total} guests • {guestStats.confirmed} confirmed
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('VendorList', { eventId: event._id })}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionIcon}>🏢</Text>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Vendors</Text>
              <Text style={styles.actionSubtitle}>
                {vendorStats.total} vendors • {vendorStats.booked} booked
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Recent Guests Preview */}
      {guests.length > 0 && (
        <View style={styles.previewCard}>
          <Text style={styles.cardTitle}>Recent Guests</Text>
          {guests.slice(0, 3).map((guest) => (
            <View key={guest._id} style={styles.listItem}>
              <Text style={styles.listItemName}>{guest.name}</Text>
              <View style={[styles.rsvpBadge, getRSVPStyle(guest.rsvpStatus)]}>
                <Text style={styles.rsvpText}>{guest.rsvpStatus}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('GuestList', { eventId: event._id })}
          >
            <Text style={styles.viewAllText}>View All Guests →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Recent Vendors Preview */}
      {vendors.length > 0 && (
        <View style={styles.previewCard}>
          <Text style={styles.cardTitle}>Recent Vendors</Text>
          {vendors.slice(0, 3).map((vendor) => (
            <View key={vendor._id} style={styles.listItem}>
              <View>
                <Text style={styles.listItemName}>{vendor.name}</Text>
                <Text style={styles.listItemSubtext}>{vendor.category}</Text>
              </View>
              <View style={[styles.vendorBadge, getVendorStyle(vendor.status)]}>
                <Text style={styles.vendorText}>{vendor.status}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('VendorList', { eventId: event._id })}
          >
            <Text style={styles.viewAllText}>View All Vendors →</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const getStatusStyle = (status) => {
  const styles = {
    planning: { backgroundColor: '#fef3c7' },
    confirmed: { backgroundColor: '#d1fae5' },
    completed: { backgroundColor: '#e0e7ff' },
    cancelled: { backgroundColor: '#fee2e2' },
  };
  return styles[status] || { backgroundColor: '#f3f4f6' };
};

const getRSVPStyle = (status) => {
  const styles = {
    confirmed: { backgroundColor: '#d1fae5' },
    pending: { backgroundColor: '#fef3c7' },
    declined: { backgroundColor: '#fee2e2' },
  };
  return styles[status] || { backgroundColor: '#f3f4f6' };
};

const getVendorStyle = (status) => {
  const styles = {
    booked: { backgroundColor: '#d1fae5' },
    confirmed: { backgroundColor: '#a7f3d0' },
    quoted: { backgroundColor: '#fef3c7' },
    contacted: { backgroundColor: '#e0e7ff' },
  };
  return styles[status] || { backgroundColor: '#f3f4f6' };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 15,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textTransform: 'capitalize',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: '#4b5563',
  },
  statsCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  actionsCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 28,
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
  actionArrow: {
    fontSize: 24,
    color: '#9ca3af',
  },
  previewCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  listItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  listItemSubtext: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  rsvpBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  rsvpText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    textTransform: 'capitalize',
  },
  vendorBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  vendorText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    textTransform: 'capitalize',
  },
  viewAllButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
});
