import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BASE_URL } from "../config";

export default function SeatSelect() {
  const { bus, searchData } = useLocalSearchParams();
  const router = useRouter();

  // parse incoming params (should exist)
  const selectedBus = bus ? JSON.parse(bus as string) : null;
  const search = searchData ? JSON.parse(searchData as string) : null;

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // token and optional stored userId (if you saved user in AsyncStorage)
  const [token, setToken] = useState<string | null>(null);
  const [storedUserId, setStoredUserId] = useState<number | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const t = await AsyncStorage.getItem("token");
        setToken(t);

        const userJson = await AsyncStorage.getItem("user"); // optional: keep user object at login
        if (userJson) {
          try {
            const u = JSON.parse(userJson);
            if (u?.user_id) setStoredUserId(Number(u.user_id));
            else if (u?.id) setStoredUserId(Number(u.id));
          } catch (e) {
            console.warn("Failed to parse stored user:", e);
          }
        }
      } catch (err) {
        console.error("Failed to load token/user:", err);
      }
    };

    loadAuth();
  }, []);

  // fetch booked seats for this bus/date
  useEffect(() => {
    if (!selectedBus || !search) return;

    let cancelled = false;

    const fetchBookedSeats = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/bookings/${selectedBus.bus_id}?date=${encodeURIComponent(search.date)}`
        );
        if (!res.ok) {
          console.warn("Fetch booked seats returned not ok:", res.status);
        }
        const data = await res.json();

        // data might be:
        // - array of numbers [3,7,8]
        // - array of objects [{seat_number:3}, {seat_number:7}] 
        // - array of objects [{seatNumber:3}] depending on server
        let seatsArr: number[] = [];

        if (Array.isArray(data)) {
          if (data.length === 0) seatsArr = [];
          else if (typeof data[0] === "number") seatsArr = data as number[];
          else if (data[0].seat_number !== undefined) seatsArr = data.map((r: any) => Number(r.seat_number));
          else if (data[0].seatNumber !== undefined) seatsArr = data.map((r: any) => Number(r.seatNumber));
          else {
            // fallback: try mapping any numeric values
            seatsArr = data
              .map((r: any) => {
                if (typeof r === "number") return r;
                const vals = Object.values(r).filter((v: any) => typeof v === "number" || /^\d+$/.test(String(v)));
                return vals.length ? Number(vals[0]) : null;
              })
              .filter(Boolean) as number[];
          }
        }

        if (!cancelled) setBookedSeats(seatsArr);
      } catch (err) {
        console.error("Error fetching booked seats:", err);
      }
    };

    fetchBookedSeats();
    return () => {
      cancelled = true;
    };
  }, [selectedBus, search]);

  // toggles
  const toggleSeat = (seatNum: number) => {
    if (bookedSeats.includes(seatNum)) return; // cannot select booked

    setSelectedSeats((prev) =>
      prev.includes(seatNum) ? prev.filter((s) => s !== seatNum) : [...prev, seatNum]
    );
  };

  // Booking handler - supports secure (token) single-call flow and fallback
  const handleBooking = async () => {
    if (!selectedBus || !search) {
      Alert.alert("Error", "Missing bus or search data.");
      return;
    }
    if (selectedSeats.length === 0) {
      Alert.alert("No Seats Selected", "Please select at least one seat.");
      return;
    }

    setLoading(true);
    try {
      // Secure flow: token present -> send seats array in one request with Authorization header
      if (token) {
        const payload = {
          busId: selectedBus.bus_id,
          seats: selectedSeats,
          travelDate: search.date, // server expects travelDate in secure route
          price: selectedBus.price,
          from: search.from,
          to: search.to,
          service: search.service,
        };

        console.log("Booking (secure) payload:", payload);

        const res = await fetch(`${BASE_URL}/api/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        if (!res.ok) {
          console.error("Booking failed (secure):", res.status, json);
          throw new Error(json?.message || `Booking failed (${res.status})`);
        }

        Alert.alert("Success", "Seats booked successfully!");
        router.back();
        return;
      }

      // No token => attempt to use storedUserId if available.
      // First try sending seats array with userId (dev mode, server may accept it)
      if (storedUserId) {
        const payload = {
          userId: storedUserId,
          busId: selectedBus.bus_id,
          seats: selectedSeats,
          travelDate: search.date,
          price: selectedBus.price,
          from: search.from,
          to: search.to,
          service: search.service,
        };

        console.log("Booking (dev userId) payload:", payload);

        const res = await fetch(`${BASE_URL}/api/bookings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        // If server accepts this format (201/200) we're done
        if (res.ok) {
          Alert.alert("Success", "Seats booked successfully!");
          router.back();
          return;
        }

        // Otherwise fallthrough to per-seat fallback
        console.warn("Server rejected seats-array + userId, falling back to single-seat posts:", res.status, json);
      }

      // Fallback: send one POST per seat using legacy single-seat format
      for (const seat of selectedSeats) {
        const legacyPayload = {
          userId: storedUserId ?? null, // might be null in quick dev mode
          busId: selectedBus.bus_id,
          seatNumber: seat,
          travelDate: search.date, // prefer travelDate
          // include 'date' too in case backend expects it
          date: search.date,
          price: selectedBus.price,
          from: search.from,
          to: search.to,
          service: search.service,
        };

        console.log("Booking (fallback single-seat) payload:", legacyPayload);

        const res = await fetch(`${BASE_URL}/api/bookings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(legacyPayload),
        });

        const json = await res.json();
        if (!res.ok) {
          console.error("Single-seat booking failed:", res.status, json);
          throw new Error(json.message || `Failed booking seat ${seat}`);
        }
      }

      Alert.alert("Success", "Seats booked successfully!");
      router.back();
    } catch (err: any) {
      console.error("Booking error:", err);
      Alert.alert("Booking error", err.message || "Failed to book seats");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedBus || !search) {
    return (
      <View style={[styles.container, { justifyContent: "center", flex: 1 }]}>
        <Text style={styles.header}>Missing bus or search data</Text>
      </View>
    );
  }

  const totalSeats = Number(selectedBus.totalSeats ?? selectedBus.seat_count ?? 40);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Seat Selection for {selectedBus.route_name}</Text>

      {/* Seat Layout grid (4 per row with small aisle between 2 and 3) */}
      <View style={styles.layout}>
        {Array.from({ length: totalSeats }).map((_, i) => {
          const seatNum = i + 1;
          const isBooked = bookedSeats.includes(seatNum);
          const isSelected = selectedSeats.includes(seatNum);

          // provide aisle spacing after 2nd seat (index % 4 === 1)
          const extraStyle: any = {};
          if (i % 4 === 1) extraStyle.marginRight = 16;

          return (
            <TouchableOpacity
              key={seatNum}
              style={[
                styles.seat,
                isBooked && styles.booked,
                isSelected && styles.selected,
                extraStyle,
              ]}
              disabled={isBooked || loading}
              onPress={() => toggleSeat(seatNum)}
            >
              <Text style={[styles.seatText, (isBooked || isSelected) && styles.selectedText]}>
                {seatNum}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.legend}>
        <View style={[styles.colorBox, { backgroundColor: "#94a3b8" }]} />
        <Text style={styles.legendText}>Available</Text>

        <View style={[styles.colorBox, { backgroundColor: "#22c55e" }]} />
        <Text style={styles.legendText}>Selected</Text>

        <View style={[styles.colorBox, { backgroundColor: "#ef4444" }]} />
        <Text style={styles.legendText}>Booked</Text>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleBooking} disabled={loading}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.confirmText}>Confirm Booking ({selectedSeats.length})</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  layout: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
  },
  seat: {
    width: 45,
    height: 45,
    borderRadius: 10,
    margin: 6,
    backgroundColor: "#94a3b8", // available
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    backgroundColor: "#22c55e", // green
  },
  booked: {
    backgroundColor: "#ef4444", // red
  },
  seatText: {
    fontWeight: "bold",
    color: "white",
  },
  bookedText: {
    color: "#f9fafb",
  },
  selectedText: {
    color: "#f9fafb",
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    gap: 10,
  },
  legendText: {
    marginRight: 12,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 6,
  },
  confirmButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  confirmText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
