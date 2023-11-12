import { View } from "@components/Themed";
import MapScreen from "@components/map/MapView";
import { useGetLocalItem } from "@config/hooks/storage";
import { Ionicons } from "@expo/vector-icons";
import { FAB } from "@rneui/themed";
import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

function ExploreMapScreen() {
  const { storedValue: initialLocation } = useGetLocalItem("userLocation");

  return (
    <View style={styles.container}>
      {initialLocation && (
        <MapScreen
          center={{
            lat: initialLocation.coords.latitude,
            lng: initialLocation.coords.longitude,
          }}
        />
      )}
      <FAB
        size="small"
        title="Search this area"
        style={{ position: "absolute", bottom: 20 }}
        icon={
          <Ionicons
            name="search-outline"
            size={24}
            color="white"
            style={{ paddingLeft: 7 }}
          />
        }
        color="rgba(0,0,0,0.4)"
      />
      <FAB
        size="small"
        title=""
        style={{ position: "absolute", bottom: 20, left: 10 }}
        icon={<Ionicons name="close" size={21} color="white" />}
        color="rgba(0,0,0,0.4)"
        onPress={() => router.push("/")}
      />
    </View>
  );
}

export default ExploreMapScreen;
