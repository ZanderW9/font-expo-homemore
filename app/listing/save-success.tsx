import { View, Text } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { Button } from "@rneui/themed";
import { router, Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

function SaveSuccessScreen() {
  const colors = useThemedColors();

  const returnHandler = async () => {
    router.navigate("/");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerShown: false,
        }}
      />
      <View
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>Listing Saved in Draft</Text>
        <Text style={styles.subtitle}>
          Your listing has been saved, but not yet published.
        </Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          theme={{ background: "back1" }}
        >
          <Button
            title="Return Home"
            onPress={returnHandler}
            buttonStyle={{
              backgroundColor: colors.mainColor,
              height: 50,
              width: 130,
              borderRadius: 7,
              margin: 20,
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingBottom: 0,
  },
  title: {
    fontSize: 40,
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    paddingBottom: 10,
  },
});

export default SaveSuccessScreen;
