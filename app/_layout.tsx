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
      <Stack.Screen name="Seat_Select" />
      <Stack.Screen name="ConductorShowTimetable" />
      <Stack.Screen name="ConductorTimetable" />
      <Stack.Screen name="OwnerDashboard" />
      <Stack.Screen name="Available_Bus" />
    </Stack>
  );
}
