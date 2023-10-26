import { useLocalSearchParams, Stack } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

const ChatScreen = () => {
  const { chat } = useLocalSearchParams();
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: `chat ${chat}` }} />
      <Text>{chat}</Text>
    </View>
  );
};

export default ChatScreen;
