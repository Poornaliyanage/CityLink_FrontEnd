import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function BusTimetable() {
  const router = useRouter();

  const headerScale = useRef(new Animated.Value(0.8)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(100)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.spring(cardSlide, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  // Hardcoded timetable data
  const timetable = [
    {
      id: 1,
      route: "Colombo → Kandy",
      departure: "06:00 AM",
      arrival: "09:00 AM",
      busNo: "NB-1245",
      type: "Luxury (A/C)",
    },
    {
      id: 2,
      route: "Kandy → Colombo",
      departure: "10:00 AM",
      arrival: "01:00 PM",
      busNo: "NB-1246",
      type: "Luxury (A/C)",
    },
    {
      id: 3,
      route: "Colombo → Galle",
      departure: "02:00 PM",
      arrival: "05:30 PM",
      busNo: "NB-4321",
      type: "Semi Luxury",
    },
    {
      id: 4,
      route: "Galle → Colombo",
      departure: "06:30 PM",
      arrival: "10:00 PM",
      busNo: "NB-4322",
      type: "Semi Luxury",
    },
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={["#a8edea", "#fed6e3"]} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight || 0 }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              padding: 20,
              paddingTop: 20,
            }}
            showsVerticalScrollIndicator={false}
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
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity
                  onPress={handleGoBack}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.3)",
                    borderRadius: 16,
                    padding: 12,
                    marginRight: 16,
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "800",
                      color: "#1f2937",
                      letterSpacing: -0.5,
                    }}
                  >
                    Bus Timetable
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#6b7280",
                      marginTop: 4,
                    }}
                  >
                    Today's schedule for the conductor
                  </Text>
                </View>
              </View>
            </Animated.View>

            {/* Timetable Cards */}
            <Animated.View
              style={{
                transform: [{ translateY: cardSlide }],
                opacity: cardOpacity,
              }}
            >
              {timetable.map((bus) => (
                <View
                  key={bus.id}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: 28,
                    padding: 20,
                    marginBottom: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                    elevation: 5,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Ionicons
                      name="bus-outline"
                      size={26}
                      color="#667eea"
                      style={{ marginRight: 10 }}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: "#1f2937",
                      }}
                    >
                      {bus.route}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <View>
                      <Text style={{ color: "#6b7280", fontSize: 13 }}>Departure</Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#1f2937",
                        }}
                      >
                        {bus.departure}
                      </Text>
                    </View>
                    <Ionicons name="arrow-forward" size={20} color="#9ca3af" />
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={{ color: "#6b7280", fontSize: 13 }}>Arrival</Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#1f2937",
                        }}
                      >
                        {bus.arrival}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#667eea",
                      }}
                    >
                      Bus No: {bus.busNo}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#374151",
                      }}
                    >
                      {bus.type}
                    </Text>
                  </View>
                </View>
              ))}
            </Animated.View>

            <View style={{ height: 60 }} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
