import React from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";

function CreatewishlistScreen() {
  return (
    <View style={styles.container}>
      <Text>this is create wishlist screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CreatewishlistScreen;
