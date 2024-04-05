import NotLogIn from "@components/NotLogIn";
import { View } from "@components/Themed";
import InboxView from "@components/inbox/InboxView";
import { useThemedColors } from "@constants/theme";
import { AntDesign } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import { RootState, useSelector } from "@/config/state/store";

export default function TabInboxScreen() {
  const colors = useThemedColors();
  const { token } = useSelector((state: RootState) => state.appMeta);
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: !!token,
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
        <View style={styles.container} theme={{ background: "back2" }}>
          <InboxView />
        </View>
      ) : (
        <NotLogIn
          icon={
            <AntDesign
              name="message1"
              size={40}
              color="#ec4c60"
              style={{
                marginVertical: 20,
              }}
            />
          }
          title="inbox.not_sign_in.title"
          description="inbox.not_sign_in.description"
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
