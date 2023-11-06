import { View } from "@components/Themed";
import FavoriteCardContainer from "@components/wishlist/FavoriteCardsContainer";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

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
                router.push("/createwishlist");
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
