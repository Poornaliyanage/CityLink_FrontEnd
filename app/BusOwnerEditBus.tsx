import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type RootStackParamList = {
  OwnerDashboard: undefined;
};

type Bus = {
  id: string;
  number: string;
  route: string;
  time: string;
  permit?: string;
  conductor?: string;
};

export default function OwnerAddBus() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [buses, setBuses] = useState<Bus[]>([
    {
      id: "1",
      number: "NB-1234",
      route: "Kandy → Colombo",
      time: "08:00 AM",
      permit: "permit.pdf",
      conductor: "John Doe",
    },
  ]);

  const [newBus, setNewBus] = useState<Bus>({
    id: "",
    number: "",
    route: "",
    time: "",
    permit: "",
    conductor: "",
  });

  const [editBus, setEditBus] = useState<Bus | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Animation refs
  const headerScale = useRef(new Animated.Value(0.8)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(80)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  }, []);

  const pickPermit = async <T extends Bus | null>(busSetter: React.Dispatch<React.SetStateAction<T>>) => {
    const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if ("uri" in result && result.uri) {
      const name = "name" in result && typeof (result as any).name === "string" ? (result as any).name : "";
      busSetter((prev) => (prev ? ({ ...prev, permit: name } as T) : prev));
    }
  };

  const addBus = () => {
    if (!newBus.number || !newBus.route || !newBus.time || !newBus.permit || !newBus.conductor) {
      Alert.alert("Error", "Please fill all fields, add a conductor and upload a permit PDF");
      return;
    }
    setBuses([...buses, { ...newBus, id: Date.now().toString() }]);
    setNewBus({ id: "", number: "", route: "", time: "", permit: "", conductor: "" });
  };

  const updateBus = () => {
    if (editBus) {
      if (!editBus.number || !editBus.route || !editBus.time || !editBus.permit || !editBus.conductor) {
        Alert.alert("Error", "Please fill all fields");
        return;
      }
      setBuses(buses.map((bus) => (bus.id === editBus.id ? editBus : bus)));
      setEditBus(null);
      setIsModalVisible(false);
    }
  };

  const deleteBus = (id: string) => {
    setBuses(buses.filter((bus) => bus.id !== id));
  };

  const openEditModal = (bus: Bus) => {
    setEditBus(bus);
    setIsModalVisible(true);
  };

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
                    <Text style={{ fontSize: 20, fontWeight: "800", color: "#1f2937" }}>Add / Edit Buses</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("OwnerDashboard")}
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.3)", borderRadius: 16, padding: 12 }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="person-outline" size={20} color="#374151" />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Bus Cards */}
            <Animated.View style={{ transform: [{ translateY: cardSlide }], opacity: cardOpacity }}>
              {buses.map((bus) => (
                <Animated.View
                  key={bus.id}
                  style={{ marginBottom: 16, transform: [{ translateY: cardSlide }], opacity: cardOpacity }}
                >
                  <LinearGradient
                    colors={["#a8edea", "#fed6e3"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 20,
                      padding: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.1,
                      shadowRadius: 10,
                      elevation: 6,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: "700", color: "#1f2937" }}>{bus.number}</Text>
                      <Text style={{ fontSize: 14, color: "#374151" }}>{bus.route}</Text>
                      <Text style={{ fontSize: 14, color: "#374151" }}>{bus.time}</Text>
                      <Text style={{ fontSize: 14, color: "#374151" }}>{bus.permit}</Text>
                      <Text style={{ fontSize: 14, color: "#374151" }}>Conductor: {bus.conductor}</Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#FBBF24",
                          borderRadius: 12,
                          padding: 8,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => openEditModal(bus)}
                      >
                        <Ionicons name="pencil-outline" size={20} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#EF4444",
                          borderRadius: 12,
                          padding: 8,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => deleteBus(bus.id)}
                      >
                        <Ionicons name="trash-outline" size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </Animated.View>
              ))}

              {/* Add New Bus Card */}
              <Animated.View style={{ marginBottom: 16, transform: [{ translateY: cardSlide }], opacity: cardOpacity }}>
                <LinearGradient
                  colors={["#a8edea", "#fed6e3"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 20,
                    padding: 16,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 6,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 8, color: "#1f2937" }}>
                    Add New Bus
                  </Text>
                  <TextInput
                    placeholder="Bus Number"
                    value={newBus.number}
                    onChangeText={(text) => setNewBus({ ...newBus, number: text })}
                    style={{ backgroundColor: "white", borderRadius: 12, padding: 10, marginBottom: 8 }}
                  />
                  <TextInput
                    placeholder="Route"
                    value={newBus.route}
                    onChangeText={(text) => setNewBus({ ...newBus, route: text })}
                    style={{ backgroundColor: "white", borderRadius: 12, padding: 10, marginBottom: 8 }}
                  />
                  <TextInput
                    placeholder="Time"
                    value={newBus.time}
                    onChangeText={(text) => setNewBus({ ...newBus, time: text })}
                    style={{ backgroundColor: "white", borderRadius: 12, padding: 10, marginBottom: 8 }}
                  />
                  <TextInput
                    placeholder="Conductor Name"
                    value={newBus.conductor}
                    onChangeText={(text) => setNewBus({ ...newBus, conductor: text })}
                    style={{ backgroundColor: "white", borderRadius: 12, padding: 10, marginBottom: 8 }}
                  />
                  <TouchableOpacity
                    onPress={() => pickPermit(setNewBus)}
                    style={{
                      backgroundColor: "#667eea",
                      borderRadius: 12,
                      padding: 12,
                      marginBottom: 8,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white" }}>{newBus.permit ? newBus.permit : "Upload Permit PDF"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={addBus}
                    style={{ backgroundColor: "#5A2DFF", borderRadius: 12, padding: 12, alignItems: "center" }}
                  >
                    <Text style={{ color: "white", fontWeight: "700" }}>Add Bus</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </Animated.View>
            </Animated.View>

            {/* Edit Bus Modal */}
            <Modal visible={isModalVisible} transparent animationType="slide">
              <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20 }}>
                <LinearGradient
                  colors={["#a8edea", "#fed6e3"]}
                  style={{ borderRadius: 20, padding: 16 }}
                >
                  <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>Edit Bus</Text>
                  <TextInput
                    placeholder="Bus Number"
                    value={editBus?.number}
                    onChangeText={(text) => editBus && setEditBus({ ...editBus, number: text })}
                    style={{ backgroundColor: "white", borderRadius: 12, padding: 10, marginBottom: 8 }}
                  />
                  <TextInput
                    placeholder="Route"
                    value={editBus?.route}
                    onChangeText={(text) => editBus && setEditBus({ ...editBus, route: text })}
                    style={{ backgroundColor: "white", borderRadius: 12, padding: 10, marginBottom: 8 }}
                  />
                  <TextInput
                    placeholder="Time"
                    value={editBus?.time}
                    onChangeText={(text) => editBus && setEditBus({ ...editBus, time: text })}
                    style={{ backgroundColor: "white", borderRadius: 12, padding: 10, marginBottom: 8 }}
                  />
                  <TextInput
                    placeholder="Conductor Name"
                    value={editBus?.conductor}
                    onChangeText={(text) => editBus && setEditBus({ ...editBus, conductor: text })}
                    style={{ backgroundColor: "white", borderRadius: 12, padding: 10, marginBottom: 8 }}
                  />
                  <TouchableOpacity
                    onPress={() => editBus && pickPermit(setEditBus)}
                    style={{
                      backgroundColor: "#667eea",
                      borderRadius: 12,
                      padding: 12,
                      marginBottom: 8,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white" }}>{editBus?.permit ? editBus.permit : "Upload Permit PDF"}</Text>
                  </TouchableOpacity>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <TouchableOpacity
                      onPress={updateBus}
                      style={{ backgroundColor: "#5A2DFF", borderRadius: 12, padding: 12, flex: 1, marginRight: 5, alignItems: "center" }}
                    >
                      <Text style={{ color: "white", fontWeight: "700" }}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setIsModalVisible(false)}
                      style={{ backgroundColor: "#EF4444", borderRadius: 12, padding: 12, flex: 1, marginLeft: 5, alignItems: "center" }}
                    >
                      <Text style={{ color: "white", fontWeight: "700" }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            </Modal>

            {/* Back Button */}
            <View style={{ height: 40 }} />
            <TouchableOpacity
              onPress={() => navigation.navigate("OwnerDashboard")}
              style={{
                backgroundColor: "#5A2DFF",
                paddingVertical: 14,
                borderRadius: 12,
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Back to Dashboard</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
