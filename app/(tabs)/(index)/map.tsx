import { View } from "@components/Themed";
import MapScreen from "@components/map/MapView";
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
  map: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

function ExploreMapScreen() {
  return (
    <View style={styles.container}>
      <MapScreen />
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
