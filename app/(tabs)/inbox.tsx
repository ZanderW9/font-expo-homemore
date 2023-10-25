import { gql } from "@apollo/client";
import { ListItem, Button } from "@rneui/themed";
import { usePathname, router } from "expo-router";
import React from "react";
import { StyleSheet, FlatList } from "react-native";

import { Text, View } from "../../components/Themed";
import useCachedQuery from "../../config/useCachedQuery";

const myChatsQuery = gql`
  query Query {
    myChats {
      id
      users {
        user {
          email
          id
          userName
        }
      }
      messages {
        text
        user {
          email
        }
      }
    }
  }
`;

export default function TabInboxScreen() {
  const { data, loading } = useCachedQuery(myChatsQuery, usePathname());
  if (!loading && data) {
    console.log("data: ", data);
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={data && data.myChats}
        renderItem={({ item }) => (
          <ListItem.Swipeable
            // onPress={() => router.push(`/inbox/${item.id}`)}
            onPress={() =>
              router.push({
                pathname: `/inbox/[chat]`,
                params: { chat: item.id },
              })
            }
            bottomDivider
            rightContent={(reset) => (
              <Button
                onPress={reset}
                title={<Text>Delete</Text>}
                containerStyle={{
                  flex: 1,
                  backgroundColor: "red",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                type="clear"
              />
            )}
          >
            <ListItem.Content>
              <ListItem.Title>{item.id}</ListItem.Title>
              <ListItem.Subtitle>{item.users[0].user.email}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem.Swipeable>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
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
