import { View, Text } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { ListItem, Avatar } from "@rneui/themed";
import { router } from "expo-router";
import { StyleSheet, FlatList } from "react-native";

export default function InboxList(props: any) {
  const colors = useThemedColors();
  const { data, refetch } = props;
  return (
    <View style={{ flex: 1 }} theme={{ background: "back2" }}>
      <FlatList
        data={data?.allChats || []}
        onRefresh={() => refetch()}
        refreshing={false}
        renderItem={({ item }) => (
          <ListItem
            containerStyle={{
              backgroundColor: colors.back1,
              borderColor: colors.border1,
              borderBottomWidth: 0.25,
            }}
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
                <Text>{item.chatMeta.userName}</Text>
              </ListItem.Title>
              <ListItem.Subtitle
                numberOfLines={1}
                style={{ maxWidth: "100%", paddingTop: 3 }}
                ellipsizeMode="tail"
              >
                <Text>
                  {item.messages.length === 0
                    ? ""
                    : `${
                        item.messages[item.messages.length - 1].user.id ===
                        data?.me.id
                          ? "You"
                          : item.messages[item.messages.length - 1].user
                              .userName
                      }: ${item.messages[item.messages.length - 1].text}`}
                </Text>
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
