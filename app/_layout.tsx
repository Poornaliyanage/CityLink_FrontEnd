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
      <Stack.Screen name="Available_Bus" />
      <Stack.Screen name="PassengerProfileEditor" />
      <Stack.Screen name="RealTimeTrackingMap" />
      <Stack.Screen name="BusTimeTable" />
      <Stack.Screen name="BusOwnerViewBus" />
      <Stack.Screen name="OwnerDashboard" />
      <Stack.Screen name="OwnerBusTracking" />
      <Stack.Screen name="BusOwnerProfileEditor" />
      <Stack.Screen name="BusOwnerEditBus" />
      <Stack.Screen name="AdminDashboard" />
      <Stack.Screen name="AdminManageBuses" />
      <Stack.Screen name="AdminManageBusNavigate" />
      <Stack.Screen name="AdminManageTimetable" />
      <Stack.Screen name="AdminManageUsers" />
    </Stack>
  );
}
