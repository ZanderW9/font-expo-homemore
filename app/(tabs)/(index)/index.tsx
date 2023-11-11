import ListingCardsContainer from "@components/ListingCardsContainer";
import { View } from "@components/Themed";
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
    backgroundColor: "#f5f5f5",
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

function TabExploreScreen() {
  return (
    <View style={styles.container}>
      <ListingCardsContainer />
      <FAB
        size="small"
        title="Map"
        style={{ position: "absolute", bottom: 20 }}
        icon={
          <Ionicons
            name="ios-map-outline"
            size={24}
            color="white"
            style={{ paddingLeft: 7 }}
          />
        }
        onPress={() => router.push("/map")}
        color="rgba(0,0,0,0.4)"
      />
    </View>
  );
}

export default TabExploreScreen;
