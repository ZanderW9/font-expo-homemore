import { ChatProvider } from "@app/_layout";
import { View } from "@components/Themed";
import InboxView from "@components/inbox/InboxView";
import React from "react";
import { StyleSheet } from "react-native";

export default function TabInboxScreen() {
  return (
    <ChatProvider>
      <View style={styles.container}>
        <InboxView />
      </View>
    </ChatProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
