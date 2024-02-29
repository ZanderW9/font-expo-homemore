import { View, Text } from "@components/Themed";
import { calculateCenter } from "@config/hooks/location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useRef } from "react";
import { StyleSheet, useColorScheme, Keyboard, Platform } from "react-native";
import { showMessage } from "react-native-flash-message";
import {
  default as DefaultMapView,
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from "react-native-maps";

function MapView(props) {
  const {
    center,
    setCenter,
    userLocation,
    showUserLocation,
    listings,
    refetch,
    filters,
    scrollEnabled,
  } = props;
  const colorScheme = useColorScheme() ?? "light";

  const region = {
    latitude: center.lat,
    longitude: center.lng,
    latitudeDelta: center.latDelta,
    longitudeDelta: center.lngDelta,
  };

  const mapRef = useRef(null);

  const handleGetBoundaries = async () => {
    try {
      if (mapRef.current) {
        const result = await mapRef.current.getMapBoundaries();
        const newCenter = calculateCenter(result);
        setCenter(newCenter);
        refetch({ filters });
        await AsyncStorage.setItem("mapCenter", JSON.stringify(newCenter));
      }
    } catch {
      showMessage({
        message: "Error when getting map boundaries",
        type: "danger",
      });
    }
  };

  const showCircleMarker =
    region.latitudeDelta > 0.1 || region.longitudeDelta > 0.1;

  return (
    <DefaultMapView
      onPress={() => Keyboard.dismiss()}
      onPanDrag={() => Keyboard.dismiss()}
      provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
      ref={mapRef}
      initialRegion={region}
      scrollEnabled={scrollEnabled}
      customMapStyle={colorScheme === "dark" ? mapStyle : []}
      style={{ width: "100%", height: "100%", flex: 1 }}
      onRegionChangeComplete={async (newRegion) => {
        setCenter({
          lat: newRegion.latitude,
          lng: newRegion.longitude,
          latDelta: newRegion.latitudeDelta,
          lngDelta: newRegion.longitudeDelta,
        });
        await handleGetBoundaries();
        // 在拖动完成时获取地图边界
      }}
    >
      {/* 标记用户位置 */}
      {showUserLocation && userLocation.accuracy && (
        <Marker
          coordinate={{
            latitude: userLocation.lat,
            longitude: userLocation.lng,
          }}
          title="Current Location"
        >
          <View
            style={{
              backgroundColor: "rgba(212, 224,247, 0.8)",
              padding: 6,
              borderRadius: 20,
              borderColor: "white",
              borderWidth: 1,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(66, 133, 244, 0.9)",
                padding: 6,
                borderRadius: 20,
                borderColor: "white",
                borderWidth: 1,
              }}
            />
          </View>
        </Marker>
      )}

      {listings?.map((listing) => {
        const coordinate = {
          latitude: listing?.coordinate.lat,
          longitude: listing?.coordinate.lng,
        };
        return showCircleMarker ? (
          <Marker
            key={listing.id}
            coordinate={coordinate}
            onPress={() => {
              router.push({
                pathname: `/detail/${listings[0].id}`,
              });
            }}
          >
            <View style={styles.circleMarker} />
          </Marker>
        ) : (
          <Marker
            key={listing.id}
            coordinate={coordinate}
            onPress={() => {
              router.push({
                pathname: `/detail/${listings[0].id}`,
              });
            }}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>${listing.price}</Text>
            </View>
          </Marker>
        );
      })}
    </DefaultMapView>
  );
}

const styles = StyleSheet.create({
  marker: {
    backgroundColor: "rgba(66, 133, 244, 0.9)",
    padding: 3,
    borderRadius: 20,
    borderColor: "white",
    borderWidth: 1,
    minWidth: 40,
  },
  markerText: {
    color: "white",
    fontSize: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  circleMarker: {
    backgroundColor: "red",
    padding: 6,
    borderRadius: 20,
    borderColor: "white",
    borderWidth: 1,
  },
});

export default MapView;

const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];
