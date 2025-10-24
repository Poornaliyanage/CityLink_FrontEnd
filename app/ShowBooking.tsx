import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { BASE_URL } from "../config";

interface Booking {
  booking_id: number;
  seat_number: string;
  travel_date: string;
  price: number;
  status: string;
  qr_code: string;
  registration_number: string;
  service: string;
  route_name: string;
  start_point: string;
  end_point: string;
}

export default function ShowBooking() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [storedUserId, setStoredUserId] = useState<number | null>(null);

  // Load user from AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user");
        if (userJson) {
          const user = JSON.parse(userJson);
          const id = user?.user_id || user?.id;
          if (id) setStoredUserId(Number(id));
        }
      } catch (e) {
        console.warn("Failed to parse stored user:", e);
      }
    };
    getUserData();
  }, []);

  // Fetch user bookings
  useEffect(() => {
    if (!storedUserId) return;

    const fetchBookings = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/bookings/user/${storedUserId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Bookings data:", data);

        if (data.success && data.bookings?.length > 0) {
          setBookings(data.bookings);
          setError(null);
        } else {
          setBookings([]);
          setError("No booking found for this user.");
        }
      } catch (err) {
        console.error("Fetch booking error:", err);
        setBookings([]);
        setError("Error fetching booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [storedUserId]);

  return (
    <LinearGradient colors={["#a8edea", "#fed6e3"]} style={{ flex: 1, padding: 20 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            position: "absolute",
            top: 50,
            left: 20,
            backgroundColor: "rgba(255,255,255,0.7)",
            borderRadius: 20,
            padding: 10,
            zIndex: 10,
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#374151" />
        </TouchableOpacity>

        <View
          style={{
            width: "100%",
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: 20,
            padding: 24,
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#1f2937", marginBottom: 16 }}>
            Your Bookings
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#667eea" />
          ) : error ? (
            <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
          ) : (
            bookings.map((booking) => (
              <View
                key={booking.booking_id}
                style={{
                  width: "100%",
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 16,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text style={{ fontWeight: "600", marginBottom: 8 }}>
                  {booking.route_name} ({booking.start_point} → {booking.end_point})
                </Text>
                <Text style={{ marginBottom: 8 }}>Seat: {booking.seat_number}</Text>
                <Text style={{ marginBottom: 8 }}>Date: {booking.travel_date}</Text>
                <Text style={{ marginBottom: 8 }}>Bus: {booking.registration_number} ({booking.service})</Text>
                {booking.qr_code && (
                  <Image
                    source={{ uri: booking.qr_code }}
                    style={{ width: 200, height: 200, borderRadius: 16, marginTop: 8 }}
                    resizeMode="contain"
                  />
                )}
              </View>
            ))
          )}

          {!loading && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "#667eea",
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 24,
                marginTop: 16,
              }}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>Back to Dashboard</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
