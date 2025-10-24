import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  Alert,
  Animated,
  Easing,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";

const INITIAL_REGION = {
  latitude: 7.8731,
  longitude: 80.7718,
  latitudeDelta: 3.5,
  longitudeDelta: 3.5,
};

export default function OwnerBusTracking() {
  const router = useRouter();
  const { busNumber, routeName } = useLocalSearchParams<{
    busNumber: string;
    routeName: string;
  }>();

  const mapRef = useRef<MapView | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerScale = useRef(new Animated.Value(0.8)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerScale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(headerOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Please enable location access in settings.");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation);

      if (mapRef.current) {
        const region: Region = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        mapRef.current.animateToRegion(region, 1000);
      }
    })();
  }, []);

  const focusOnUser = async () => {
    if (!location) {
      Alert.alert("Location not available", "Please wait until your location is detected.");
      return;
    }

    const region: Region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    mapRef.current?.animateToRegion(region, 1000);
  };

  const handleCallConductor = () => {
    Linking.openURL("tel:+94771234567");
  };

  return (
    <LinearGradient colors={["#a8edea", "#fed6e3"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View
            style={{
              transform: [{ scale: headerScale }],
              opacity: headerOpacity,
              marginBottom: 30,
            }}
          >
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={22} color="#667eea" />
                </TouchableOpacity>
                <View>
                  <Text style={styles.subtitle}>Live Tracking</Text>
                  <Text style={styles.title}>{busNumber || "Bus NB-9878"}</Text>
                </View>
              </View>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="bus" size={26} color="#667eea" />
              </View>
            </View>
          </Animated.View>

          {/* Info Card */}
          <Animated.View style={[styles.infoCard, { opacity: fadeAnim }]}>
            <View style={styles.rowCenter}>
              <View style={styles.busIconContainer}>
                <MaterialCommunityIcons name="bus-side" size={28} color="#667eea" />
              </View>
              <View>
                <Text style={styles.busNumber}>{busNumber || "NB - 9878"}</Text>
                <Text style={styles.busPermit}>Permit - 678900765</Text>
              </View>
            </View>

            <Text style={styles.routeText}>{routeName || "Colombo 15 → Anuradhapura N"}</Text>

            <View style={styles.gpsStatus}>
              <View style={styles.dot} />
              <Text style={styles.connected}>Connected</Text>
              <Text style={styles.gpsText}>GPS Location Active</Text>
            </View>

            <View style={styles.mapContainer}>
              <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFill}
                initialRegion={INITIAL_REGION}
                showsUserLocation
                followsUserLocation
              />
              <TouchableOpacity style={styles.locateButton} onPress={focusOnUser}>
                <Ionicons name="locate" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Call Button */}
          <Animated.View style={{ alignItems: "center", opacity: fadeAnim }}>
            <TouchableOpacity style={styles.callButton} onPress={handleCallConductor}>
              <Ionicons name="call-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.callText}>Call to Conductor</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, padding: 20, paddingTop: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    elevation: 3,
  },
  subtitle: { fontSize: 16, color: "#6b7280", fontWeight: "500" },
  title: { fontSize: 20, fontWeight: "800", color: "#1f2937" },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: "white", alignItems: "center", justifyContent: "center", elevation: 3 },
  infoCard: { backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: 24, padding: 20, elevation: 8, marginBottom: 24 },
  rowCenter: { flexDirection: "row", alignItems: "center" },
  busIconContainer: { backgroundColor: "rgba(102, 126, 234, 0.1)", borderRadius: 16, padding: 12, marginRight: 12 },
  busNumber: { fontSize: 18, fontWeight: "700", color: "#1f2937" },
  busPermit: { fontSize: 14, color: "#6b7280" },
  routeText: { fontSize: 16, fontWeight: "600", color: "#374151", marginVertical: 10 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  label: { color: "#6b7280", fontSize: 14 },
  value: { color: "#1f2937", fontWeight: "600", fontSize: 14 },
  gpsStatus: { flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 12 },
  dot: { width: 8, height: 8, backgroundColor: "#10b981", borderRadius: 4, marginRight: 6 },
  connected: { fontSize: 14, fontWeight: "600", color: "#1f2937" },
  gpsText: { fontSize: 13, color: "#6b7280", marginLeft: 8 },
  mapContainer: { borderRadius: 20, overflow: "hidden", height: 250, marginTop: 10 },
  locateButton: { position: "absolute", bottom: 16, right: 16, backgroundColor: "#667eea", padding: 10, borderRadius: 20, elevation: 4 },
  callButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#667eea", paddingVertical: 14, paddingHorizontal: 24, borderRadius: 16, elevation: 5 },
  callText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
