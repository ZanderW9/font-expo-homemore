import EditModal from "@components/wishlist/EditModal";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ListItem, Avatar } from "@rneui/themed";
import { router } from "expo-router";
import React, { useRef } from "react";
import { StyleSheet, View, ScrollView } from "react-native";

const FavoriteCardsContainer: React.FunctionComponent = (data: any) => {
  const [favoriteId, setFavoriteId] = React.useState("");
  const [userId, setUserId] = React.useState("");

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {data &&
          data?.data?.map((item, index) => (
            <ListItem
              key={index}
              onPress={() => {
                router.push({
                  pathname: `/wishlist/${item.name}`,
                  params: { favoriteId: item.id },
                });
              }}
            >
              <ListItem.Content>
                <View style={{ flexDirection: "row" }}>
                  {item?.listings[0]?.listing?.images[0]?.smallUrl ? (
                    <Avatar
                      size={64}
                      source={{
                        uri: item?.listings[0]?.listing?.images[0]?.smallUrl,
                      }}
                      containerStyle={styles.avatar}
                      avatarStyle={{ borderRadius: 10 }}
                    />
                  ) : (
                    <Avatar
                      size={64}
                      title={item.name?.slice(0, 2) ?? ""}
                      containerStyle={styles.avatar}
                      avatarStyle={{ borderRadius: 10 }}
                    />
                  )}
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <ListItem.Title>{item?.name}</ListItem.Title>
                    <ListItem.Subtitle style={{ color: "gray" }}>
                      {item?.description}
                    </ListItem.Subtitle>
                    <ListItem.Subtitle style={{ color: "gray" }}>
                      {item.listings ? item.listings.length : 0} Items
                      {" · "}
                      {item.private ? "Private" : "Public"}
                    </ListItem.Subtitle>
                  </View>
                </View>
              </ListItem.Content>
              <Ionicons
                name="ellipsis-vertical"
                size={15}
                color="gray"
                style={{
                  alignSelf: "flex-end",
                  paddingHorizontal: 10,
                  paddingTop: 10,
                  borderRadius: 10,
                }}
                onPress={() => {
                  bottomSheetModalRef.current?.present();
                  setFavoriteId(item.id);
                  setUserId(item.owner.id);
                }}
              />
            </ListItem>
          ))}
        <EditModal
          bottomSheetModalRef={bottomSheetModalRef}
          favoriteId={favoriteId}
          userId={userId}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  avatar: {
    width: 106.7,
    height: 60,
    borderRadius: 10,
    marginRight: 20,
    backgroundColor: "gray",
  },
});
export default FavoriteCardsContainer;
