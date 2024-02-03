import { View, Text } from "@components/Themed";
import { calculateCenter } from "@config/hooks/location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useRef } from "react";
import { StyleSheet } from "react-native";
import { showMessage } from "react-native-flash-message";
import { default as DefaultMapView, Marker } from "react-native-maps";

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
      provider="google"
      ref={mapRef}
      initialRegion={region}
      scrollEnabled={scrollEnabled}
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
