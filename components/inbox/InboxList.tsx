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

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <ListItem.Subtitle
                  numberOfLines={1}
                  style={{
                    maxWidth: "100%",
                    paddingTop: 3,
                  }}
                  ellipsizeMode="tail"
                >
                  <Text style={{ color: colors.textSub1Reverse }}>
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

                <View>
                  <ListItem.Subtitle
                    numberOfLines={1}
                    style={{
                      maxWidth: "100%",
                      paddingTop: 3,
                    }}
                    ellipsizeMode="tail"
                  >
                    <Text style={{ color: colors.textSub1Reverse }}>
                      {item.messages.length === 0
                        ? ""
                        : (() => {
                            const messageDate = new Date(
                              item.messages[item.messages.length - 1].createdAt,
                            );
                            const today = new Date();
                            const isSameYear =
                              messageDate.getFullYear() === today.getFullYear();
                            const isSameDay =
                              messageDate.toDateString() ===
                              today.toDateString();

                            if (isSameDay) {
                              // 如果是今天，则只显示时分
                              return item.messages[
                                item.messages.length - 1
                              ].createdAt.slice(11, 16);
                            } else if (isSameYear) {
                              // 如果不是今天但是同一年，则只显示日月
                              return item.messages[
                                item.messages.length - 1
                              ].createdAt.slice(5, 10);
                            } else {
                              // 如果不是今年，则只显示年份
                              return item.messages[
                                item.messages.length - 1
                              ].createdAt.slice(0, 4);
                            }
                          })()}
                    </Text>
                  </ListItem.Subtitle>
                </View>
              </View>
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
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#F3EED9",
  },
});
