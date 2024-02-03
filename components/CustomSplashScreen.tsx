import { Image } from "expo-image";
import React from "react";
import { View, StyleSheet } from "react-native";

const CustomSplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/splash.png")}
        style={styles.image}
        contentFit="contain"
      />
    </View>
  );
};

export default CustomSplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
