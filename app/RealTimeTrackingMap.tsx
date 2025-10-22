import * as Location from 'expo-location';
import { useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';

const INITIAL_REGION = {
  latitude: 7.8731,      // Sri Lanka's central latitude
  longitude: 80.7718,    // Sri Lanka's central longitude
  latitudeDelta: 3.5,    // Zoom level (covers whole island)
  longitudeDelta: 3.5,
};

export default function RealTimeTrackingMap() {
  const mapRef = useRef<MapView | null>(null);
  const navigation = useNavigation();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  // Request location permission and get current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location access in settings.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation);

      // Focus map on user’s location once available
      if (mapRef.current && currentLocation) {
        const region: Region = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        mapRef.current.animateToRegion(region, 1000);
      }
    })();
  }, []);

  // Focus button: refocus map on current location
  const focusOnUser = async () => {
    if (!location) {
      Alert.alert('Location not available', 'Please wait until your location is detected.');
      return;
    }

    const region: Region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    mapRef.current?.animateToRegion(region, 1000);
  };

  // Back button
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation={true}
        followsUserLocation={true}
      />

      {/* Floating Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.focusButton} onPress={focusOnUser}>
          <Text style={styles.buttonText}>Focus</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 10,
  },
  focusButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 4,
  },
  backButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
