import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

type ServiceType = {
  id: string;
  label: string;
  code: string;
  description: string;
  icon: string;
};

interface ReservationData {
  date: string;
  from: string;
  to: string;
  service: ServiceType | null;
  numberOfSeats: string;
}

export default function SeatReservation() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [reservationData, setReservationData] = useState<ReservationData>({
    date: "",
    from: "",
    to: "",
    service: null,
    numberOfSeats: "1",
  });

  // Animation refs
  const headerScale = useRef(new Animated.Value(0.8)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(100)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;

  const serviceTypes: ServiceType[] = [
    {
      id: "1",
      label: "Normal Service",
      code: "N",
      description: "Standard comfort travel",
      icon: "bus-outline",
    },
    {
      id: "2",
      label: "Semi Luxury",
      code: "S",
      description: "Enhanced comfort features",
      icon: "car-sport-outline",
    },
    {
      id: "3",
      label: "Luxury (A/C)",
      code: "A/C",
      description: "Air conditioned comfort",
      icon: "snow-outline",
    },
    {
      id: "4",
      label: "Super Luxury",
      code: "XL",
      description: "Premium travel experience",
      icon: "diamond-outline",
    },
  ];

  useEffect(() => {
    // Header animation
    Animated.parallel([
      Animated.spring(headerScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Card animation
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(cardSlide, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    // Form animation
    setTimeout(() => {
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 600);
  }, []);

  const updateReservationData = (field: keyof ReservationData, value: any) => {
    setReservationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const generateCalendarDays = (): Date[] => {
    const today = new Date();
    const days: Date[] = [];
    
    // Generate next 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    updateReservationData("date", formatDate(date));
    setShowCalendar(false);
  };

  const handleServiceSelect = (service: ServiceType) => {
    updateReservationData("service", service);
    setShowServiceDropdown(false);
  };

  const validateForm = (): boolean => {
    if (!reservationData.date) {
      Alert.alert("Error", "Please select a date");
      return false;
    }
    if (!reservationData.from.trim()) {
      Alert.alert("Error", "Please enter departure city");
      return false;
    }
    if (!reservationData.to.trim()) {
      Alert.alert("Error", "Please enter destination city");
      return false;
    }
    if (reservationData.from.toLowerCase() === reservationData.to.toLowerCase()) {
      Alert.alert("Error", "Departure and destination cities cannot be the same");
      return false;
    }
    if (!reservationData.service) {
      Alert.alert("Error", "Please select a service type");
      return false;
    }
    if (!reservationData.numberOfSeats || parseInt(reservationData.numberOfSeats) < 1) {
      Alert.alert("Error", "Please enter a valid number of seats");
      return false;
    }
    if (parseInt(reservationData.numberOfSeats) > 10) {
      Alert.alert("Error", "Maximum 10 seats can be reserved at once");
      return false;
    }
    return true;
  };

  const handleSearch = () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log("Search data:", reservationData);
      Alert.alert(
        "Search Results",
        `Searching buses from ${reservationData.from} to ${reservationData.to} on ${reservationData.date}`,
        [
          {
            text: "View Results",
            onPress: () => {
              // Navigate to search results
              // router.push('/search-results');
            }
          }
        ]
      );
    }, 2000);
  };

  const handleGoBack = () => {
    router.back();
  };

  const swapCities = () => {
    const temp = reservationData.from;
    updateReservationData("from", reservationData.to);
    updateReservationData("to", temp);
  };

  const InputField = ({ 
    label, 
    placeholder, 
    value, 
    onChangeText, 
    icon,
    onPress,
    editable = true,
    rightIcon,
    onRightIconPress
  }: any) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={{
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
      }}>
        {label}
      </Text>
      <TouchableOpacity
        onPress={onPress}
        disabled={editable}
        activeOpacity={editable ? 1 : 0.8}
      >
        <View style={{
          backgroundColor: "#f9fafb",
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderWidth: 1,
          borderColor: value ? "#667eea" : "#e5e7eb",
        }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name={icon}
              size={20}
              color={value ? "#667eea" : "#9ca3af"}
              style={{ marginRight: 12 }}
            />
            <TextInput
              style={{
                flex: 1,
                fontSize: 16,
                color: "#1f2937",
              }}
              placeholder={placeholder}
              placeholderTextColor="#9ca3af"
              value={value}
              onChangeText={onChangeText}
              editable={editable}
              autoCapitalize="words"
            />
            {rightIcon && (
              <TouchableOpacity onPress={onRightIconPress} style={{ padding: 4 }}>
                <Ionicons
                  name={rightIcon}
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const CalendarModal = () => {
    const calendarDays = generateCalendarDays();
    
    return (
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <View style={{
            backgroundColor: "white",
            borderRadius: 24,
            padding: 24,
            width: width - 40,
            maxHeight: height * 0.6,
          }}>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#1f2937",
              }}>
                Select Date
              </Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}>
                {calendarDays.map((date, index) => {
                  const isSelected = date.toDateString() === selectedDate.toDateString();
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleDateSelect(date)}
                      style={{
                        width: "13%",
                        aspectRatio: 1,
                        marginBottom: 8,
                        borderRadius: 12,
                        backgroundColor: isSelected ? "#667eea" : isToday ? "rgba(102, 126, 234, 0.1)" : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{
                        fontSize: 12,
                        fontWeight: isSelected || isToday ? "700" : "500",
                        color: isSelected ? "white" : isToday ? "#667eea" : "#374151",
                      }}>
                        {date.getDate()}
                      </Text>
                      <Text style={{
                        fontSize: 10,
                        color: isSelected ? "rgba(255,255,255,0.8)" : "#9ca3af",
                      }}>
                        {date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const ServiceDropdown = () => (
    <Modal
      visible={showServiceDropdown}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowServiceDropdown(false)}
    >
      <View style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <View style={{
          backgroundColor: "white",
          borderRadius: 24,
          padding: 24,
          width: width - 40,
          maxHeight: height * 0.5,
        }}>
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1f2937",
            }}>
              Select Service Type
            </Text>
            <TouchableOpacity onPress={() => setShowServiceDropdown(false)}>
              <Ionicons name="close-circle-outline" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          {serviceTypes.map((service, index) => (
            <TouchableOpacity
              key={service.id}
              onPress={() => handleServiceSelect(service)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                borderRadius: 16,
                backgroundColor: reservationData.service?.id === service.id ? "rgba(102, 126, 234, 0.1)" : "transparent",
                marginBottom: 8,
              }}
            >
              <View style={{
                backgroundColor: reservationData.service?.id === service.id ? "#667eea" : "rgba(102, 126, 234, 0.1)",
                borderRadius: 12,
                padding: 10,
                marginRight: 16,
              }}>
                <Ionicons
                  name={service.icon as any}
                  size={20}
                  color={reservationData.service?.id === service.id ? "white" : "#667eea"}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: 2,
                }}>
                  {service.label} ({service.code})
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: "#6b7280",
                }}>
                  {service.description}
                </Text>
              </View>
              {reservationData.service?.id === service.id && (
                <Ionicons name="checkmark-circle" size={24} color="#667eea" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={["#a8edea", "#fed6e3"]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight || 0 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                padding: 20,
                paddingTop: 20,
              }}
              showsVerticalScrollIndicator={false}
              bounces={true}
              keyboardShouldPersistTaps="handled"
            >
              {/* Header */}
              <Animated.View
                style={{
                  transform: [{ scale: headerScale }],
                  opacity: headerOpacity,
                  marginBottom: 30,
                }}
              >
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                }}>
                  <TouchableOpacity
                    onPress={handleGoBack}
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
                      Seat Reservation
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: "#6b7280",
                      marginTop: 4,
                    }}>
                      Find and book your perfect journey
                    </Text>
                  </View>
                </View>
              </Animated.View>

              {/* Reservation Form */}
              <Animated.View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: 32,
                  padding: 28,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.15,
                  shadowRadius: 20,
                  elevation: 10,
                  transform: [{ translateY: cardSlide }],
                  opacity: cardOpacity,
                }}
              >
                <Animated.View style={{ opacity: formOpacity }}>
                  
                  {/* Date Selection */}
                  <InputField
                    label="Travel Date"
                    placeholder="Select your travel date"
                    value={reservationData.date}
                    icon="calendar-outline"
                    editable={false}
                    onPress={() => setShowCalendar(true)}
                  />

                  {/* From City */}
                  <InputField
                    label="From"
                    placeholder="Enter departure city"
                    value={reservationData.from}
                    onChangeText={(text: string) => updateReservationData("from", text)}
                    icon="location-outline"
                  />

                  {/* Swap Cities Button */}
                  <View style={{ alignItems: "center", marginVertical: -10, zIndex: 1 }}>
                    <TouchableOpacity
                      onPress={swapCities}
                      style={{
                        backgroundColor: "#667eea",
                        borderRadius: 20,
                        padding: 10,
                        shadowColor: "#667eea",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="swap-vertical" size={20} color="white" />
                    </TouchableOpacity>
                  </View>

                  {/* To City */}
                  <InputField
                    label="To"
                    placeholder="Enter destination city"
                    value={reservationData.to}
                    onChangeText={(text: string) => updateReservationData("to", text)}
                    icon="flag-outline"
                  />

                  {/* Service Type */}
                  <InputField
                    label="Service Type"
                    placeholder="Select service type"
                    value={reservationData.service ? `${reservationData.service.label} (${reservationData.service.code})` : ""}
                    icon="bus-outline"
                    editable={false}
                    onPress={() => setShowServiceDropdown(true)}
                    rightIcon="chevron-down-outline"
                  />

                  {/* Number of Seats */}
                  <View style={{ marginBottom: 30 }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: 8,
                    }}>
                      Number of Seats
                    </Text>
                    <View style={{
                      backgroundColor: "#f9fafb",
                      borderRadius: 16,
                      paddingHorizontal: 16,
                      paddingVertical: 16,
                      borderWidth: 1,
                      borderColor: reservationData.numberOfSeats ? "#667eea" : "#e5e7eb",
                    }}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons
                          name="people-outline"
                          size={20}
                          color={reservationData.numberOfSeats ? "#667eea" : "#9ca3af"}
                          style={{ marginRight: 12 }}
                        />
                        <TextInput
                          style={{
                            flex: 1,
                            fontSize: 16,
                            color: "#1f2937",
                          }}
                          placeholder="Enter number of seats (1-10)"
                          placeholderTextColor="#9ca3af"
                          value={reservationData.numberOfSeats}
                          onChangeText={(text) => updateReservationData("numberOfSeats", text)}
                          keyboardType="number-pad"
                          maxLength={2}
                        />
                      </View>
                    </View>
                  </View>

                </Animated.View>

                {/* Search Button */}
                <TouchableOpacity
                  style={{
                    borderRadius: 20,
                    shadowColor: "#4facfe",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                    opacity: isLoading ? 0.7 : 1,
                  }}
                  activeOpacity={0.8}
                  onPress={handleSearch}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={['#4facfe', '#00f2fe']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 18,
                      paddingHorizontal: 24,
                      borderRadius: 20,
                    }}
                  >
                    {isLoading ? (
                      <>
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderWidth: 2,
                            borderColor: "white",
                            borderTopColor: "transparent",
                            borderRadius: 10,
                            marginRight: 12,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 17,
                            fontWeight: "700",
                            color: "white",
                            letterSpacing: 0.5,
                          }}
                        >
                          Searching...
                        </Text>
                      </>
                    ) : (
                      <>
                        <Ionicons
                          name="search-outline"
                          size={24}
                          color="white"
                          style={{ marginRight: 12 }}
                        />
                        <Text
                          style={{
                            fontSize: 17,
                            fontWeight: "700",
                            color: "white",
                            letterSpacing: 0.5,
                          }}
                        >
                          Search Buses
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Bottom spacing */}
              <View style={{ height: 60 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>

        {/* Modals */}
        <CalendarModal />
        <ServiceDropdown />
      </LinearGradient>
    </>
  );
}