import { useLocalSearchParams, Stack } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

export const ChatScreen = () => {
  const { chat } = useLocalSearchParams();
  console.log("chat: ", chat);
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: `chat ${chat}` }} />
      <Text>{chat}</Text>
    </View>
  );
};
