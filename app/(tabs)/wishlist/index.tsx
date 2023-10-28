import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import { View } from "../../../components/Themed";
import FavoriteCardContainer from "../../../components/wishlist/FavoriteCardsContainer";

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
      <Stack.Screen
        options={{
          title: "Wishlist",
          headerTitleAlign: "center",
          headerRight: () => (
            <Ionicons
              name="create-outline"
              size={24}
              onPress={() => {
                console.log("pressed");
              }}
            />
          ),
        }}
      />
      <FavoriteCardContainer />
    </View>
  );
}

export default TabWishlistScreen;
