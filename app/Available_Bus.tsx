import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface BusItem {
  id: string;
  route: string;
  transport: string;
  model: string;
  plate: string;
  departure: string;
  arrival: string;
  price: string;
}

const busData: BusItem[] = [
  {
    id: "1",
    route: "Kurunegala – Colombo (15N)",
    transport: "Samantha Travels",
    model: "LAL Viking",
    plate: "NC 9657",
    departure: "09:30 PM",
    arrival: "12:15 AM",
    price: "930",
  },
  {
    id: "2",
    route: "Kurunegala – Colombo (15N)",
    transport: "SLTB Kurunegala Depot",
    model: "LAL Viking",
    plate: "NB 9878",
    departure: "09:30 PM",
    arrival: "12:30 AM",
    price: "930",
  },
  {
    id: "3",
    route: "Kurunegala – Colombo (EX)",
    transport: "Denuwara Express",
    model: "LAL Viking AC",
    plate: "NC 5544",
    departure: "09:30 PM",
    arrival: "12:00 AM",
    price: "1050",
  },
];

export default function Select_Bus() {
  const router = useRouter();

  const renderItem = ({ item }: { item: BusItem }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.route}>{item.route}</Text>
        <Text style={styles.time}>{item.departure}</Text>
      </View>

      <Text style={styles.transport}>{item.transport}</Text>

      <View style={styles.row}>
        <Text style={styles.model}>{item.model}</Text>
        <Text style={styles.plate}>{item.plate}</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>LKR {item.price}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/Seat_Select" as any)}
      >
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <Ionicons
            name="bus-outline"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Select a seat</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

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
            <Text style={styles.headerText}>Available Buses</Text>
          </View>

          {/* Info Section */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Kurunegala → Colombo {"\n"}
              Date: 24 Oct 2025 | Time: 21:30
            </Text>
          </View>

          <FlatList
            data={busData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
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
  infoBox: {
    backgroundColor: "rgba(255,255,255,0.9)",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#B39DDB",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  route: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  time: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
  },
  transport: {
    fontSize: 14,
    color: "#4A4A4A",
    marginTop: 4,
  },
  model: {
    fontSize: 13,
    color: "#4A4A4A",
    marginTop: 4,
  },
  plate: {
    fontSize: 13,
    color: "#4A4A4A",
    marginTop: 4,
  },
  priceContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  price: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  button: {
    marginTop: 8,
  },
  buttonGradient: {
    borderRadius: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
