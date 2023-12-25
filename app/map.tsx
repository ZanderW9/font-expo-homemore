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
            latDelta: 0.0922,
            lngDelta: 0.0421,
          }}
          scrollEnabled // 设置可拖动
          isFullScreen
        />
      )}
      <FAB
        size="small"
        title=""
        style={{ position: "absolute", bottom: 20, right: 10 }}
        icon={<Ionicons name="close" size={21} color="white" />}
        color="rgba(0,0,0,0.4)"
        onPress={() => router.back()}
      />
    </View>
  );
}

export default ExploreMapScreen;
