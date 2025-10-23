// app/(admin)/AdminManageTimetable.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AdminManageTimetable() {
  
  // form state for a single leg/segment
  const [routeNo, setRouteNo] = useState("");
  const [permitNo, setPermitNo] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [endTime, setEndTime] = useState("");

  // “Other Stops” state
  const [stopName, setStopName] = useState("");
  const [stopTime, setStopTime] = useState("");
  const [stops, setStops] = useState<string[]>([]);

  const handleAddSegment = () => {
    if (!routeNo || !permitNo ||!startLocation || !startTime || !endLocation || !endTime) {
      return Alert.alert("Missing info", "Please fill all fields.");
    }
    Alert.alert("Added", "Timetable segment added (demo).");
    // reset (demo)
    setStartLocation("");
    setStartTime("");
    setEndLocation("");
    setEndTime("");
  };

  const handleEditSegment = () => {
    if (!routeNo || !startLocation || !startTime || !endLocation || !endTime) {
      return Alert.alert("Missing info", "Please fill all fields.");
    }
    Alert.alert("Editted", "Timetable segment added (demo).");
    setStartLocation("");
    setStartTime("");
    setEndLocation("");
    setEndTime("");
  };

  const handleAddStop = () => {
    if (!stopName || !stopTime ) {
      return Alert.alert("Missing info", "Please fill all fields.");
    }
    Alert.alert("Added", "stop and time added added (demo).");
    // reset (demo)
    setStopName("");
    setStopTime("");
  };

  const handlePickCsv = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["text/csv", "application/vnd.ms-excel", "application/csv", "text/plain"],
      copyToCacheDirectory: true,
    });
    if (!res.canceled) {
      const file = res.assets[0];
      Alert.alert("CSV selected", `${file.name}`);
      // TODO: parse & upload to backend
    }
  };

  // Reusable input (light translucent, rounded)
  const Input = ({
    placeholder,
    value,
    onChangeText,
    keyboardType = "default",
  }: {
    placeholder: string;
    value: string;
    onChangeText: (t: string) => void;
    keyboardType?: "default" | "number-pad";
  }) => (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      placeholderTextColor="rgba(31,41,55,0.5)"
      style={{
        flex: 1,
        height: 40,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.75)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
      }}
    />
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={["#a8edea", "#fed6e3"]} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight || 0 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{ padding: 20, paddingTop: 24, paddingBottom: 40 }}
              bounces
              showsVerticalScrollIndicator={false}
            >
              {/* Mini header like your dashboard */}
              <View style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "white",
                      alignItems: "center",
                      justifyContent: "center",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.08,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <MaterialCommunityIcons name="bus" size={20} color="#667eea" />    
                  </View>
                  <Text style={{ fontSize: 18, fontWeight: "700", color: "#1f2937" }}>
                    Manage Time Table
                  </Text>
                </View>
              </View>

              {/* Card: Add timetable leg */}
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: 20,
                  padding: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 4,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.05)",
                }}
              >
                <LinearGradient
                  colors={["#a8edea", "#e9d6ef"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 16,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Row: route no */}
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <Text style={{ width: 120, color: "#1f2937", fontWeight: "600" }}>
                      Route number
                    </Text>
                    <Input
                      placeholder="e.g. 101"
                      value={routeNo}
                      onChangeText={setRouteNo}
                      keyboardType="number-pad"
                    />
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <Text style={{ width: 120, color: "#1f2937", fontWeight: "600" }}>
                      Permit Number
                    </Text>
                    <Input
                      placeholder="NaCV78966"
                      value={permitNo}
                      onChangeText={setPermitNo}
                      keyboardType="number-pad"
                    />
                  </View>

                  {/* Row: start location */}
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <Text style={{ width: 120, color: "#1f2937", fontWeight: "600" }}>
                      Start Location
                    </Text>
                    <Input placeholder="Start stop" value={startLocation} onChangeText={setStartLocation} />
                  </View>

                  {/* Row: start time */}
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <Text style={{ width: 120, color: "#1f2937", fontWeight: "600" }}>
                      Start Time
                    </Text>
                    <Input placeholder="HH:MM" value={startTime} onChangeText={setStartTime} />
                  </View>

                  {/* Row: end location */}
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <Text style={{ width: 120, color: "#1f2937", fontWeight: "600" }}>
                      End Location
                    </Text>
                    <Input placeholder="End stop" value={endLocation} onChangeText={setEndLocation} />
                  </View>

                  {/* Row: end time */}
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <Text style={{ width: 120, color: "#1f2937", fontWeight: "600" }}>
                      End Time
                    </Text>
                    <Input placeholder="HH:MM" value={endTime} onChangeText={setEndTime} />
                  </View>

                  {/* Add button */}
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                    <TouchableOpacity
                        onPress={handleAddSegment}
                        activeOpacity={0.9}
                        style={{ backgroundColor: "#667eea", paddingVertical: 10, paddingHorizontal: 24, borderRadius: 12 }}
                    >
                        <Text style={{ color: "white", fontWeight: "700" }}>Add</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleEditSegment}
                        activeOpacity={0.9}
                        style={{ backgroundColor: "#667eea", paddingVertical: 10, paddingHorizontal: 24, borderRadius: 12 }}
                    >
                        <Text style={{ color: "white", fontWeight: "700" }}>Edit</Text>
                    </TouchableOpacity>
                </View>

                </LinearGradient>
              </View>

              {/* Spacer */}
              <View style={{ height: 16 }} />

              {/* Card: Other Stops */}
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: 20,
                  padding: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 4,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.05)",
                }}
              >
                <Text style={{ color: "#1f2937", fontWeight: "700", marginBottom: 12 }}>
                  Other Stops
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View style={{ flex: 1, height: 40, justifyContent: "center" }}>
                    <Input placeholder="Stop name" value={stopName} onChangeText={setStopName} />
                  </View>

                  <View style={{ flex: 1, height: 40, justifyContent: "center" }}>
                    <Input placeholder="Time" value={stopTime} onChangeText={setStopTime} />
                  </View>

                  <TouchableOpacity
                    onPress={handleAddStop}
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(102,126,234,0.15)",
                      borderWidth: 1,
                      borderColor: "rgba(102,126,234,0.35)",
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="add" size={20} color="#667eea" />
                  </TouchableOpacity>
                </View>

                {/* Simple pill list */}
                {stops.length > 0 && (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                    {stops.map((s, i) => (
                      <View
                        key={`${s}-${i}`}
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          backgroundColor: "rgba(102,126,234,0.12)",
                          borderRadius: 999,
                          borderWidth: 1,
                          borderColor: "rgba(102,126,234,0.25)",
                        }}
                      >
                        <Text style={{ color: "#374151", fontWeight: "600" }}>{s}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Spacer */}
              <View style={{ height: 16 }} />

              {/* Card: CSV uploader */}
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: 20,
                  padding: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 4,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.05)",
                }}
              >
                {/* Route number for CSV import scope */}
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <Text style={{ width: 120, color: "#1f2937", fontWeight: "600" }}>
                    Route number
                  </Text>
                  <Input
                    placeholder="e.g. 101"
                    value={routeNo}
                    onChangeText={setRouteNo}
                    keyboardType="number-pad"
                  />
                </View>

                {/* CSV drop zone (mobile-friendly tap to select) */}
                <TouchableOpacity
                  onPress={handlePickCsv}
                  activeOpacity={0.9}
                  style={{
                    height: 120,
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderStyle: "dashed",
                    borderColor: "rgba(55,65,81,0.25)",
                    backgroundColor: "rgba(249,250,251,0.9)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="cloud-upload-outline" size={26} color="#6b7280" />
                  <Text style={{ marginTop: 8, color: "#6b7280", fontWeight: "600" }}>
                    Drag and Drop CSV
                  </Text>
                  <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                    or tap to choose a file
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
