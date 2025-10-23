// app/(admin)/AdminManageBuses.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AdminManageBuses() {
  const router = useRouter();

  // Replace with data from your backend
  const buses = useMemo(
    () => ["NB - 6785", "NB - 6798", "ND - 6005", "NA - 1185", "NC - 6737", "NB - 5645"],
    []
  );

  const openBus = (plate: string) => {
    // Navigate to details / navigation screen
    router.push({ pathname: "/(admin)/AdminManageBusNavigate", params: { plate } } as any);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={["#a8edea", "#fed6e3"]} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight || 0 }}>
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingTop: 24, paddingBottom: 40 }}
            bounces
            showsVerticalScrollIndicator={false}
          >
            {/* Header row (bus icon is a button back to dashboard) */}
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

            {/* Outer rounded container (the light grey/white section) */}
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
              {buses.map((plate) => (
                <TouchableOpacity
                  key={plate}
                  onPress={() => openBus(plate)}
                  activeOpacity={0.9}
                  style={{
                    borderRadius: 16,
                    marginBottom: 14,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    elevation: 3,
                    overflow: "hidden",
                  }}
                >
                  {/* Solid lavender tile to match the screenshot */}
                  <View
                    style={{
                      backgroundColor: "#7c7af0",
                      paddingVertical: 16,
                      paddingHorizontal: 16,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={{ flex: 1, color: "white", fontWeight: "800" }}>{plate}</Text>
                      <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.9)" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
