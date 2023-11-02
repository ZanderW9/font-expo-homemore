import { View } from "@components/Themed";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";

export default function DummySearch() {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={24}
        color="black"
        style={{ marginLeft: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBlockColor: "black",
    borderWidth: 0.5,
    borderRadius: 20,
    height: 35,
    width: "88%",
    minWidth: 280,
  },
});
