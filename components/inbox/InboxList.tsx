import { View } from "@components/Themed";
import { ListItem, Avatar } from "@rneui/themed";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

export default function InboxList(props: any) {
  const { data, refetch, loading } = props;
  const chatData = data.me.chats.map((item) => item.chat);
  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <FlashList
        estimatedItemSize={60}
        data={chatData}
        onRefresh={() => refetch()}
        refreshing={loading}
        renderItem={({ item }) => (
          <ListItem
            onPress={() =>
              router.push({
                pathname: `/inbox/[chatId]`,
                params: { chatId: item.id },
              })
            }
            bottomDivider
          >
            {item.users[0].user.avatar ? (
              <Avatar
                size={64}
                rounded
                containerStyle={styles.avatar}
                source={{ uri: item.users[0].user.avatar }}
              />
            ) : (
              <Avatar
                size={64}
                rounded
                containerStyle={styles.avatar}
                title={item.users[0].user.userName?.slice(0, 2) ?? ""}
              />
            )}
            <ListItem.Content>
              <ListItem.Title>{item.users[0].user.userName}</ListItem.Title>
              <ListItem.Subtitle>{item.users[0].user.email}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: "gray",
    borderStyle: "dashed",
    backgroundColor: "#F3EED9",
  },
});
