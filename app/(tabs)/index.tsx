import React from "react";
import { StyleSheet } from "react-native";

import ListingCardsContainer from "../../components/ListingCardsContainer";
import { View } from "../../components/Themed";
import MySearchBar from "../../components/home/MySearchBar";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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

function TabOneScreen() {
  return (
    <View style={styles.container}>
      <MySearchBar />
      <ListingCardsContainer />
    </View>
  );
}

export default TabOneScreen;
