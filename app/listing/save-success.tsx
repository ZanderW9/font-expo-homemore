import { View, Text } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { Feather } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import { router, Stack, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet } from "react-native";

import i18n from "@/config/localizations/i18n";

function SaveSuccessScreen() {
  const colors = useThemedColors();

  const returnHandler = async () => {
    router.replace("/");
  };

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        router.replace("/");
      }, 1000);
      return () => clearTimeout(timer);
    }, []),
  );

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
        <Feather name="check-circle" size={36} color="green" />
        <Text style={styles.title}>
          {i18n.t("create_listing.save_success.title")}
        </Text>
        <Text style={styles.subtitle}>
          {i18n.t("create_listing.save_success.description")}
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
            title={i18n.t("create_listing.save_success.return_home")}
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
    fontSize: 26,
    paddingVertical: 16,
  },
  subtitle: {
    fontSize: 16,
    paddingBottom: 10,
  },
});

export default SaveSuccessScreen;
