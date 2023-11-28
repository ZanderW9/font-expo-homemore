import { View } from "@components/Themed";
import MapScreen from "@components/map/MapView";
import { Ionicons } from "@expo/vector-icons";
import { FAB } from "@rneui/themed";
import { router, useLocalSearchParams, Stack } from "expo-router";
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
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      />
      <MapScreen
        center={{
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        }}
        scrollEnabled // 设置可拖动
      />

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
        onPress={() => router.back()}
      />
    </View>
  );
}

export default DetailMapScreen;
