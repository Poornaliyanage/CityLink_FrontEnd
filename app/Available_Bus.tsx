import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
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

export default function Available_Bus() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const buses: Bus[] = params.buses ? JSON.parse(params.buses as string) : [];
  const searchData: SearchData = params.searchData ? JSON.parse(params.searchData as string) : null;

  const getServiceLabel = (code: string) => {
    switch(code) {
      case 'N': return 'Normal Service';
      case 'S': return 'Semi Luxury';
      case 'L': return 'Luxury (A/C)';
      case 'XL': return 'Super Luxury';
      default: return code;
    }
  };

  const getServiceColor = (code: string) => {
    switch(code) {
      case 'N': return '#10b981';
      case 'S': return '#3b82f6';
      case 'L': return '#8b5cf6';
      case 'XL': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const handleBusSelect = (bus: Bus) => {
    // Navigate to seat selection screen
    router.push({
      pathname: '/SeatSelect',
      params: {
        bus: JSON.stringify(bus),
        searchData: JSON.stringify(searchData)
      }
    });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={["#a8edea", "#fed6e3"]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight || 0 }}>
          {/* Header */}
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 20,
            paddingBottom: 10,
          }}>
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
              <Text style={{
                fontSize: 24,
                fontWeight: "800",
                color: "#1f2937",
                letterSpacing: -0.5,
              }}>
                Available Buses
              </Text>
              <Text style={{
                fontSize: 14,
                color: "#6b7280",
                marginTop: 4,
              }}>
                {buses.length} bus{buses.length !== 1 ? 'es' : ''} found
              </Text>
            </View>
          </View>

          {/* Search Summary */}
          {searchData && (
            <View style={{
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
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Ionicons name="location-outline" size={16} color="#667eea" />
                <Text style={{ fontSize: 14, color: "#374151", marginLeft: 8 }}>
                  {searchData.from} → {searchData.to}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                  <Text style={{ fontSize: 12, color: "#6b7280", marginLeft: 6 }}>
                    {searchData.date}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="people-outline" size={14} color="#6b7280" />
                  <Text style={{ fontSize: 12, color: "#6b7280", marginLeft: 6 }}>
                    {searchData.numberOfSeats} seat{searchData.numberOfSeats > 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Bus List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 20,
              paddingTop: 5,
            }}
          >
            {buses.map((bus, index) => (
              <TouchableOpacity
                key={bus.bus_id}
                onPress={() => handleBusSelect(bus)}
                activeOpacity={0.9}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: 24,
                  padding: 20,
                  marginBottom: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 5,
                }}
              >
                {/* Bus Header */}
                <View style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}>
                  <View style={{ flex: 1 }}>
                    <View style={{
                      backgroundColor: `${getServiceColor(bus.service)}15`,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 12,
                      alignSelf: "flex-start",
                      marginBottom: 8,
                    }}>
                      <Text style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: getServiceColor(bus.service),
                      }}>
                        {getServiceLabel(bus.service)}
                      </Text>
                    </View>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#1f2937",
                      marginBottom: 4,
                    }}>
                      {bus.route_name}
                    </Text>
                    <Text style={{
                      fontSize: 13,
                      color: "#6b7280",
                    }}>
                      Route {bus.route_number} • {bus.registration_number}
                    </Text>
                  </View>
                  
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{
                      fontSize: 24,
                      fontWeight: "800",
                      color: "#667eea",
                    }}>
                      Rs. {bus.price}
                    </Text>
                    <Text style={{
                      fontSize: 11,
                      color: "#9ca3af",
                    }}>
                      per seat
                    </Text>
                  </View>
                </View>

                {/* Route Info */}
                <View style={{
                  backgroundColor: "#f9fafb",
                  borderRadius: 16,
                  padding: 14,
                  marginBottom: 14,
                }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                        From
                      </Text>
                      <Text style={{ fontSize: 15, fontWeight: "600", color: "#374151" }}>
                        {bus.start_point}
                      </Text>
                    </View>
                    
                    <View style={{
                      backgroundColor: "#667eea",
                      borderRadius: 20,
                      padding: 8,
                      marginHorizontal: 12,
                    }}>
                      <Ionicons name="arrow-forward" size={16} color="white" />
                    </View>
                    
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                      <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                        To
                      </Text>
                      <Text style={{ fontSize: 15, fontWeight: "600", color: "#374151" }}>
                        {bus.end_point}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Bus Info Grid */}
                <View style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}>
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <View style={{
                      backgroundColor: "#f0fdf4",
                      borderRadius: 12,
                      padding: 8,
                      marginBottom: 6,
                    }}>
                      <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                    </View>
                    <Text style={{ fontSize: 11, color: "#6b7280", marginBottom: 2 }}>
                      Available
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#10b981" }}>
                      {bus.availableSeats}
                    </Text>
                  </View>
                  
                  <View style={{
                    width: 1,
                    backgroundColor: "#e5e7eb",
                    marginHorizontal: 8,
                  }} />
                  
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <View style={{
                      backgroundColor: "#eff6ff",
                      borderRadius: 12,
                      padding: 8,
                      marginBottom: 6,
                    }}>
                      <Ionicons name="car-outline" size={20} color="#3b82f6" />
                    </View>
                    <Text style={{ fontSize: 11, color: "#6b7280", marginBottom: 2 }}>
                      Total Seats
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#374151" }}>
                      {bus.totalSeats}
                    </Text>
                  </View>
                  
                  <View style={{
                    width: 1,
                    backgroundColor: "#e5e7eb",
                    marginHorizontal: 8,
                  }} />
                  
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <View style={{
                      backgroundColor: "#fef3c7",
                      borderRadius: 12,
                      padding: 8,
                      marginBottom: 6,
                    }}>
                      <Ionicons name="navigate-outline" size={20} color="#f59e0b" />
                    </View>
                    <Text style={{ fontSize: 11, color: "#6b7280", marginBottom: 2 }}>
                      Distance
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#374151" }}>
                      {bus.distance} km
                    </Text>
                  </View>
                </View>

                {/* Select Button */}
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 16,
                    padding: 14,
                    alignItems: "center",
                  }}
                >
                  <Text style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: "white",
                    letterSpacing: 0.5,
                  }}>
                    Select Seats →
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}

            <View style={{ height: 20 }} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}