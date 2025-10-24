import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

interface Bus {
  bus_id: string;
  registration_number: string;
  service: string;
  route_name: string;
  route_number: string;
  start_point: string;
  end_point: string;
  price: number;
  distance: number;
  totalSeats: number;
  availableSeats: number;
}

interface SearchData {
  from: string;
  to: string;
  date: string;
  numberOfSeats: number;
  service: string;
}

interface Seat {
  seatNumber: number;
  isAvailable: boolean;
  isSelected: boolean;
}

export default function SeatSelection() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const bus: Bus = params.bus ? JSON.parse(params.bus as string) : null;
  const searchData: SearchData = params.searchData ? JSON.parse(params.searchData as string) : null;

  const [seatLayout, setSeatLayout] = useState<Seat[][]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState(false);
  const [confirming, setConfirming] = useState(false);
  
  // Passenger details
  const [passengerName, setPassengerName] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");

  useEffect(() => {
    if (bus) {
      fetchSeatLayout();
    }
  }, [bus]);

  const fetchSeatLayout = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://172.20.10.5:5000/api/seat-reservation/seat-layout/${bus.bus_id}?travelDate=${searchData.date}`
      );
      const data = await response.json();

      if (data.success) {
        setSeatLayout(data.seatLayout);
      } else {
        Alert.alert("Error", data.message || "Failed to load seat layout");
      }
    } catch (error) {
      console.error("Error fetching seat layout:", error);
      Alert.alert("Error", "Failed to load seat layout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSeatPress = (seatNumber: number, isAvailable: boolean) => {
    if (!isAvailable) {
      Alert.alert("Seat Unavailable", "This seat is already booked.");
      return;
    }

    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        // Deselect
        return prev.filter(s => s !== seatNumber);
      } else {
        // Check if max seats reached
        if (prev.length >= searchData.numberOfSeats) {
          Alert.alert(
            "Maximum Seats Selected",
            `You can only select ${searchData.numberOfSeats} seat(s).`
          );
          return prev;
        }
        // Select
        return [...prev, seatNumber];
      }
    });
  };

  const getTotalAmount = () => {
    return selectedSeats.length * bus.price;
  };

  const validateForm = () => {
    if (!passengerName.trim()) {
      Alert.alert("Required", "Please enter passenger name");
      return false;
    }
    if (!passengerPhone.trim() || passengerPhone.length < 10) {
      Alert.alert("Required", "Please enter a valid phone number");
      return false;
    }
    if (!passengerEmail.trim() || !passengerEmail.includes("@")) {
      Alert.alert("Required", "Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      Alert.alert("No Seats Selected", "Please select at least one seat.");
      return;
    }

    setBookingModal(true);
  };

  const confirmBooking = async () => {
    if (!validateForm()) return;

    setConfirming(true);
    try {
      const response = await fetch(
        "http://172.20.10.5:5000/api/seat-reservation/create-booking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            busId: bus.bus_id,
            travelDate: searchData.date,
            selectedSeats: selectedSeats,
            passengerName: passengerName,
            passengerPhone: passengerPhone,
            passengerEmail: passengerEmail,
            totalAmount: getTotalAmount(),
            userId: 1, // Replace with actual user ID from auth
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setBookingModal(false);
        Alert.alert(
          "Booking Confirmed! 🎉",
          `Your seats ${selectedSeats.join(", ")} have been booked successfully.\n\nBooking ID: ${data.booking.bookingId}\nTotal Amount: Rs. ${data.booking.totalAmount}`,
          [
            {
              text: "OK",
              onPress: () => router.push("/"),
            },
          ]
        );
      } else {
        Alert.alert("Booking Failed", data.message || "Please try again.");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      Alert.alert("Error", "Failed to create booking. Please try again.");
    } finally {
      setConfirming(false);
    }
  };

  const getSeatColor = (seat: Seat) => {
    if (!seat.isAvailable) return "#ef4444"; // Red - Booked
    if (selectedSeats.includes(seat.seatNumber)) return "#10b981"; // Green - Selected
    return "#d1d5db"; // Gray - Available
  };

  const getSeatIcon = (seat: Seat) => {
    if (!seat.isAvailable) return "close-circle";
    if (selectedSeats.includes(seat.seatNumber)) return "checkmark-circle";
    return "ellipse-outline";
  };

  if (!bus || !searchData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Invalid data. Please go back and try again.</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={["#a8edea", "#fed6e3"]} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight || 0 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 20,
              paddingBottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
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
                Select Seats
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  marginTop: 4,
                }}
              >
                {bus.route_name}
              </Text>
            </View>
          </View>

          {/* Bus Info Card */}
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              marginHorizontal: 20,
              marginBottom: 15,
              padding: 16,
              borderRadius: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#374151" }}>
                {bus.registration_number}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#667eea" }}>
                Rs. {bus.price} / seat
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="calendar-outline" size={14} color="#6b7280" />
              <Text style={{ fontSize: 12, color: "#6b7280", marginLeft: 6 }}>
                {searchData.date}
              </Text>
            </View>
          </View>

          {/* Legend */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginHorizontal: 20,
              marginBottom: 15,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              padding: 12,
              borderRadius: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 20, height: 20, backgroundColor: "#d1d5db", borderRadius: 6 }} />
              <Text style={{ fontSize: 12, color: "#6b7280", marginLeft: 6 }}>Available</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 20, height: 20, backgroundColor: "#10b981", borderRadius: 6 }} />
              <Text style={{ fontSize: 12, color: "#6b7280", marginLeft: 6 }}>Selected</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 20, height: 20, backgroundColor: "#ef4444", borderRadius: 6 }} />
              <Text style={{ fontSize: 12, color: "#6b7280", marginLeft: 6 }}>Booked</Text>
            </View>
          </View>

          {loading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color="#667eea" />
              <Text style={{ marginTop: 10, color: "#6b7280" }}>Loading seats...</Text>
            </View>
          ) : (
            <>
              {/* Seat Layout */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  padding: 20,
                  paddingTop: 5,
                }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: 24,
                    padding: 20,
                    alignItems: "center",
                  }}
                >
                  {/* Driver Section */}
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: "#f3f4f6",
                      padding: 12,
                      borderRadius: 12,
                      marginBottom: 20,
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="person" size={24} color="#6b7280" />
                    <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Driver</Text>
                  </View>

                  {/* Seats */}
                  {seatLayout.map((row, rowIndex) => (
                    <View
                      key={rowIndex}
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginBottom: 12,
                        width: "100%",
                      }}
                    >
                      {row.map((seat, seatIndex) => (
                        <TouchableOpacity
                          key={seat.seatNumber}
                          onPress={() => handleSeatPress(seat.seatNumber, seat.isAvailable)}
                          activeOpacity={0.7}
                          style={{
                            width: 60,
                            height: 60,
                            backgroundColor: getSeatColor(seat),
                            borderRadius: 12,
                            justifyContent: "center",
                            alignItems: "center",
                            marginHorizontal: seatIndex === 0 ? 4 : 40,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                          }}
                        >
                          <Ionicons
                            name={getSeatIcon(seat)}
                            size={24}
                            color="white"
                          />
                          <Text style={{ fontSize: 12, fontWeight: "600", color: "white", marginTop: 2 }}>
                            {seat.seatNumber}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </View>

                <View style={{ height: 100 }} />
              </ScrollView>

              {/* Bottom Bar */}
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                  padding: 20,
                  paddingBottom: 30,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: -4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 10,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
                  <View>
                    <Text style={{ fontSize: 12, color: "#6b7280" }}>Selected Seats</Text>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#374151" }}>
                      {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 12, color: "#6b7280" }}>Total Amount</Text>
                    <Text style={{ fontSize: 24, fontWeight: "800", color: "#667eea" }}>
                      Rs. {getTotalAmount()}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleBooking}
                  disabled={selectedSeats.length === 0}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={selectedSeats.length > 0 ? ["#667eea", "#764ba2"] : ["#d1d5db", "#9ca3af"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 16,
                      padding: 16,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "white",
                        letterSpacing: 0.5,
                      }}
                    >
                      Proceed to Book
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          )}
        </SafeAreaView>
      </LinearGradient>

      {/* Booking Modal */}
      <Modal
        visible={bookingModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBookingModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              maxHeight: "80%",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Text style={{ fontSize: 22, fontWeight: "700", color: "#1f2937" }}>
                Passenger Details
              </Text>
              <TouchableOpacity onPress={() => setBookingModal(false)}>
                <Ionicons name="close-circle" size={28} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Booking Summary */}
              <View
                style={{
                  backgroundColor: "#f9fafb",
                  padding: 16,
                  borderRadius: 16,
                  marginBottom: 20,
                }}
              >
                <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
                  {bus.route_name} • {searchData.date}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#374151", marginBottom: 4 }}>
                  Seats: {selectedSeats.join(", ")}
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "700", color: "#667eea" }}>
                  Total: Rs. {getTotalAmount()}
                </Text>
              </View>

              {/* Form Fields */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 }}>
                  Full Name *
                </Text>
                <TextInput
                  value={passengerName}
                  onChangeText={setPassengerName}
                  placeholder="Enter your full name"
                  style={{
                    backgroundColor: "#f9fafb",
                    padding: 14,
                    borderRadius: 12,
                    fontSize: 16,
                    color: "#374151",
                  }}
                />
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 }}>
                  Phone Number *
                </Text>
                <TextInput
                  value={passengerPhone}
                  onChangeText={setPassengerPhone}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  style={{
                    backgroundColor: "#f9fafb",
                    padding: 14,
                    borderRadius: 12,
                    fontSize: 16,
                    color: "#374151",
                  }}
                />
              </View>

              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 }}>
                  Email Address *
                </Text>
                <TextInput
                  value={passengerEmail}
                  onChangeText={setPassengerEmail}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    backgroundColor: "#f9fafb",
                    padding: 14,
                    borderRadius: 12,
                    fontSize: 16,
                    color: "#374151",
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={confirmBooking}
                disabled={confirming}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 16,
                    padding: 16,
                    alignItems: "center",
                  }}
                >
                  {confirming ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "white",
                        letterSpacing: 0.5,
                      }}
                    >
                      Confirm Booking
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}