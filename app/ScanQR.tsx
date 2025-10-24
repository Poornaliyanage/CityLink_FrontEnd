import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera, CameraView } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BASE_URL } from "../config"; //import the base url from config file

const { width, height } = Dimensions.get("window");

type QRData = {
  passengerName: string;
  seatNumber: string;
  busNumber: string;
  route: string;
  date: string;
  bookingId: string;
};

export default function ScanQR() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Animation refs
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.8)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const cornerAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    getCameraPermissions();
  }, []);

  useEffect(() => {
    // Scanning line animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Corner animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(cornerAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(cornerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

 const handleBarCodeScanned = async ({ data }: { type: string; data: string }) => {
  if (scanned) return;

  setScanned(true);

  try {
    // QR format: bookingId_userId
    const [bookingId, userId] = data.split("_");

    if (!bookingId || !userId) throw new Error("Invalid QR format");

    const token = await AsyncStorage.getItem("token");

    fetch(`${BASE_URL}/api/bookings/detail/${bookingId}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

      .then((res) => res.json())
      .then((json) => {
        if (!json || !json.booking_id) {
          Alert.alert("Booking not found");
          setScanned(false);
          return;
        }

        // fill modal data using the correct nested structure
        setQrData({
          passengerName: json.passenger.name,
          seatNumber: json.seat_number,
          busNumber: json.bus.registration_number,
          route: `${json.route.name} (${json.route.number})`,
          date: json.travel_date,
          bookingId: json.booking_id.toString(),
        });

        // show modal
        setShowModal(true);
        Animated.parallel([
          Animated.spring(modalScale, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(modalOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      })
      .catch((err) => {
        Alert.alert("Failed to fetch booking", err.message);
        setScanned(false);
      });
  } catch (error) {
    Alert.alert("Invalid QR Code", "The scanned QR code is not valid.");
    setScanned(false);
  }
};




  const handleConfirm = async () => {
    if (!qrData?.bookingId) {
      Alert.alert("Error", "No booking selected.");
      return;
    }

    setConfirming(true);

    try {
      const token = await AsyncStorage.getItem("token"); // ensure AsyncStorage imported

      // call the new endpoint
      const res = await fetch(
        `${BASE_URL}/api/bookings/${encodeURIComponent(qrData.bookingId)}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Complete booking error:", res.status, json);
        throw new Error(json.message || `Server returned ${res.status}`);
      }

      // success
      Alert.alert("Success", "Booking marked as Completed.");
      closeModal();
    } catch (err: any) {
      console.error("handleConfirm error:", err);
      Alert.alert("Error", err.message || "Failed to update booking status.");
      // keep modal open so conductor can retry or cancel
    } finally {
      setConfirming(false);
    }
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowModal(false);
      setScanned(false);
      setQrData(null);
      modalScale.setValue(0.8);
      modalOpacity.setValue(0);
    });
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera" size={64} color="#6b7280" />
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity
          onPress={getCameraPermissions}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const scanLineTranslate = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250],
  });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={["rgba(0,0,0,0.8)", "transparent"]}
          style={styles.header}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan QR Code</Text>
          <TouchableOpacity
            onPress={toggleFlash}
            style={styles.flashButton}
            activeOpacity={0.8}
          >
            <Ionicons
              name={flashEnabled ? "flash" : "flash-off"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </LinearGradient>

        {/* Camera */}
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        >
          {/* Overlay */}
          <View style={styles.overlay}>
            {/* Top overlay */}
            <View style={styles.overlayTop} />
            
            <View style={styles.overlayMiddle}>
              {/* Left overlay */}
              <View style={styles.overlaySide} />
              
              {/* Scan area */}
              <View style={styles.scanArea}>
                {/* Animated corners */}
                <Animated.View
                  style={[
                    styles.corner,
                    styles.cornerTopLeft,
                    { transform: [{ scale: cornerAnim }] },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.corner,
                    styles.cornerTopRight,
                    { transform: [{ scale: cornerAnim }] },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.corner,
                    styles.cornerBottomLeft,
                    { transform: [{ scale: cornerAnim }] },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.corner,
                    styles.cornerBottomRight,
                    { transform: [{ scale: cornerAnim }] },
                  ]}
                />

                {/* Scanning line */}
                <Animated.View
                  style={[
                    styles.scanLine,
                    {
                      transform: [{ translateY: scanLineTranslate }],
                    },
                  ]}
                />
              </View>
              
              {/* Right overlay */}
              <View style={styles.overlaySide} />
            </View>
            
            {/* Bottom overlay */}
            <View style={styles.overlayBottom}>
              <View style={styles.instructionContainer}>
                <MaterialCommunityIcons
                  name="qrcode-scan"
                  size={32}
                  color="white"
                />
                <Text style={styles.instructionText}>
                  Position the QR code within the frame
                </Text>
              </View>
            </View>
          </View>
        </CameraView>

        {/* QR Data Modal */}
        <Modal
          visible={showModal}
          transparent
          animationType="none"
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ scale: modalScale }],
                  opacity: modalOpacity,
                },
              ]}
            >
              <LinearGradient
                colors={["#a8edea", "#fed6e3"]}
                style={styles.modalGradient}
              >
                {/* Success Icon */}
                <View style={styles.successIconContainer}>
                  <View style={styles.successIcon}>
                    <Ionicons name="checkmark-circle" size={64} color="#10b981" />
                  </View>
                </View>

                {/* Title */}
                <Text style={styles.modalTitle}>Reservation Details</Text>

                {/* QR Data */}
                {qrData && (
                  <View style={styles.dataContainer}>
                    <DataRow
                      icon="person"
                      label="Passenger"
                      value={qrData.passengerName}
                    />
                    <DataRow
                      icon="car-seat"
                      label="Seat Number"
                      value={qrData.seatNumber}
                    />
                    <DataRow
                      icon="bus"
                      label="Bus Number"
                      value={qrData.busNumber}
                    />
                    <DataRow
                      icon="map"
                      label="Route"
                      value={qrData.route}
                    />
                    <DataRow
                      icon="calendar"
                      label="Date"
                      value={qrData.date}
                    />
                    <DataRow
                      icon="receipt"
                      label="Booking ID"
                      value={qrData.bookingId}
                    />
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
               <TouchableOpacity
                  onPress={handleConfirm}
                  style={styles.confirmButton}
                  activeOpacity={0.8}
                  disabled={confirming}
                >
                  {confirming ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  )}
                </TouchableOpacity>

                  
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.cancelButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelButtonText}>Scan Again</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const DataRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View style={styles.dataRow}>
    <View style={styles.dataIconContainer}>
      <MaterialCommunityIcons name={icon as any} size={20} color="#667eea" />
    </View>
    <View style={styles.dataContent}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 16,
    textAlign: "center",
  },
  permissionButton: {
    backgroundColor: "#667eea",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  flashButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 8,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  overlayMiddle: {
    flexDirection: "row",
    height: 280,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  scanArea: {
    width: 280,
    height: 280,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#10b981",
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#10b981",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  instructionContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  instructionText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    overflow: "hidden",
  },
  modalGradient: {
    padding: 24,
  },
  successIconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  successIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 40,
    padding: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 24,
  },
  dataContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(107, 114, 128, 0.1)",
  },
  dataIconContainer: {
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    borderRadius: 10,
    padding: 8,
    marginRight: 12,
  },
  dataContent: {
    flex: 1,
  },
  dataLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 2,
  },
  dataValue: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "600",
  },
  buttonContainer: {
    gap: 12,
  },
  confirmButton: {
    backgroundColor: "#10b981",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#667eea",
    fontSize: 16,
    fontWeight: "700",
  },
});