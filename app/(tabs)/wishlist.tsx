import React from "react";
import { StyleSheet } from "react-native";

import FavoriteCardContainer from "../../components/FavoriteCardsContainer";
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

function TabWishlistScreen() {
  return (
    <View style={styles.container}>
      <FavoriteCardContainer />
    </View>
  );
}

export default TabWishlistScreen;
