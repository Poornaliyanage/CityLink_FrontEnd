import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type RootStackParamList = {
  OwnerBusTracking: { busNumber: string; routeName: string } | undefined;
  BusOwnerProfileEditor: undefined;
};

interface Bus {
  bus_id: number;
  registration_number: string;
  start_point: string;
  end_point: string;
}

export default function BusOwnerViewBus() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchNumber, setSearchNumber] = useState("");
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  // Animations
  const headerScale = useRef(new Animated.Value(0.8)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(80)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animateHeader();
    fetchBuses();
  }, []);

  const animateHeader = () => {
    Animated.parallel([
      Animated.spring(headerScale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(headerOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.spring(cardSlide, { toValue: 0, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]).start();
    }, 300);
  };

  const fetchBuses = async () => {
    try {
      const response = await fetch("http://172.20.10.5:5000/api/buses");
      const data = await response.json();

      if (data.success) {
        setBuses(data.buses);
      } else {
        Alert.alert("Error", data.message || "Failed to load buses");
      }
    } catch (error) {
      console.error("Fetch buses error:", error);
      Alert.alert("Error", "Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Navigate with both bus number and route name
  const handleTrack = (bus: Bus) => {
    navigation.navigate("OwnerBusTracking", {
      busNumber: bus.registration_number,
      routeName: `${bus.start_point} → ${bus.end_point}`,
    });
  };

  const filteredBuses = buses.filter((bus) =>
    bus.registration_number.toLowerCase().includes(searchNumber.toLowerCase())
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={["#a8edea", "#fed6e3"]} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight || 0 }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 20, paddingTop: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <Animated.View style={{ transform: [{ scale: headerScale }], opacity: headerOpacity, marginBottom: 30 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
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
                    <MaterialCommunityIcons name="bus" size={26} color="#667eea" />
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, color: "#6b7280", fontWeight: "500" }}>Manage Your Fleet</Text>
                    <Text style={{ fontSize: 20, fontWeight: "800", color: "#1f2937" }}>View and Track Buses</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate("BusOwnerProfileEditor")}
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.3)", borderRadius: 16, padding: 12 }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="person-outline" size={20} color="#374151" />
                </TouchableOpacity>
              </View>

              {/* Search Box */}
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Ionicons name="search-outline" size={20} color="#6b7280" style={{ marginRight: 10 }} />
                <TextInput
                  placeholder="Enter Bus Number"
                  placeholderTextColor="#9ca3af"
                  style={{ flex: 1, fontSize: 16, color: "#1f2937" }}
                  value={searchNumber}
                  onChangeText={setSearchNumber}
                />
                <TouchableOpacity
                  onPress={() => Alert.alert("Track", "Please select a bus from the list below.")}
                  style={{ backgroundColor: "#667eea", borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16 }}
                  activeOpacity={0.8}
                >
                  <Text style={{ color: "white", fontWeight: "600", fontSize: 14 }}>Track</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Bus List */}
            <Animated.View style={{ transform: [{ translateY: cardSlide }], opacity: cardOpacity }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#1f2937", marginBottom: 20, letterSpacing: -0.3 }}>
                Your Buses
              </Text>

              {loading ? (
                <ActivityIndicator size="large" color="#667eea" style={{ marginTop: 40 }} />
              ) : filteredBuses.length === 0 ? (
                <Text style={{ color: "#6b7280", textAlign: "center", marginTop: 30 }}>No buses found</Text>
              ) : (
                filteredBuses.map((bus) => (
                  <Animated.View key={bus.bus_id} style={{ marginBottom: 16 }}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => handleTrack(bus)}
                      style={{
                        borderRadius: 20,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        elevation: 6,
                      }}
                    >
                      <LinearGradient
                        colors={["#a8edea", "#fed6e3"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ borderRadius: 20, padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                      >
                        <View>
                          <Text style={{ fontSize: 18, fontWeight: "700", color: "#1f2937" }}>{bus.registration_number}</Text>
                          <Text style={{ fontSize: 14, color: "#374151", marginTop: 4 }}>
                            {bus.start_point} → {bus.end_point}
                          </Text>
                        </View>
                        <View style={{ backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 12, padding: 8 }}>
                          <Ionicons name="chevron-forward-outline" size={22} color="#374151" />
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                ))
              )}
            </Animated.View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
