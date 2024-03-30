import NotLogIn from "@components/NotLogIn";
import { View } from "@components/Themed";
import InboxView from "@components/inbox/InboxView";
import { useThemedColors } from "@constants/theme";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import { RootState, useSelector } from "@/config/state/store";

export default function TabInboxScreen() {
  const colors = useThemedColors();
  const { token } = useSelector((state: RootState) => state.appMeta);
  return (
    <View style={styles.container} theme={{ background: "back2" }}>
      <Stack.Screen
        options={{
          title: "Inbox",
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: colors.text,
          },
          headerStyle: {
            backgroundColor: colors.back1,
          },
        }}
      />
      {token ? (
        <InboxView />
      ) : (
        <NotLogIn
          title="Sign in and check your inbox"
          subtitle="talk to other users and manage your messages"
        />
      )}
    </View>
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
});
