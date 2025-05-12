import React from "react";
import { StyleSheet } from "react-native";

import AddListingButton from "../../components/AddListingButton";
import ListingCardsContainer from "../../components/ListingCardsContainer";
import MySearchBar from "../../components/MySearchBar";
import { View } from "../../components/Themed";

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
      <AddListingButton />
    </View>
  );
}

export default TabOneScreen;
