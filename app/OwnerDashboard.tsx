import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

type DashboardAction = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  gradientColors: string[];
  route: string;
};

export default function OwnerDashboard() {
  const router = useRouter();
  const [userName] = useState("Owner"); // This would come from user context/state
  const [greeting, setGreeting] = useState("");

  // Animation refs
  const headerScale = useRef(new Animated.Value(0.8)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(100)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

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
  }, []);

  const dashboardActions: DashboardAction[] = [
    {
      id: "1",
      title: "Track Buses",
      subtitle: "Monitor bus locations in real-time",
      icon: "time-outline",
      gradientColors: ["#ea669bff", "#764ba2"],
      route: "/BusOwnerViewBus",
    },
    {
      id: "2",
      title: "Add Buses & Routes",
      subtitle: "Expand your fleet easily",
      icon: "location-outline",
      gradientColors: ["#f093fb", "#f5576c"],
      route: "/OwnerAddBus",
    },
    
    {
      id: "3",
      title: "Edit Buses & Routes",
      subtitle: "Customize your bus details",
      icon: "location-outline",
      gradientColors: ["#f093fb", "#f5576c"],
      route: "/BusOwnerEditBus",
    },
  ];

  const handleActionPress = (action: DashboardAction) => {
    console.log(`${action.title} pressed`);
    // Navigate to respective screen
    router.push(action.route as any);
  };

  const handleProfile = () => {
    console.log("Profile pressed");
    router.push('/BusOwnerProfileEditor');
  };

  const handleNotifications = () => {
    console.log("Notifications pressed");
    // router.push('/notifications');
  };

  const handleLogout = () => {
    console.log("Logout pressed");
    // Handle logout logic
    router.replace('/signin');
  };

  const ActionCard = ({ action, index }: { action: DashboardAction; index: number }) => {
    const slideAnim = useRef(new Animated.Value(50)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          delay: 600 + (index * 150),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          delay: 600 + (index * 150),
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          opacity: opacityAnim,
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleActionPress(action)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{
            borderRadius: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <LinearGradient
            colors={["#a8edea", "#fed6e3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24,
              padding: 24,
              minHeight: 120,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 16,
                  padding: 12,
                  marginRight: 16,
                }}
              >
                <Ionicons
                  name={action.icon as any}
                  size={28}
                  color="white"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "white",
                    marginBottom: 4,
                    letterSpacing: 0.3,
                  }}
                >
                  {action.title}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 1)",
                    lineHeight: 20,
                  }}
                >
                  {action.subtitle}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderRadius: 12,
                  padding: 8,
                }}
              >
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="rgba(255, 255, 255, 0.8)"
                />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={["#a8edea", "#fed6e3"]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight || 0 }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              padding: 20,
              paddingTop: 40,
            }}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {/* Header Section */}
            <Animated.View
              style={{
                transform: [{ scale: headerScale }],
                opacity: headerOpacity,
                marginBottom: 30,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                {/* Logo and Greeting */}
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
                    <MaterialCommunityIcons name="bus" size={24} color="#667eea" />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: "#6b7280",
                        fontWeight: "500",
                      }}
                    >
                      {greeting},
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "800",
                        color: "#1f2937",
                        letterSpacing: -0.3,
                      }}
                    >
                      {userName}!
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={handleNotifications}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      borderRadius: 16,
                      padding: 12,
                      marginRight: 12,
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="notifications-outline" size={20} color="#374151" />
                    {/* Notification Badge */}
                    <View
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        width: 8,
                        height: 8,
                        backgroundColor: "#ef4444",
                        borderRadius: 4,
                      }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleProfile}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      borderRadius: 16,
                      padding: 12,
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="person-outline" size={20} color="#374151" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Welcome Card */}
              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: 20,
                  padding: 20,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#1f2937",
                        marginBottom: 4,
                      }}
                    >
                      Ready for your journey?
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#6b7280",
                        lineHeight: 20,
                      }}
                    >
                      Choose from the options below to get started
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "rgba(102, 126, 234, 0.1)",
                      borderRadius: 16,
                      padding: 12,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="bus-side"
                      size={28}
                      color="#667eea"
                    />
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Dashboard Actions */}
            <Animated.View
              style={{
                transform: [{ translateY: cardSlide }],
                opacity: cardOpacity,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#1f2937",
                  marginBottom: 20,
                  letterSpacing: -0.3,
                }}
              >
                Quick Actions
              </Text>

              {dashboardActions.map((action, index) => (
                <ActionCard key={action.id} action={action} index={index} />
              ))}
            </Animated.View>

            {/* Footer Section */}
            <Animated.View
              style={{
                opacity: cardOpacity,
                marginTop: 20,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 20,
                  width: "100%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: "#10b981",
                      borderRadius: 4,
                      marginRight: 8,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#374151",
                      fontWeight: "500",
                    }}
                  >
                    All Services Active
                  </Text>
                </View>
              </View>

              {/* Logout Button */}
              <TouchableOpacity
                onPress={handleLogout}
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color="#ef4444"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ef4444",
                  }}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Bottom spacing */}
            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
