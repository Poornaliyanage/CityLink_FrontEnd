import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
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

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation refs
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(100)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.8)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

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

    // Form animation
    setTimeout(() => {
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 600);

    // Button animation
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(buttonScale, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 900);
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://172.20.10.6:5000/api/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(), 
          password: password 
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Store token and user data (you'll need to install async-storage)
        // await AsyncStorage.setItem('token', data.token);
        // await AsyncStorage.setItem('user', JSON.stringify(data.user));
        
        console.log("Login successful:", data.user);
        Alert.alert("Success", data.message);
        
        setTimeout(() => {
          switch(data.user.role) {
              case 'Passenger':
                router.replace('/PassengerDashboard');
                break;
              case 'Conductor':
                router.replace('/ConductorDashboard');
                break;
              case 'Bus Owner':
                router.replace('/OwnerDashboard');
                break;
              case 'Admin':
                router.replace('/AdminDashboard');
                break;
              default:
                router.replace('/signin');
            }
        }, 1000);
        // Navigate to home/dashboard based on user role
        // router.push('/home');
        // or based on role: router.push(`/${data.user.role.toLowerCase()}-dashboard`);
        
      } else {
        Alert.alert("Error", data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        "Connection Error", 
        "Unable to connect to the server. Please check your internet connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleForgotPassword = () => {
    console.log("Forgot password pressed");
    // Navigate to forgot password screen
    // router.push('/forgot-password');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleCreateAccount = () => {
    console.log("Create account pressed");
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
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
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
              keyboardShouldPersistTaps="handled"
            >
              {/* Back Button */}
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: 20,
                  padding: 12,
                  zIndex: 10,
                }}
                onPress={handleGoBack}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={24} color="#374151" />
              </TouchableOpacity>

              {/* Logo Section */}
              <Animated.View
                style={{
                  marginBottom: 30,
                  alignItems: "center",
                  transform: [{ scale: logoScale }],
                  opacity: logoOpacity,
                }}
              >
                <View style={{ position: "relative" }}>
                  <View
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      backgroundColor: "white",
                      borderWidth: 3,
                      borderColor: "rgba(255,255,255,0.3)",
                      alignItems: "center",
                      justifyContent: "center",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 5,
                    }}
                  >
                    <MaterialCommunityIcons name="bus" size={40} color="#667eea" />
                  </View>
                </View>
              </Animated.View>

              {/* Sign In Card */}
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
                {/* Header */}
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
                    Welcome Back
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#6b7280",
                      textAlign: "center",
                      lineHeight: 24,
                    }}
                  >
                    Sign in to continue your journey
                  </Text>
                </View>

                {/* Form */}
                <Animated.View style={{ opacity: formOpacity }}>
                  {/* Email Input */}
                  <View style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: 8,
                      }}
                    >
                      Email Address
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#f9fafb",
                        borderRadius: 16,
                        paddingHorizontal: 16,
                        paddingVertical: 16,
                        borderWidth: 1,
                        borderColor: email ? "#667eea" : "#e5e7eb",
                      }}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons
                          name="mail-outline"
                          size={20}
                          color={email ? "#667eea" : "#9ca3af"}
                          style={{ marginRight: 12 }}
                        />
                        <TextInput
                          style={{
                            flex: 1,
                            fontSize: 16,
                            color: "#1f2937",
                          }}
                          placeholder="Enter your email"
                          placeholderTextColor="#9ca3af"
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Password Input */}
                  <View style={{ marginBottom: 24 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: 8,
                      }}
                    >
                      Password
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#f9fafb",
                        borderRadius: 16,
                        paddingHorizontal: 16,
                        paddingVertical: 16,
                        borderWidth: 1,
                        borderColor: password ? "#667eea" : "#e5e7eb",
                      }}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons
                          name="lock-closed-outline"
                          size={20}
                          color={password ? "#667eea" : "#9ca3af"}
                          style={{ marginRight: 12 }}
                        />
                        <TextInput
                          style={{
                            flex: 1,
                            fontSize: 16,
                            color: "#1f2937",
                          }}
                          placeholder="Enter your password"
                          placeholderTextColor="#9ca3af"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry={!isPasswordVisible}
                        />
                        <TouchableOpacity
                          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                          style={{ padding: 4 }}
                        >
                          <Ionicons
                            name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#9ca3af"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* Forgot Password */}
                  <TouchableOpacity
                    onPress={handleForgotPassword}
                    style={{ alignSelf: "flex-end", marginBottom: 24 }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#667eea",
                        fontWeight: "600",
                      }}
                    >
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </Animated.View>

                {/* Sign In Button */}
                <Animated.View
                  style={{
                    marginBottom: 24,
                    transform: [{ scale: buttonScale }],
                    opacity: buttonOpacity,
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
                      opacity: isLoading ? 0.7 : 1,
                    }}
                    activeOpacity={0.8}
                    onPress={handleSignIn}
                    disabled={isLoading}
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
                            Signing In...
                          </Text>
                        </>
                      ) : (
                        <>
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
                            Sign In
                          </Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>

                {/* Divider */}
                <View
                  style={{
                    height: 1,
                    backgroundColor: "rgba(107, 114, 128, 0.2)",
                    marginVertical: 24,
                  }}
                />

                {/* Create Account Link */}
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#6b7280",
                      textAlign: "center",
                    }}
                  >
                    Don't have an account?{" "}
                    <Text
                      style={{
                        color: "#667eea",
                        fontWeight: "600",
                      }}
                      onPress={handleCreateAccount}
                    >
                      Create Account
                    </Text>
                  </Text>
                </View>
              </Animated.View>

              {/* Bottom spacing */}
              <View style={{ height: 60 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}