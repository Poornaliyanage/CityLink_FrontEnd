import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

export default function BookingTicket() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const booking = params.booking ? JSON.parse(params.booking as string) : null;

  if (!booking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No booking data found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={{ padding: 20 }}>
        <View style={{ backgroundColor: "white", borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: "800", textAlign: "center", marginBottom: 20, color: "#10b981" }}>
            Booking Confirmed! 🎉
          </Text>
          
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#374151" }}>Booking ID</Text>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#667eea" }}>#{booking.bookingId}</Text>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#374151" }}>Route</Text>
            <Text style={{ fontSize: 16, color: "#1f2937" }}>
              {booking.busDetails.from} → {booking.busDetails.to}
            </Text>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#374151" }}>Bus</Text>
            <Text style={{ fontSize: 16, color: "#1f2937" }}>
              {booking.busDetails.registration} • {booking.busDetails.route}
            </Text>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#374151" }}>Travel Date</Text>
            <Text style={{ fontSize: 16, color: "#1f2937" }}>{booking.travelDate}</Text>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#374151" }}>Seats</Text>
            <Text style={{ fontSize: 16, color: "#1f2937" }}>
              {booking.seats.sort((a: number, b: number) => a - b).join(", ")}
            </Text>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#374151" }}>Total Amount</Text>
            <Text style={{ fontSize: 20, fontWeight: "800", color: "#10b981" }}>
              Rs. {booking.totalAmount}
            </Text>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#374151" }}>Status</Text>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: "700", 
              color: booking.status === 'confirmed' ? '#10b981' : '#f59e0b' 
            }}>
              {booking.status.toUpperCase()}
            </Text>
          </View>

          {booking.qrCode && (
            <View style={{ alignItems: "center", marginTop: 20, padding: 20, backgroundColor: "#f9fafb", borderRadius: 12 }}>
              <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 10 }}>QR Code Data</Text>
              <Text style={{ fontSize: 12, color: "#374151", textAlign: "center" }}>{booking.qrCode}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={{ padding: 20 }}>
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={{
            backgroundColor: "#667eea",
            borderRadius: 12,
            padding: 16,
            alignItems: "center"
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}