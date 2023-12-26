import { View } from "@components/Themed";
import MapScreen from "@components/map/MapView";
import { Ionicons } from "@expo/vector-icons";
import { FAB } from "@rneui/themed";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

function DetailMapScreen() {
  const { lat, lng } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <MapScreen
        center={{
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          latDelta: 0.0922,
          lngDelta: 0.0421,
        }}
        scrollEnabled // 设置可拖动
        isFullScreen
      />

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

export default DetailMapScreen;
