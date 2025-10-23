// app/(admin)/AdminManageUsers.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Person = {
  id: string;
  name: string;
  role: "User" | "Bus Owner" | "Conductor";
  active: boolean;
};

export default function AdminManageUsers() {
  const router = useRouter();

  // sample data
  const initial = useMemo<Person[]>(
    () => [
      { id: "u1", name: "Thivanka Wimalasena", role: "User", active: true },
      { id: "o1", name: "Sasanka Perepa", role: "Bus Owner", active: true },
      { id: "c1", name: "Chamara Sampath", role: "Conductor", active: true },
    ],
    []
  );

  const [people, setPeople] = useState<Person[]>(initial);
  const [qUser, setQUser] = useState("");
  const [qOwner, setQOwner] = useState("");
  const [qCond, setQCond] = useState("");

  const toggle = (id: string) =>
    setPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );

  const Section = ({
    title,
    query,
    setQuery,
    items,
  }: {
    title: string;
    query: string;
    setQuery: (v: string) => void;
    items: Person[];
  }) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ color: "#1f2937", fontWeight: "700", marginBottom: 10 }}>{title}</Text>

      {/* Search pill */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "rgba(248, 244, 255, 1)",
          borderRadius: 999,
          paddingHorizontal: 12,
          height: 44,
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.06)",
          marginBottom: 10,
        }}
      >
        <MaterialCommunityIcons name="menu" size={18} color="#6b7280" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search Name"
          placeholderTextColor="#9ca3af"
          style={{ flex: 1, marginHorizontal: 8 }}
        />
        <Ionicons name="search" size={18} color="#6b7280" />
      </View>

      {/* Row with name + status pill */}
      {items.map((p) => (
        <View
          key={p.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 8,
          }}
        >
          <Text style={{ color: "#111827", fontWeight: "600" }}>{p.name}</Text>

          <TouchableOpacity
            onPress={() => toggle(p.id)}
            activeOpacity={0.85}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              backgroundColor: p.active ? "#34D399" /* green-400 */ : "#EF4444" /* red-500 */,
            }}
          >
            <Text style={{ color: "white", fontWeight: "800" }}>
              {p.active ? "Active" : "Inactive"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const filtered = {
    user: people.filter((p) => p.role === "User" && p.name.toLowerCase().includes(qUser.toLowerCase())),
    owner: people.filter(
      (p) => p.role === "Bus Owner" && p.name.toLowerCase().includes(qOwner.toLowerCase())
    ),
    cond: people.filter(
      (p) => p.role === "Conductor" && p.name.toLowerCase().includes(qCond.toLowerCase())
    ),
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={["#a8edea", "#fed6e3"]} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight || 0 }}>
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingTop: 24, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            bounces
          >
            {/* Header (bus icon is a button to dashboard) */}
            <View style={{ marginBottom: 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
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

              <Text style={{ fontSize: 18, fontWeight: "700", color: "#1f2937" }}>Manage Users</Text>
            </View>

            {/* Outer rounded container */}
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
              <Section title="User" query={qUser} setQuery={setQUser} items={filtered.user} />
              <Section title="Bus Owner" query={qOwner} setQuery={setQOwner} items={filtered.owner} />
              <Section title="Conductor" query={qCond} setQuery={setQCond} items={filtered.cond} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
