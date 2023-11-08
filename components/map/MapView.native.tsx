import { useASGet } from "@config/hooks/storage";
import React from "react";
import { StyleSheet } from "react-native";
import MapView from "react-native-maps";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

const defaultCenter = { lat: -34.397, lng: 150.644 };

function MapScreen() {
  const { storedValue: initialLocation } = useASGet("userLocation");
  console.log("initialLocation:", initialLocation);
  const center = initialLocation
    ? {
        lat: initialLocation.coords.latitude,
        lng: initialLocation.coords.longitude,
      }
    : defaultCenter;
  console.log("center:", center);

  return (
    <MapView
      provider="google"
      googleMapsApiKey="AIzaSyCv63CzdTG2txBuvQKry0N7Tt5PkoGA9kU"
      initialRegion={{
        latitude: center.lat,
        longitude: center.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      style={styles.map}
    />
  );
}

export default MapScreen;
