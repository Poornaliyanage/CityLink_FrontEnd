import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
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

export default function BusOwnerProfileEditor() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    businessRegNo: "BRN-102934", // example static value
    contactNumber: "0771234567",
    emergencyContact: "0712345678",
    password: "",
    confirmPassword: "",
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.contactNumber.trim()) {
      Alert.alert("Error", "Please enter your contact number");
      return;
    }
    if (!formData.emergencyContact.trim()) {
      Alert.alert("Error", "Please enter your emergency contact number");
      return;
    }
    if (formData.password && formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert("Success", "Your buses have been updated successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }, 1500);
  };

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
    onTogglePassword = () => {},
    editable = true,
  }: any) => (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: "#374151",
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          backgroundColor: editable ? "#f9fafb" : "#f3f4f6",
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderWidth: 1,
          borderColor: value ? "#667eea" : "#e5e7eb",
        }}
      >
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
              color: editable ? "#1f2937" : "#9ca3af",
            }}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            editable={editable}
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

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={["#a8edea", "#fed6e3"]} style={{ flex: 1 }}>
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
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color="#374151" />
              </TouchableOpacity>

              {/* Header */}
              <View style={{ alignItems: "center", marginBottom: 30 }}>
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
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: "800",
                    color: "#1f2937",
                    marginTop: 16,
                  }}
                >
                  Edit Profile
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#6b7280",
                    textAlign: "center",
                    lineHeight: 24,
                  }}
                >
                  Update your business and contact details
                </Text>
              </View>

              {/* Form */}
              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: 32,
                  padding: 28,
                  width: "100%",
                  maxWidth: 400,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.15,
                  shadowRadius: 20,
                  elevation: 10,
                }}
              >
                {/* Non-editable field */}
                <InputField
                  label="Business Registration Number"
                  placeholder="BRN"
                  value={formData.businessRegNo}
                  icon="business-outline"
                  editable={false}
                />

                <InputField
                  label="Contact Number"
                  placeholder="Enter your phone number"
                  value={formData.contactNumber}
                  onChangeText={(text: string) =>
                    updateFormData("contactNumber", text)
                  }
                  icon="call-outline"
                  keyboardType="phone-pad"
                />

                <InputField
                  label="Emergency Contact Number"
                  placeholder="Enter emergency contact number"
                  value={formData.emergencyContact}
                  onChangeText={(text: string) =>
                    updateFormData("emergencyContact", text)
                  }
                  icon="call-outline"
                  keyboardType="phone-pad"
                />

                <InputField
                  label="New Password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChangeText={(text: string) => updateFormData("password", text)}
                  icon="lock-closed-outline"
                  secureTextEntry={!isPasswordVisible}
                  showPasswordToggle={true}
                  passwordVisible={isPasswordVisible}
                  onTogglePassword={() =>
                    setIsPasswordVisible(!isPasswordVisible)
                  }
                />

                <InputField
                  label="Confirm New Password"
                  placeholder="Re-enter new password"
                  value={formData.confirmPassword}
                  onChangeText={(text: string) =>
                    updateFormData("confirmPassword", text)
                  }
                  icon="lock-closed-outline"
                  secureTextEntry={!isConfirmPasswordVisible}
                  showPasswordToggle={true}
                  passwordVisible={isConfirmPasswordVisible}
                  onTogglePassword={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                />

                {/* Save Button */}
                <TouchableOpacity
                  style={{
                    borderRadius: 20,
                    shadowColor: "#11998e",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                    opacity: isSaving ? 0.7 : 1,
                    marginTop: 16,
                  }}
                  activeOpacity={0.8}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  <LinearGradient
                    colors={["#11998e", "#38ef7d"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 18,
                      borderRadius: 20,
                    }}
                  >
                    <Ionicons
                      name="save-outline"
                      size={22}
                      color="white"
                      style={{ marginRight: 10 }}
                    />
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "700",
                        color: "white",
                        letterSpacing: 0.5,
                      }}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View style={{ height: 80 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
