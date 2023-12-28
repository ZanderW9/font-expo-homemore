import { gql } from "@apollo/client";
import EditModal from "@components/wishlist/EditModal";
import useCachedQuery from "@config/useCachedQuery";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ListItem, Avatar } from "@rneui/themed";
import { usePathname, router } from "expo-router";
import React, { useRef } from "react";
import { StyleSheet, View, ScrollView } from "react-native";

const favoriteByUserQuery = gql`
  # Increments a back-end counter and gets its resulting value
  query MyFavorites {
    myFavorites {
      id
      name
      private
      listings {
        listing {
          id
          images {
            smallUrl
            thumbhash
          }
        }
      }
    }
  }
`;

const FavoriteCardsContainer: React.FunctionComponent = () => {
  const { data } = useCachedQuery(favoriteByUserQuery, usePathname(), {});
  const [favoriteId, setFavoriteId] = React.useState("");

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {data &&
          data.myFavorites &&
          data.myFavorites.map((item, index) => (
            <ListItem
              style={styles.card}
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
                    <ListItem.Title>{item.name}</ListItem.Title>
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
                }}
              />
            </ListItem>
          ))}
        <EditModal
          bottomSheetModalRef={bottomSheetModalRef}
          favoriteId={favoriteId}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  card: {
    width: "100%",
    fontSize: 30,
  },
  avatar: {
    width: 106.7,
    height: 60,
    borderRadius: 10,
    marginRight: 20,
    backgroundColor: "coral",
  },
});
export default FavoriteCardsContainer;
