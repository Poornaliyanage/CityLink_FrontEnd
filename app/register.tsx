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

type UserRole = "Passenger" | "Conductor" | "Bus Owner" | null;

interface FormData {
  firstName: string;
  lastName: string;
  nicPassport: string;
  contactNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

// Move InputField OUTSIDE the Register component
const InputField = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  icon, 
  keyboardType = "default",
  secureTextEntry = false,
  showPasswordToggle = false,
  passwordVisible = false,
  onTogglePassword = () => {}
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
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
          autoCorrect={false}
          secureTextEntry={secureTextEntry}
        />
        {showPasswordToggle && (
          <TouchableOpacity onPress={onTogglePassword} style={{ padding: 4 }}>
            <Ionicons
              name={passwordVisible ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#9ca3af"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  </View>
);

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    nicPassport: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: null,
  });

  // Animation refs
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(100)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;

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
  }, []);

  const updateFormData = (field: keyof FormData, value: string | UserRole) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      Alert.alert("Error", "Please enter your first name");
      return false;
    }
    if (!formData.lastName.trim()) {
      Alert.alert("Error", "Please enter your last name");
      return false;
    }
    if (!formData.nicPassport.trim()) {
      Alert.alert("Error", "Please enter your NIC or Passport number");
      return false;
    }
    if (!formData.contactNumber.trim()) {
      Alert.alert("Error", "Please enter your contact number");
      return false;
    }
    if (!formData.password) {
      Alert.alert("Error", "Please enter a password");
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    if (!formData.role) {
      Alert.alert("Error", "Please select your role");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await fetch("http://172.20.10.5:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          nicPassport: formData.nicPassport,
          contactNumber: formData.contactNumber,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        Alert.alert(
          "Success",
          `Welcome to CityLink, ${formData.firstName}! Your ${formData.role} account has been created.`,
          [{ text: "Continue", onPress: () => router.push("/signin") }]
        );
      } else {
        Alert.alert("Error", data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      Alert.alert("Error", "Unable to connect to the server");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleSignIn = () => {
    console.log("Navigate to sign in");
    router.push('/signin');
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "Passenger":
        return "person-outline";
      case "Conductor":
        return "checkmark-circle-outline";
      case "Bus Owner":
        return "business-outline";
      default:
        return "help-circle-outline";
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "Passenger":
        return "#3b82f6";
      case "Conductor":
        return "#10b981";
      case "Bus Owner":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const RoleSelector = () => {
    const roles: UserRole[] = ["Passenger", "Conductor", "Bus Owner"];
    
    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={{
          fontSize: 14,
          fontWeight: "600",
          color: "#374151",
          marginBottom: 12,
        }}>
          Select Your Role
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role}
              onPress={() => updateFormData("role", role)}
              activeOpacity={0.7}
              style={{
                flex: 1,
                marginHorizontal: 4,
                backgroundColor: formData.role === role ? getRoleColor(role) : "#f9fafb",
                borderRadius: 12,
                padding: 12,
                alignItems: "center",
                borderWidth: 2,
                borderColor: formData.role === role ? getRoleColor(role) : "#e5e7eb",
              }}
            >
              <Ionicons
                name={getRoleIcon(role) as any}
                size={20}
                color={formData.role === role ? "white" : getRoleColor(role)}
                style={{ marginBottom: 4 }}
              />
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: formData.role === role ? "white" : "#374151",
                  textAlign: "center",
                }}
              >
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                alignItems: "center",
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
                      width: 80,
                      height: 80,
                      borderRadius: 40,
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
                    <MaterialCommunityIcons name="bus" size={32} color="#667eea" />
                  </View>
                </View>
              </Animated.View>

              {/* Register Card */}
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
                    Create Account
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#6b7280",
                      textAlign: "center",
                      lineHeight: 24,
                    }}
                  >
                    Join CityLink community today
                  </Text>
                </View>

                {/* Form */}
                <Animated.View style={{ opacity: formOpacity }}>
                  
                  {/* Role Selection */}
                  <RoleSelector />

                  {/* Name Fields Row */}
                  <View style={{ flexDirection: "row", marginBottom: 20 }}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: 8,
                      }}>
                        First Name
                      </Text>
                      <View style={{
                        backgroundColor: "#f9fafb",
                        borderRadius: 16,
                        paddingHorizontal: 16,
                        paddingVertical: 16,
                        borderWidth: 1,
                        borderColor: formData.firstName ? "#667eea" : "#e5e7eb",
                      }}>
                        <TextInput
                          style={{
                            fontSize: 16,
                            color: "#1f2937",
                          }}
                          placeholder="First Name"
                          placeholderTextColor="#9ca3af"
                          value={formData.firstName}
                          onChangeText={(text) => updateFormData("firstName", text)}
                          autoCapitalize="words"
                        />
                      </View>
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: 8,
                      }}>
                        Last Name
                      </Text>
                      <View style={{
                        backgroundColor: "#f9fafb",
                        borderRadius: 16,
                        paddingHorizontal: 16,
                        paddingVertical: 16,
                        borderWidth: 1,
                        borderColor: formData.lastName ? "#667eea" : "#e5e7eb",
                      }}>
                        <TextInput
                          style={{
                            fontSize: 16,
                            color: "#1f2937",
                          }}
                          placeholder="Last Name"
                          placeholderTextColor="#9ca3af"
                          value={formData.lastName}
                          onChangeText={(text) => updateFormData("lastName", text)}
                          autoCapitalize="words"
                        />
                      </View>
                    </View>
                  </View>

                  <InputField
                    label="NIC / Passport Number"
                    placeholder="Enter your NIC or Passport number"
                    value={formData.nicPassport}
                    onChangeText={(text: string) => updateFormData("nicPassport", text)}
                    icon="card-outline"
                  />

                  <InputField
                    label="Contact Number"
                    placeholder="Enter your phone number"
                    value={formData.contactNumber}
                    onChangeText={(text: string) => updateFormData("contactNumber", text)}
                    icon="call-outline"
                    keyboardType="phone-pad"
                  />

                  <InputField
                    label="Email Address"
                    placeholder="Email Address"
                    value={formData.email}
                    onChangeText={(text: string) => updateFormData("email", text)}
                    icon="mail-outline"
                    keyboardType="email-address"
                  />

                  <InputField
                    label="Password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChangeText={(text: string) => updateFormData("password", text)}
                    icon="lock-closed-outline"
                    secureTextEntry={!isPasswordVisible}
                    showPasswordToggle={true}
                    passwordVisible={isPasswordVisible}
                    onTogglePassword={() => setIsPasswordVisible(!isPasswordVisible)}
                  />

                  <InputField
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChangeText={(text: string) => updateFormData("confirmPassword", text)}
                    icon="lock-closed-outline"
                    secureTextEntry={!isConfirmPasswordVisible}
                    showPasswordToggle={true}
                    passwordVisible={isConfirmPasswordVisible}
                    onTogglePassword={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  />

                </Animated.View>

                {/* Register Button */}
                <TouchableOpacity
                  style={{
                    borderRadius: 20,
                    shadowColor: "#11998e",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                    opacity: isLoading ? 0.7 : 1,
                    marginBottom: 24,
                  }}
                  activeOpacity={0.8}
                  onPress={handleRegister}
                  disabled={isLoading}
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
                          Creating Account...
                        </Text>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Sign In Link */}
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#6b7280",
                      textAlign: "center",
                    }}
                  >
                    Already have an account?{" "}
                    <Text
                      style={{
                        color: "#667eea",
                        fontWeight: "600",
                      }}
                      onPress={handleSignIn}
                    >
                      Sign In
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