import { View } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";

function TabWishlistScreen() {
  const colors = useThemedColors();

  return (
    <View
      style={{
        flex: 1,
      }}
      theme={{ background: "back2" }}
    >
      <Stack.Screen
        options={{
          title: "Services",
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: colors.text,
          },
          headerStyle: {
            backgroundColor: colors.back1,
          },
          headerRight: () => (
            <Ionicons name="ellipsis-vertical" size={26} color="gray" />
          ),
        }}
      />
    </View>
  );
}

export default TabWishlistScreen;
