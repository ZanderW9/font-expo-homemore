import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  LocationObject,
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { useState, useEffect } from "react";

const defaultLocation = {
  coords: {
    latitude: -33.9062,
    longitude: 151.2107,
    altitude: null,
    accuracy: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  city: "Sydney",
  region: "New South Wales",
  country: "AU",
  timestamp: Date.now(),
};

export const calculateBoundaries = (center: {
  lat: number;
  lng: number;
  latDelta: number;
  lngDelta: number;
}) => {
  return {
    northEast: {
      latitude: center.lat + (center.latDelta || 0.05) / 2,
      longitude: center.lng + (center.lngDelta || 0.05) / 2,
    },
    southWest: {
      latitude: center.lat - (center.latDelta || 0.05) / 2,
      longitude: center.lng - (center.lngDelta || 0.05) / 2,
    },
  };
};

export const calculateCenter = (boundaries: {
  northEast: { latitude: number; longitude: number };
  southWest: { latitude: number; longitude: number };
}) => {
  return {
    lat: (boundaries.northEast.latitude + boundaries.southWest.latitude) / 2,
    lng: (boundaries.northEast.longitude + boundaries.southWest.longitude) / 2,
    latDelta: boundaries.northEast.latitude - boundaries.southWest.latitude,
    lngDelta: boundaries.northEast.longitude - boundaries.southWest.longitude,
  };
};

// location is your current location, boundaries is the map boundaries
export const useLocation = () => {
  const [location, setLocation] = useState<LocationObject>(defaultLocation);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Try to get location from local storage
        const userLocation = await AsyncStorage.getItem("userLocation");

        if (userLocation) {
          setLocation(JSON.parse(userLocation));
        } else {
          // If no local location, fetch IP based location
          const ipLocation = await fetchIpLocation();
          // console.log("get location from IP based location");
          if (ipLocation) {
            setLocation(ipLocation);
          }
        }

        const { status } = await requestForegroundPermissionsAsync();
        if (status === "granted") {
          const currentUserLocation = await getCurrentPositionAsync();
          setLocation(currentUserLocation);
          AsyncStorage.setItem(
            "userLocation",
            JSON.stringify(currentUserLocation),
          );
        } else {
          setErrorMsg("Permission to access location was denied");
        }
      } catch {
        setErrorMsg("Failed to get the location");
      }
    })();
  }, []);

  return { location, setLocation, errorMsg };
};

export const fetchIpLocation = async () => {
  try {
    const response = await fetch("https://api.ipify.org/?format=json");
    const data = await response.json();
    if (data && data.ip) {
      const locationResponse = await fetch(`https://ipapi.co/${data.ip}/json/`);
      const locationData = await locationResponse.json();
      if (locationData && locationData.latitude && locationData.longitude) {
        const location = {
          coords: {
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            accuracy: 1000,
            altitude: 0,
            altitudeAccuracy: 0,
            heading: 0,
            speed: 0,
          },
          city: locationData.city,
          region: locationData.region,
          country: locationData.country,
          timestamp: Date.now(),
        };
        console.log("FetchIpLocation:", location);
        return location;
      }
    }
  } catch {
    return null;
  }
};
