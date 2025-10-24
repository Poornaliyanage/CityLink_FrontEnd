// app/(admin)/index.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type DashboardAction = {
  id: string;
  title: string;
  subtitle: string;
  icon: string; // Ionicons name
  route: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [userName] = useState("Admin");
  const [greeting, setGreeting] = useState("");

  // Header / list entrance animations
  const headerScale = useRef(new Animated.Value(0.8)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(100)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    Animated.parallel([
      Animated.spring(headerScale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.spring(cardSlide, { toValue: 0, useNativeDriver: true }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);
  }, []);

  const actions: DashboardAction[] = [
    {
      id: "1",
      title: "Manage Timetable",
      subtitle: "Create and edit schedules",
      icon: "calendar-outline",
      route: "/(admin)/AdminManageTimetable",
    },
    {
      id: "2",
      title: "Manage Buses",
      subtitle: "Add, update, or remove buses",
      icon: "bus-outline",
      route: "/(admin)/AdminManageBuses",
    },
    {
      id: "4",
      title: "Manage Users",
      subtitle: "Passengers & staff accounts",
      icon: "people-outline",
      route: "/(admin)/AdminManageUsers",
    },
  ];

  const go = (a: DashboardAction) => router.push(a.route as any);
  const openProfile = () => router.push("/(admin)/AdminManageUsers" as any);
  const handleLogout = () => router.replace("/signin" as any);

  const ActionCard = ({ action, index }: { action: DashboardAction; index: number }) => {
    const slide = useRef(new Animated.Value(50)).current;
    const fade = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(slide, {
          toValue: 0,
          duration: 600,
          delay: 600 + index * 150,
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
          toValue: 1,
          duration: 600,
          delay: 600 + index * 150,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={{
          transform: [{ translateY: slide }, { scale }],
          opacity: fade,
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => go(action)}
          onPressIn={() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start()}
          onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
          style={{
            borderRadius: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <LinearGradient
            colors={["#a8edea", "#fed6e3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 24, padding: 24, minHeight: 120 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: 16,
                  padding: 12,
                  marginRight: 16,
                }}
              >
                <Ionicons name={action.icon as any} size={28} color="white" />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "white",
                    marginBottom: 4,
                    letterSpacing: 0.3,
                  }}
                >
                  {action.title}
                </Text>
                <Text style={{ fontSize: 14, color: "rgba(255,255,255,1)", lineHeight: 20 }}>
                  {action.subtitle}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: 12,
                  padding: 8,
                }}
              >
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={["#a8edea", "#fed6e3"]} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight || 0 }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 20, paddingTop: 40 }}
            showsVerticalScrollIndicator={false}
            bounces
          >
            {/* Header */}
            <Animated.View
              style={{
                transform: [{ scale: headerScale }],
                opacity: headerOpacity,
                marginBottom: 30,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                {/* Logo + greeting */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: "white",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <MaterialCommunityIcons name="bus" size={24} color="#667eea" />
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, color: "#6b7280", fontWeight: "500" }}>
                      {greeting},
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "800",
                        color: "#1f2937",
                        letterSpacing: -0.3,
                      }}
                    >
                      {userName}!
                    </Text>
                  </View>
                </View>

                {/* Top-right buttons */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={openProfile}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.3)",
                      borderRadius: 16,
                      padding: 12,
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="person-outline" size={20} color="#374151" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Welcome card */}
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: 20,
                  padding: 20,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "600", color: "#1f2937", marginBottom: 4 }}>
                      Ready to manage the system?
                    </Text>
                    <Text style={{ fontSize: 14, color: "#6b7280", lineHeight: 20 }}>
                      Choose a tool below to get started
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "rgba(102,126,234,0.1)",
                      borderRadius: 16,
                      padding: 12,
                    }}
                  >
                    <MaterialCommunityIcons name="clipboard-text-outline" size={28} color="#667eea" />
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Quick actions */}
            <Animated.View style={{ transform: [{ translateY: cardSlide }], opacity: cardOpacity }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#1f2937",
                  marginBottom: 20,
                  letterSpacing: -0.3,
                }}
              >
                Quick Actions
              </Text>

              {actions.map((a, i) => (
                <ActionCard key={a.id} action={a} index={i} />
              ))}
            </Animated.View>

            {/* Footer */}
            <Animated.View style={{ opacity: cardOpacity, marginTop: 20, alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.8)",
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 20,
                  width: "100%",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: "#10b981",
                      borderRadius: 4,
                      marginRight: 8,
                    }}
                  />
                  <Text style={{ fontSize: 14, color: "#374151", fontWeight: "500" }}>
                    All Services Active
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleLogout}
                style={{
                  backgroundColor: "rgba(239,68,68,0.1)",
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="log-out-outline" size={20} color="#ef4444" style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#ef4444" }}>Logout</Text>
              </TouchableOpacity>
            </Animated.View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
