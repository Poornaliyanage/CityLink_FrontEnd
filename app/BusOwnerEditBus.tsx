import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL = "http://172.20.10.5:5000/api/buses";

type Bus = {
  bus_id: number;
  registration_number: string;
  route_name?: string;
  permit_link?: string;
  conductor_name?: string;
  seat_count?: number | string;
  service?: string;
  start_point?: string;
  end_point?: string;
  conductor_phone?: string;
  is_active?: boolean;
};

export default function BusOwnerEditBus() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [editBus, setEditBus] = useState<Bus | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [saving, setSaving] = useState(false);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/withDetails`);
      const data = await response.json();
      if (data.success) {
        setBuses(data.buses);
      } else {
        Alert.alert("Error", data.message || "Failed to load buses");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Could not fetch buses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // =========================
  // UPDATE BUS
  // =========================
  const updateBus = async () => {
    if (!editBus) return;

    if (
      !editBus.registration_number ||
      !editBus.seat_count ||
      !editBus.start_point ||
      !editBus.end_point ||
      !editBus.conductor_phone ||
      !editBus.permit_link
    ) {
      Alert.alert("Error", "Please fill all fields before updating the bus");
      return;
    }

    setSaving(true);
    try {
      const body = {
        registration_number: editBus.registration_number.trim(),
        permit_link: editBus.permit_link.trim(),
        seat_count: parseInt(editBus.seat_count.toString()) || 0,
        start_point: editBus.start_point.trim(),
        end_point: editBus.end_point.trim(),
        service: editBus.service,
        conductor_phone: editBus.conductor_phone.trim(),
        is_active: editBus.is_active,
      };

      const response = await fetch(`${API_URL}/${editBus.bus_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert("✅ Success", "Bus updated successfully");
        setBuses((prev) =>
          prev.map((bus) => (bus.bus_id === editBus.bus_id ? { ...bus, ...editBus } : bus))
        );
        setModalVisible(false);
      } else {
        Alert.alert("Error", data.message || "Failed to update bus");
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Could not connect to server");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE BUS
  // =========================
  const deleteBus = async (bus_id: number) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this bus?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`${API_URL}/${bus_id}`, { method: "DELETE" });
            const data = await response.json();
            if (data.success) {
              setBuses((prev) => prev.filter((b) => b.bus_id !== bus_id));
            } else {
              Alert.alert("Error", data.message || "Failed to delete bus");
            }
          } catch (error) {
            console.error("Delete error:", error);
            Alert.alert("Error", "Could not delete bus");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0A84FF" />
        <Text>Loading buses...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#f5f7fa", "#c3cfe2"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight || 0 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.title}>Manage Your Buses</Text>

          {buses.length === 0 ? (
            <Text style={styles.noBusText}>No buses found.</Text>
          ) : (
            buses.map((bus) => (
              <Animated.View key={bus.bus_id} style={[styles.card, { opacity: fadeAnim }]}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name="bus" size={32} color="#0A84FF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.regNo}>{bus.registration_number}</Text>
                  <Text>Route: {bus.route_name || "N/A"}</Text>
                  <Text>Conductor: {bus.conductor_name || "Not Assigned"}</Text>
                  <Text>Permit: {bus.permit_link || "None"}</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 6 }}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#fbbf24" }]}
                    onPress={() => {
                      setEditBus(bus);
                      setModalVisible(true);
                    }}
                  >
                    <Ionicons name="pencil-outline" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#ef4444" }]}
                    onPress={() => deleteBus(bus.bus_id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))
          )}

          {/* ✅ EDIT BUS MODAL */}
          <Modal visible={modalVisible} animationType="slide">
            <LinearGradient colors={["#f8fafc", "#e2e8f0"]} style={{ flex: 1 }}>
              <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                  <Text style={styles.modalTitle}>Edit Bus Details</Text>

                  {/* Registration Number */}
                  <Text style={styles.label}>Registration Number</Text>
                  <TextInput
                    style={styles.input}
                    value={editBus?.registration_number}
                    onChangeText={(text) =>
                      setEditBus((prev) => (prev ? { ...prev, registration_number: text } : prev))
                    }
                  />

                  {/* Permit Link */}
                  <Text style={styles.label}>Permit Link</Text>
                  <TextInput
                    style={styles.input}
                    value={editBus?.permit_link}
                    /*placeholder="Enter permit link"*/
                    onChangeText={(text) =>
                      setEditBus((prev) => (prev ? { ...prev, permit_link: text } : prev))
                    }
                  />

                  {/* Seat Count */}
                  <Text style={styles.label}>Seat Count</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={editBus?.seat_count?.toString()}
                    onChangeText={(text) =>
                      setEditBus((prev) => (prev ? { ...prev, seat_count: text } : prev))
                    }
                  />

                  {/* Service Type */}
                  <Text style={styles.label}>Service Type</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={editBus?.service}
                      onValueChange={(val) =>
                        setEditBus((prev) => (prev ? { ...prev, service: val } : prev))
                      }
                    >
                      <Picker.Item label="Normal" value="N" />
                      <Picker.Item label="Express" value="XL" />
                      <Picker.Item label="Semi-Luxury" value="S" />
                      <Picker.Item label="Luxury" value="L" />
                    </Picker>
                  </View>

                  {/* Start & End Points */}
                  <Text style={styles.label}>Start Point</Text>
                  <TextInput
                    style={styles.input}
                    value={editBus?.start_point}
                    onChangeText={(text) =>
                      setEditBus((prev) => (prev ? { ...prev, start_point: text } : prev))
                    }
                  />

                  <Text style={styles.label}>End Point</Text>
                  <TextInput
                    style={styles.input}
                    value={editBus?.end_point}
                    onChangeText={(text) =>
                      setEditBus((prev) => (prev ? { ...prev, end_point: text } : prev))
                    }
                  />

                  {/* Conductor Phone */}
                  <Text style={styles.label}>Conductor Phone</Text>
                  <TextInput
                    style={styles.input}
                    value={editBus?.conductor_phone}
                    onChangeText={(text) =>
                      setEditBus((prev) => (prev ? { ...prev, conductor_phone: text } : prev))
                    }
                  />

                  {/* Active Switch */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 15,
                    }}
                  >
                    <Text style={styles.label}>Is Active</Text>
                    <Switch
                      value={editBus?.is_active ?? true}
                      onValueChange={(value) =>
                        setEditBus((prev) => (prev ? { ...prev, is_active: value } : prev))
                      }
                      trackColor={{ false: "#d1d5db", true: "#2563eb" }}
                      thumbColor={editBus?.is_active ? "#ffffff" : "#f4f3f4"}
                    />
                  </View>

                  {/* Save / Cancel */}
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.saveBtn}
                      onPress={updateBus}
                      disabled={saving}
                    >
                      {saving ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={{ color: "#fff", fontWeight: "700" }}>Save</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={{ color: "#fff", fontWeight: "700" }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </SafeAreaView>
            </LinearGradient>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// =====================
// STYLES
// =====================
const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: 20 },
  noBusText: { textAlign: "center", color: "#555", fontSize: 16 },
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 15,
  },
  iconContainer: {
    backgroundColor: "#e6f0ff",
    padding: 10,
    borderRadius: 50,
    marginRight: 15,
  },
  regNo: { fontSize: 16, fontWeight: "700", color: "#0A84FF" },
  actionBtn: {
    borderRadius: 10,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { color: "black", marginBottom: 5 },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    color: "black",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  modalActions: { flexDirection: "row", justifyContent: "space-between" },
  saveBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    padding: 14,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    padding: 14,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
});
