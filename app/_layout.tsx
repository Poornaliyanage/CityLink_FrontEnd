import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="register" />
      <Stack.Screen name="PassengerDashboard" />
      <Stack.Screen name="ConductorDashboard" />
      <Stack.Screen name="SeatReservation" />
      <Stack.Screen name="ScanQR" />
      <Stack.Screen name="TimeTablePassenger" />
    </Stack>
  );
}
