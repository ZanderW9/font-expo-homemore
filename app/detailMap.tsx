import { View } from "@components/Themed";
import MapView from "@components/map/MapView";
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
  const {
    lat: latStr,
    lng: lngStr,
    id,
    price: priceStr,
  } = useLocalSearchParams();
  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);
  const price = parseInt(priceStr, 10);

  const listing = {
    id,
    price,
    coordinate: {
      lat,
      lng,
    },
  };

  return (
    <View style={styles.container}>
      <MapView
        center={{
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          latDelta: 0.0922,
          lngDelta: 0.0421,
        }}
        setCenter={() => {}}
        listings={[listing]}
        refetch={() => {}}
        scrollEnabled // 设置可拖动
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
