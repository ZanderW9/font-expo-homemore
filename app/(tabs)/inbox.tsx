import { ChatProvider, GlobalContext } from "@app/_layout";
import NotLogIn from "@components/NotLogIn";
import { View } from "@components/Themed";
import InboxView from "@components/inbox/InboxView";
import React, { useContext } from "react";
import { StyleSheet } from "react-native";

export default function TabInboxScreen() {
  const { isLoggedIn } = useContext(GlobalContext);
  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <ChatProvider>
          <InboxView />
        </ChatProvider>
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
    backgroundColor: "#f5f5f5",
    paddingTop: 4,
    paddingHorizontal: 4,
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
