import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import {
  getVendorsByEvent,
  updateVendorStatus,
  deleteVendor,
} from "../api/api";

export default function VendorListScreen({ route, navigation }) {
  const { eventId } = route.params;
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchVendors();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await getVendorsByEvent(eventId);
      if (response.success) {
        setVendors(response.data);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (vendorId, currentStatus) => {
    const statuses = [
      "researching",
      "contacted",
      "quoted",
      "booked",
      "confirmed",
      "cancelled",
    ];
    const currentIndex = statuses.indexOf(currentStatus);
    const newStatus = statuses[(currentIndex + 1) % statuses.length];

    try {
      await updateVendorStatus(vendorId, newStatus);
      fetchVendors();
    } catch (error) {
      Alert.alert("Error", "Failed to update vendor status");
    }
  };

  const handleDeleteVendor = (vendorId, vendorName) => {
    Alert.alert("Delete Vendor", `Remove ${vendorName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteVendor(vendorId);
            fetchVendors();
          } catch (error) {
            Alert.alert("Error", "Failed to delete vendor");
          }
        },
      },
    ]);
  };

  const renderVendor = ({ item }) => (
    <TouchableOpacity
      style={styles.vendorCard}
      onPress={() => handleStatusChange(item._id, item.status)}
      onLongPress={() => handleDeleteVendor(item._id, item.name)}
    >
      <View style={styles.cardContent}>
        <View style={styles.vendorInfo}>
          <Text style={styles.vendorName}>{item.name}</Text>
          <Text style={styles.vendorCategory}>{item.category}</Text>
          {item.phone && (
            <Text style={styles.vendorDetail}>📱 {item.phone}</Text>
          )}
          {item.email && (
            <Text style={styles.vendorDetail}>📧 {item.email}</Text>
          )}
          {item.quotedPrice > 0 && (
            <Text style={styles.vendorDetail}>
              💰 ${item.quotedPrice.toLocaleString()}
            </Text>
          )}
        </View>
        <View style={[styles.statusBadge, getVendorStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.tapText}>
          Tap to change status • Long press to delete
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={vendors}
        renderItem={renderVendor}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchVendors} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No vendors yet</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("AddVendor", { eventId })}
            >
              <Text style={styles.addButtonText}>+ Add Vendor</Text>
            </TouchableOpacity>
          </View>
        }
      />
      {vendors.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("AddVendor", { eventId })}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const getVendorStyle = (status) => {
  const styles = {
    booked: { backgroundColor: "#d1fae5" },
    confirmed: { backgroundColor: "#a7f3d0" },
    quoted: { backgroundColor: "#fef3c7" },
    contacted: { backgroundColor: "#e0e7ff" },
    researching: { backgroundColor: "#f3f4f6" },
  };
  return styles[status] || { backgroundColor: "#f3f4f6" };
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  listContainer: { padding: 15 },
  vendorCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  vendorInfo: { flex: 1 },
  vendorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 5,
  },
  vendorCategory: {
    fontSize: 13,
    color: "#6366f1",
    fontWeight: "600",
    marginBottom: 5,
    textTransform: "capitalize",
  },
  vendorDetail: { fontSize: 13, color: "#6b7280", marginBottom: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: "600", textTransform: "capitalize" },
  emptyContainer: { alignItems: "center", padding: 40, marginTop: 100 },
  emptyText: { fontSize: 18, color: "#6b7280", marginBottom: 20 },
  addButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  cardFooter: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  tapText: { fontSize: 11, color: "#9ca3af", textAlign: "center" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabIcon: { fontSize: 32, color: "#fff", fontWeight: "bold" },
});
