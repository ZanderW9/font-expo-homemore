import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  LocationObject,
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { useState, useEffect } from "react";

function useUserLocation() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        const currentLocation = await getCurrentPositionAsync({});
        setLocation(currentLocation);
        AsyncStorage.setItem("userLocation", JSON.stringify(currentLocation));
      } catch {
        setErrorMsg("Failed to get the location");
      }
    })();
  }, []);

  return { location, errorMsg };
}

export default useUserLocation;
