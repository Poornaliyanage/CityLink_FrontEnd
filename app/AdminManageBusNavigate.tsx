// app/(admin)/AdminManageBusNavigate.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function AdminManageBusNavigate() {
  const router = useRouter();
  const { plate } = useLocalSearchParams<{ plate?: string }>();

  const [owner, setOwner] = useState("");
  const [busNo, setBusNo] = useState(plate ?? "");
  const [routeNo, setRouteNo] = useState("");
  const [permitNo, setPermitNo] = useState("");
  const [notes, setNotes] = useState("");
  const [attachmentName, setAttachmentName] = useState<string | null>(null);

  const pickAttachment = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      copyToCacheDirectory: true,
    });
    if (!res.canceled) {
      setAttachmentName(res.assets[0].name ?? "Selected file");
    }
  };

  const confirm = () => {
    // TODO: send to backend
    Alert.alert("Confirmed", "Bus details have been approved (demo).");
    router.replace("/AdminDashboard");
  };

  const reject = () => {
    // TODO: send reason / status to backend
    Alert.alert("Rejected", "Bus request has been rejected (demo).");
    router.replace("/AdminDashboard");
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <Text style={{ width: 120, color: "#1f2937", fontWeight: "700" }}>{children}</Text>
  );

  const Input = ({
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
  }: {
    value: string;
    onChangeText: (t: string) => void;
    placeholder: string;
    keyboardType?: "default" | "number-pad";
  }) => (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="rgba(31,41,55,0.5)"
      keyboardType={keyboardType}
      style={{
        flex: 1,
        height: 40,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.85)",
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
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={{ padding: 20, paddingTop: 24, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              bounces
            >
              {/* Mini header (bus icon is a button back to dashboard) */}
              <View style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => router.replace("/AdminDashboard")}
                    activeOpacity={0.85}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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
                      borderWidth: 1,
                      borderColor: "rgba(0,0,0,0.05)",
                    }}
                  >
                    <MaterialCommunityIcons name="bus" size={20} color="#667eea" />
                  </TouchableOpacity>

                  <Text style={{ fontSize: 18, fontWeight: "700", color: "#1f2937" }}>
                    Manage Buses
                  </Text>
                </View>
              </View>

              {/* Main card */}
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.05)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                 {/* Owner name */}
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <Text style={{ width: 120, color: "#1f2937", fontWeight: "700" }}>Owner name</Text>
                    <Text style={{ flex: 1, color: "#1f2937", fontWeight: "600" }}>S. Perera</Text>
                </View>

                {/* Bus number */}
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <Text style={{ width: 120, color: "#1f2937", fontWeight: "700" }}>Bus Number</Text>
                    <Text style={{ flex: 1, color: "#1f2937", fontWeight: "600" }}>NB - 6785</Text>
                </View>

                {/* Route number */}
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <Text style={{ width: 120, color: "#1f2937", fontWeight: "700" }}>Route number</Text>
                    <Text style={{ flex: 1, color: "#1f2937", fontWeight: "600" }}>101</Text>
                </View>

                {/* Permit number */}
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <Text style={{ width: 120, color: "#1f2937", fontWeight: "700" }}>Permit Number</Text>
                    <Text style={{ flex: 1, color: "#1f2937", fontWeight: "600" }}>NaCV78966</Text>
                </View>

                {/* Notes / large box (like screenshot). You can replace with image upload UI if needed */}
                <View
                    style={{
                        height: 120,
                        borderRadius: 14,
                        borderWidth: 1.5,
                        borderColor: "rgba(55,65,81,0.25)",
                        backgroundColor: "rgba(249,250,251,0.9)",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    >
                    <Ionicons name="document-text-outline" size={26} color="#6b7280" />
                    <Text style={{ marginTop: 6, color: "#6b7280", fontWeight: "600" }}>
                        permit_sample.pdf (245 KB)
                    </Text>
                    <Text style={{ color: "#9ca3af", fontSize: 12 }}>Preview unavailable</Text>
                    </View>
              </View>

              {/* Actions */}
              <View style={{ height: 16 }} />

              <TouchableOpacity
                onPress={confirm}
                activeOpacity={0.9}
                style={{
                  backgroundColor: "#7c7af0",
                  borderRadius: 14,
                  paddingVertical: 12,
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Text style={{ color: "white", fontWeight: "800" }}>Confirm</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={reject}
                activeOpacity={0.9}
                style={{
                  backgroundColor: "#ef4444",
                  borderRadius: 14,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "800" }}>Reject</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
