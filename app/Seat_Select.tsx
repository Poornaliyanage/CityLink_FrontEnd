import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function Seat_Select() {
  const router = useRouter();

  // Seat grid (5 columns × 8 rows for example)
  const numRows = 8;
  const numCols = 5;

  // Simulate booked and selected seats
  const bookedSeats = [3, 8, 12, 17, 21];
  const [selectedSeats, setSelectedSeats] = useState<number[]>([9, 10]);

  const toggleSeat = (index: number) => {
    if (bookedSeats.includes(index)) return; // can't select booked seats
    setSelectedSeats((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const renderSeat = (index: number) => {
    const isBooked = bookedSeats.includes(index);
    const isSelected = selectedSeats.includes(index);
    let backgroundColor = "#D1C4E9"; // free seat (light purple)

    if (isBooked) backgroundColor = "#7E57C2"; // dark purple (booked)
    if (isSelected) backgroundColor = "#E53935"; // red (your seats)

    return (
      <TouchableOpacity
        key={index}
        style={[styles.seat, { backgroundColor }]}
        onPress={() => toggleSeat(index)}
        disabled={isBooked}
      />
    );
  };

  const renderRow = (rowIndex: number) => {
    const seats = [];
    for (let col = 0; col < numCols; col++) {
      const index = rowIndex * numCols + col;
      seats.push(renderSeat(index));
    }
    return (
      <View key={rowIndex} style={styles.row}>
        {seats}
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={["#a8edea", "#fed6e3"]} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight || 0 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={26} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Book a Bus</Text>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: "#E53935" }]} />
              <Text style={styles.legendText}>Your Seats</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: "#7E57C2" }]} />
              <Text style={styles.legendText}>Already Booked</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: "#D1C4E9" }]} />
              <Text style={styles.legendText}>Free Seats</Text>
            </View>
          </View>

          {/* Seat layout */}
          <View style={styles.layoutContainer}>
            {Array.from({ length: numRows }).map((_, i) => renderRow(i))}
          </View>

          {/* Trip details */}
          <View style={styles.tripDetails}>
            <Text style={styles.tripText}>
              Colombo → A'pura {"\n"}NB - 9878 {"\n"}SLTB A'pura
            </Text>
          </View>

          {/* Book button */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPress={() => alert(`Seats booked: ${selectedSeats.join(", ")}`)}
          >
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.buttonText}>Book a seat</Text>
            </LinearGradient>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginLeft: 12,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 18,
    height: 18,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    color: "#333",
  },
  layoutContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    marginVertical: 6,
  },
  seat: {
    width: 35,
    height: 35,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  tripDetails: {
    alignItems: "center",
    marginBottom: 20,
  },
  tripText: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    alignSelf: "center",
    width: "80%",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 40,
  },
  buttonGradient: {
    borderRadius: 18,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
