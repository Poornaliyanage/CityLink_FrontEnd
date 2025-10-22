import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export default function BusTimeTable() {
  const router = useRouter();

  // Dropdowns
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [fromCity, setFromCity] = useState(null);
  const [toCity, setToCity] = useState(null);
  const [cities, setCities] = useState([
    { label: "Colombo", value: "colombo" },
    { label: "Kandy", value: "kandy" },
    { label: "Galle", value: "galle" },
    { label: "Jaffna", value: "jaffna" },
    { label: "Kurunegala", value: "kurunegala" },
    { label: "Negombo", value: "negombo" },
    { label: "Matara", value: "matara" },
    { label: "Anuradhapura", value: "anuradhapura" },
    { label: "Trincomalee", value: "trincomalee" },
    { label: "Batticaloa", value: "batticaloa" },
  ]);

  // Date and time
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date): void => {
    const currentDate: Date = selectedDate || date;
    setShowDate(false);
    setDate(currentDate);
  };

  const handleTimeChange = (event: any, selectedTime?: Date): void => {
    const currentTime: Date = selectedTime || date;
    setShowTime(false);
    setDate(currentTime);
  };

  const handleSearch = () => {
    console.log("Search pressed", { fromCity, toCity, date });
    // Navigate or handle search logic here
  };

  return (
    <>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={["#a8edea", "#fed6e3"]} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight || 0 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={26} color="#333" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: "#1f2937",
                marginLeft: 12,
              }}
            >
              Bus Time Table
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              paddingVertical: 40,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.95)",
                borderRadius: 28,
                padding: 25,
                width: "100%",
                maxWidth: 400,
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowOffset: { width: 0, height: 8 },
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              {/* Date Picker */}
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#374151", marginBottom: 8 }}>
                Select Date
              </Text>
              <TouchableOpacity
                onPress={() => setShowDate(true)}
                style={{
                  backgroundColor: "#f3f4f6",
                  borderRadius: 12,
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <Text style={{ color: "#374151" }}>
                  {date.toLocaleDateString()}
                </Text>
                <Ionicons name="calendar-outline" size={22} color="#6b7280" />
              </TouchableOpacity>
              {showDate && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateChange}
                />
              )}

              {/* Time Picker */}
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#374151", marginBottom: 8 }}>
                Select Time
              </Text>
              <TouchableOpacity
                onPress={() => setShowTime(true)}
                style={{
                  backgroundColor: "#f3f4f6",
                  borderRadius: 12,
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <Text style={{ color: "#374151" }}>
                  {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
                <Ionicons name="time-outline" size={22} color="#6b7280" />
              </TouchableOpacity>
              {showTime && (
                <DateTimePicker
                  value={date}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleTimeChange}
                />
              )}

              {/* From Dropdown */}
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#374151", marginBottom: 8 }}>
                From
              </Text>
              <DropDownPicker
                open={openFrom}
                value={fromCity}
                items={cities}
                setOpen={setOpenFrom}
                setValue={setFromCity}
                setItems={setCities}
                placeholder="Select starting city"
                searchable={true}
                searchPlaceholder="Search city..."
                style={{
                  backgroundColor: "#f3f4f6",
                  borderColor: "transparent",
                  marginBottom: 20,
                }}
                dropDownContainerStyle={{
                  backgroundColor: "#fff",
                  borderColor: "#e5e7eb",
                }}
              />

              {/* To Dropdown */}
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#374151", marginBottom: 8 }}>
                To
              </Text>
              <DropDownPicker
                open={openTo}
                value={toCity}
                items={cities}
                setOpen={setOpenTo}
                setValue={setToCity}
                setItems={setCities}
                placeholder="Select destination city"
                searchable={true}
                searchPlaceholder="Search city..."
                style={{
                  backgroundColor: "#f3f4f6",
                  borderColor: "transparent",
                  marginBottom: 30,
                }}
                dropDownContainerStyle={{
                  backgroundColor: "#fff",
                  borderColor: "#e5e7eb",
                }}
              />

              {/* Search Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSearch}
                style={{
                  shadowColor: "#667eea",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 18,
                    paddingVertical: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="search-outline"
                    size={22}
                    color="#fff"
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: "700",
                      letterSpacing: 0.5,
                    }}
                  >
                    Search Buses
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={{ height: 60 }} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}


interface BusItem {
  id: string;
  route: string;
  time: string;
  transport: string;
  model: string;
  plate: string;
}

const busData: BusItem[] = [
  {
    id: "1",
    route: "Panadura–Colombo 100",
    time: "3.05 pm",
    transport: "Liyanage Transport",
    model: "LAL Viking",
    plate: "NC 4567",
  },
  {
    id: "2",
    route: "Panadura–Colombo 100",
    time: "3.08 pm",
    transport: "SLTB Kesbewa",
    model: "LAL Viking",
    plate: "NB 1771",
  },
  {
    id: "3",
    route: "Kaluthara–Colombo 400/1",
    time: "3.15 pm",
    transport: "SLTB KalutharaS",
    model: "LAL Viking",
    plate: "NB 4356",
  },
  {
    id: "4",
    route: "Mathugama–Colombo 349",
    time: "3.20 pm",
    transport: "Jagath express",
    model: "LAL Viking",
    plate: "ND 7890",
  },
  {
    id: "5",
    route: "Panadura–Colombo 100",
    time: "3.20 pm",
    transport: "SLTB Panadura",
    model: "LAL Viking",
    plate: "63 - 1551",
  },
  {
    id: "6",
    route: "Aluthgama–Colombo 400",
    time: "3.00 pm",
    transport: "S.M.R Travels",
    model: "LAL Viking",
    plate: "ND 3750",
  },
];

export function BusList() {
  const renderItem = ({ item }: { item: BusItem }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.route}>{item.route}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Text style={styles.transport}>{item.transport}</Text>
      <View style={styles.row}>
        <Text style={styles.model}>{item.model}</Text>
        <Text style={styles.plate}>{item.plate}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={busData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#B39DDB", // same purple tone
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
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
});
