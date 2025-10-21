import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
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

export default function ConductorTimetable() {
  const router = useRouter();

  // Dropdowns for cities
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

  // Dropdown for Service type
  const [openService, setOpenService] = useState(false);
  const [serviceType, setServiceType] = useState(null);
  const [serviceOptions, setServiceOptions] = useState([
    { label: "Normal Service", value: "normal" },
    { label: "Semi Luxury", value: "semi" },
    { label: "Luxury (A/C)", value: "ac" },
    { label: "Super Luxury", value: "super" },
  ]);

  // Date and time
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date): void => {
    const currentDate = selectedDate || date;
    setShowDate(false);
    setDate(currentDate);
  };

  const handleTimeChange = (event: any, selectedTime?: Date): void => {
    const currentTime = selectedTime || date;
    setShowTime(false);
    setDate(currentTime);
  };

  const handleSearch = () => {
    if (!fromCity || !toCity) {
      Alert.alert("Error", "Please select both starting and destination cities.");
      return;
    }
    if (fromCity === toCity) {
      Alert.alert("Error", "Starting and destination cities cannot be the same.");
      return;
    }
    if (!serviceType) {
      Alert.alert("Error", "Please select a service type.");
      return;
    }

    console.log("Viewing timetable", { fromCity, toCity, serviceType, date });
    router.push("/ConductorShowTimetable" as any); // navigate to timetable results page
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
            <Text style={styles.headerTitle}>Conductor Timetable</Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              {/* Date Picker */}
              <Text style={styles.label}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowDate(true)} style={styles.input}>
                <Text style={{ color: "#374151" }}>{date.toLocaleDateString()}</Text>
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
              <Text style={styles.label}>Select Time</Text>
              <TouchableOpacity onPress={() => setShowTime(true)} style={styles.input}>
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
              <Text style={styles.label}>From</Text>
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
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
              />

              {/* To Dropdown */}
              <Text style={styles.label}>To</Text>
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
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
              />

              {/* Service Type Dropdown */}
              <Text style={styles.label}>Service Type</Text>
              <DropDownPicker
                open={openService}
                value={serviceType}
                items={serviceOptions}
                setOpen={setOpenService}
                setValue={setServiceType}
                setItems={setServiceOptions}
                placeholder="Select service type"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
              />

              {/* Search Button */}
              <TouchableOpacity activeOpacity={0.8} onPress={handleSearch} style={styles.buttonShadow}>
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.button}
                >
                  <Ionicons name="clipboard-outline" size={22} color="#fff" style={{ marginRight: 10 }} />
                  <Text style={styles.buttonText}>View Timetable</Text>
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

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginLeft: 12,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingVertical: 40,
  },
  card: {
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
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: "#f3f4f6",
    borderColor: "transparent",
    marginBottom: 20,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderColor: "#e5e7eb",
  },
  buttonShadow: {
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  button: {
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
