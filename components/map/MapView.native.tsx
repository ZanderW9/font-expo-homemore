import { gql, useQuery } from "@apollo/client";
import { View, Text } from "@components/Themed";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";

const mapViewQuery = gql`
  query Query($first: Int, $boundary: Json, $published: Boolean) {
    allListings(first: $first, boundary: $boundary, published: $published) {
      id
      coordinate
      price
    }
  }
`;

function MapScreen(props) {
  const [boundaries, setBoundaries] = useState({});
  const { data } = useQuery(mapViewQuery, {
    variables: {
      first: 100,
      published: true,
      boundary: {
        northEast: {
          latitude: boundaries.northEast?.latitude,
          longitude: boundaries.northEast?.longitude,
        },
        southWest: {
          latitude: boundaries.southWest?.latitude,
          longitude: boundaries.southWest?.longitude,
        },
      },
    },
  });

  const { center, scrollEnabled, isFullScreen } = props;
  const [region, setRegion] = useState({
    latitude: center.lat,
    longitude: center.lng,
    latitudeDelta: center.latDelta,
    longitudeDelta: center.lngDelta,
  });
  const mapRef = useRef(null);

  useEffect(() => {
    if (Platform.OS === "android" && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: center.lat,
        longitude: center.lng,
        latitudeDelta: center.latDelta,
        longitudeDelta: center.lngDelta,
      });
      handleGetBoundaries();
    }
  }, [center]);

  const handleGetBoundaries = async () => {
    try {
      if (mapRef.current) {
        const result = await mapRef.current.getMapBoundaries();
        setBoundaries(result);
      }
    } catch (error) {
      console.log("Error getting map boundaries:", error);
    }
  };

  const currentLocationMarker = {
    latitude: center.lat,
    longitude: center.lng,
  };

  const showCircleMarker =
    region.latitudeDelta > 0.1 || region.longitudeDelta > 0.1;

  return (
    <MapView
      provider="google"
      ref={mapRef}
      initialRegion={region}
      scrollEnabled={scrollEnabled}
      style={{ width: "100%", height: "100%", flex: 1 }}
      onRegionChangeComplete={async (newRegion) => {
        setRegion(newRegion);
        await handleGetBoundaries(); // 在拖动完成时获取地图边界
      }}
    >
      {/* 使用圆点标记当前位置 */}
      {!isFullScreen ? (
        <Marker coordinate={currentLocationMarker} title="Current Location">
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
      ) : (
        data?.allListings?.map((listing) => {
          const coordinate = {
            latitude: listing.coordinate.lat,
            longitude: listing.coordinate.lng,
          };
          return showCircleMarker ? (
            <Marker
              key={listing.id}
              coordinate={coordinate}
              onPress={() => {
                router.push({
                  pathname: "/detail",
                  params: { listing: data.allListings[0].id },
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
                  pathname: "/detail",
                  params: { listing: data.allListings[0].id },
                });
              }}
            >
              <View style={styles.marker}>
                <Text style={styles.markerText}>${listing.price}</Text>
              </View>
            </Marker>
          );
        })
      )}
    </MapView>
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

export default MapScreen;
