import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function OwnerAddBus() {
  const [ownerId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [newBus, setNewBus] = useState({
    registration_number: "",
    seat_count: "",
    service: "N",
    start_point: "",
    end_point: "",
    permit_link: "",
    conductor_phone: "",
    is_active: true,
  });

  // Animations
  const cardSlide = useRef(new Animated.Value(100)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardSlide, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const addBus = async () => {
    if (
      !newBus.registration_number ||
      !newBus.seat_count ||
      !newBus.start_point ||
      !newBus.end_point ||
      !newBus.conductor_phone ||
      !newBus.permit_link
    ) {
      Alert.alert("Error", "Please fill all fields before adding the bus");
      return;
    }

    setLoading(true);
    try {
      const body = {
        registration_number: newBus.registration_number.trim(),
        permit_link: newBus.permit_link.trim(),
        seat_count: parseInt(newBus.seat_count.toString()) || 0,
        owner_id: ownerId,
        start_point: newBus.start_point.trim(),
        end_point: newBus.end_point.trim(),
        service: newBus.service,
        conductor_phone: newBus.conductor_phone.trim(),
        is_active: newBus.is_active,
      };

      const response = await fetch(
        "http://10.76.23.131:5000/api/buses/addWithRoute",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();
      if (data.success) {
        Alert.alert("✅ Success", "Bus added successfully!");
        setNewBus({
          registration_number: "",
          seat_count: "",
          service: "N",
          start_point: "",
          end_point: "",
          permit_link: "",
          conductor_phone: "",
          is_active: true,
        });
      } else {
        Alert.alert("Error", data.message || "Failed to add bus");
      }
    } catch (error) {
      console.error("Add bus error:", error);
      Alert.alert("Error", "Server error while adding bus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={["#a8edea", "#fed6e3"]} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight || 0 }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 40,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Logo */}
            <View style={{ alignItems: "center", marginBottom: 25 }}>
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 6,
                }}
              >
                <MaterialCommunityIcons name="bus" size={40} color="#667eea" />
              </View>
            </View>

            {/* Form Card */}
            <Animated.View
              style={{
                backgroundColor: "rgba(255,255,255,0.95)",
                borderRadius: 28,
                padding: 24,
                width: width - 32,
                maxWidth: 420,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
                elevation: 10,
                transform: [{ translateY: cardSlide }],
                opacity: cardOpacity,
              }}
            >
              <Text style={styles.title}>Add New Bus</Text>

              {/* Registration Number */}
              <Text style={styles.label}>Bus Registration No</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter registration number"
                placeholderTextColor="#9ca3af"
                value={newBus.registration_number}
                onChangeText={(t) =>
                  setNewBus({ ...newBus, registration_number: t })
                }
              />

              {/* Permit Link */}
              <Text style={styles.label}>Permit (PDF)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter permit file name"
                placeholderTextColor="#9ca3af"
                value={newBus.permit_link}
                onChangeText={(t) => setNewBus({ ...newBus, permit_link: t })}
              />

              {/* Seat Count */}
              <Text style={styles.label}>Seat Count</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter seat count"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={newBus.seat_count.toString()}
                onChangeText={(t) => setNewBus({ ...newBus, seat_count: t })}
              />

              {/* Service Type */}
              <Text style={styles.label}>Service Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={newBus.service}
                  onValueChange={(v) => setNewBus({ ...newBus, service: v })}
                >
                  <Picker.Item label="Normal" value="N" />
                  <Picker.Item label="Express" value="XL" />
                  <Picker.Item label="Semi-Luxury" value="S" />
                  <Picker.Item label="Luxury" value="L" />
                </Picker>
              </View>

              {/* Start and End Points */}
              <Text style={styles.label}>Start Point</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter starting location"
                placeholderTextColor="#9ca3af"
                value={newBus.start_point}
                onChangeText={(t) => setNewBus({ ...newBus, start_point: t })}
              />

              <Text style={styles.label}>End Point</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter destination"
                placeholderTextColor="#9ca3af"
                value={newBus.end_point}
                onChangeText={(t) => setNewBus({ ...newBus, end_point: t })}
              />

              {/* Conductor Phone */}
              <Text style={styles.label}>Conductor Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                value={newBus.conductor_phone}
                onChangeText={(t) =>
                  setNewBus({ ...newBus, conductor_phone: t })
                }
              />

              {/* Active Switch */}
              <View style={styles.switchRow}>
                <Text style={styles.label}>Is Active</Text>
                <Switch
                  value={newBus.is_active}
                  onValueChange={(v) => setNewBus({ ...newBus, is_active: v })}
                  trackColor={{ false: "#d1d5db", true: "#667eea" }}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                disabled={loading}
                onPress={addBus}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitButton}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitText}>Add Bus</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    color: "#111827",
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 15,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  submitButton: {
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  submitText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
