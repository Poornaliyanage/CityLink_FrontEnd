import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
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

export default function Index() {
  const router = useRouter();
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(100)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale1 = useRef(new Animated.Value(0.8)).current;
  const buttonScale2 = useRef(new Animated.Value(0.8)).current;
  const buttonOpacity1 = useRef(new Animated.Value(0)).current;
  const buttonOpacity2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animation
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
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

    // Button animations with delays
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(buttonScale1, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity1, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 800);

    setTimeout(() => {
      Animated.parallel([
        Animated.spring(buttonScale2, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity2, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1000);
  }, []);

  const handleLogin = () => {
    console.log("Login pressed");
    // Navigate to login screen
    router.push('/ConductorDashboard');
  };

  const handleRegister = () => {
    console.log("Register pressed");
    // Navigate to register screen
    router.push('/register');
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
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              paddingVertical: 40,
            }}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {/* Logo Section */}
            <Animated.View
              style={{
                marginBottom: 40,
                alignItems: "center",
                transform: [{ scale: logoScale }],
                opacity: logoOpacity,
              }}
            >
              <View style={{ position: "relative" }}>
                <Animated.Image
                  source={require("@/assets/images/CityLinkLogo.png")}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    borderWidth: 4,
                    borderColor: "rgba(255,255,255,0.3)",
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    right: 8,
                    bottom: 8,
                    borderRadius: 56,
                    backgroundColor: "rgba(0,0,0,0.1)",
                    zIndex: -1,
                  }}
                />
              </View>
            </Animated.View>

            {/* Welcome Card */}
            <Animated.View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: 32,
                padding: 28,
                width: width - 32,
                maxWidth: 400,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
                elevation: 10,
                transform: [{ translateY: cardSlide }],
                opacity: cardOpacity,
              }}
            >
              {/* Header Section */}
              <View style={{ alignItems: "center", marginBottom: 32 }}>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "800",
                    color: "#1f2937",
                    textAlign: "center",
                    marginBottom: 8,
                    letterSpacing: -0.5,
                  }}
                >
                  Welcome to CityLink
                </Text>
                
                <View
                  style={{
                    backgroundColor: "rgba(102, 126, 234, 0.1)",
                    padding: 12,
                    borderRadius: 20,
                    marginBottom: 16,
                  }}
                >
                  <MaterialCommunityIcons name="bus" size={32} color="#667eea" />
                </View>
                
                <Text
                  style={{
                    fontSize: 16,
                    color: "#6b7280",
                    textAlign: "center",
                    lineHeight: 24,
                    fontWeight: "400",
                  }}
                >
                  Your smart companion for seamless city transportation. Book, track, and manage your journeys with ease.
                </Text>
              </View>

              {/* Login Button */}
              <Animated.View
                style={{
                  marginBottom: 16,
                  transform: [{ scale: buttonScale1 }],
                  opacity: buttonOpacity1,
                }}
              >
                <TouchableOpacity
                  style={{
                    borderRadius: 20,
                    shadowColor: "#667eea",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                  activeOpacity={0.8}
                  onPress={handleLogin}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
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
                    <Ionicons
                      name="log-in-outline"
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
                      Login
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Register Button */}
              <Animated.View
                style={{
                  marginBottom: 24,
                  transform: [{ scale: buttonScale2 }],
                  opacity: buttonOpacity2,
                }}
              >
                <TouchableOpacity
                  style={{
                    borderRadius: 20,
                    shadowColor: "#11998e",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                  activeOpacity={0.8}
                  onPress={handleRegister}
                >
                  <LinearGradient
                    colors={['#11998e', '#38ef7d']}
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
                    <Ionicons
                      name="person-add-outline"
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
                      Create Account
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Footer */}
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#6b7280",
                    textAlign: "center",
                  }}
                >
                  Secure • Fast • Reliable
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 8,
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
                      fontSize: 12,
                      color: "#9ca3af",
                    }}
                  >
                    Service Available
                  </Text>
                </View>
              </View>
            </Animated.View>

            {/* Bottom spacing for scroll */}
            <View style={{ height: 60 }} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}