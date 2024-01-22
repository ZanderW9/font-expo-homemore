import { View } from "@components/Themed";
import { ListItem, Avatar } from "@rneui/themed";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

export default function InboxList(props: any) {
  const { data, refetch } = props;
  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <FlashList
        estimatedItemSize={60}
        data={data?.allChats || []}
        onRefresh={() => refetch()}
        refreshing={false}
        renderItem={({ item }) => (
          <ListItem
            onPress={() =>
              router.navigate({
                pathname: "/inbox/[chatId]",
                params: {
                  chatId: item.id,
                  userId: item.chatMeta?.id,
                  userName: item.chatMeta?.userName,
                },
              })
            }
            bottomDivider
          >
            {item.chatMeta.avatar ? (
              <Avatar
                size={50}
                rounded
                containerStyle={styles.avatar}
                source={{ uri: item.chatMeta.avatar }}
              />
            ) : (
              <Avatar
                size={50}
                rounded
                containerStyle={styles.avatar}
                title={item.chatMeta.userName?.slice(0, 2) ?? ""}
              />
            )}
            <ListItem.Content>
              <ListItem.Title
                numberOfLines={1}
                style={{ maxWidth: "100%", paddingBottom: 3 }}
                ellipsizeMode="tail"
              >
                {item.chatMeta.userName}
              </ListItem.Title>
              <ListItem.Subtitle
                numberOfLines={1}
                style={{ color: "gray", maxWidth: "100%", paddingTop: 3 }}
                ellipsizeMode="tail"
              >
                {item.messages.length === 0
                  ? ""
                  : `${
                      item.messages[item.messages.length - 1].user.id ===
                      data?.me.id
                        ? "You"
                        : item.messages[item.messages.length - 1].user.userName
                    }: ${item.messages[item.messages.length - 1].text}`}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 32,
    borderWidth: 0.5,
    borderColor: "gray",
    borderStyle: "dashed",
    backgroundColor: "#F3EED9",
  },
});
