import { gql, useQuery } from "@apollo/client";
import ListingCard from "@components/ListingCard";
import { View, Text } from "@components/Themed";
import UpdateModal from "@components/wishlist/UpdateModal";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import MasonryList from "@react-native-seoul/masonry-list";
import { useLocalSearchParams, Stack } from "expo-router";
import React, { useRef } from "react";
import { StyleSheet } from "react-native";

const favoriteListingsQuery = gql`
  query Query($favoriteId: String!) {
    FavoritesById(favoriteId: $favoriteId) {
      owner {
        id
      }
      listings {
        listing {
          id
          title
          description
          images {
            smallUrl
            thumbhash
            ratio
          }
          price
          favorited
          address
        }
      }
    }
  }
`;

const meQuery = gql`
  query Query {
    me {
      id
    }
  }
`;

function MyFavoritesScreen() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const inputRef = useRef(null);
  const { favorites } = useLocalSearchParams();
  const favoriteId = useLocalSearchParams().favoriteId;
  const { data, refetch } = useQuery(favoriteListingsQuery, {
    variables: { favoriteId },
    errorPolicy: "all",
  });

  const { data: meData } = useQuery(meQuery);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: favorites,
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerBackTitle: "Wishlist",
          headerRight: () => (
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color="gray"
              onPress={() => {
                bottomSheetModalRef.current?.present();
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 100);
              }}
            />
          ),
        }}
      />
      {data?.FavoritesById[0]?.listings?.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Ionicons name="heart-outline" size={100} color="gray" />
          <Text style={{ fontSize: 20, color: "gray" }}>
            You don't have any favorites yet.
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <MasonryList
            style={styles.container}
            data={
              data?.FavoritesById[0]?.listings
                ? data?.FavoritesById[0]?.listings?.map((item) => item.listing)
                : []
            }
            numColumns={2}
            renderItem={({ item }) => <ListingCard data={item} />}
            onRefresh={handleRefresh}
            onEndReachedThreshold={0.2}
          />
        </View>
      )}
      {meData?.me?.id === data?.FavoritesById[0]?.owner?.id && (
        <UpdateModal
          bottomSheetModalRef={bottomSheetModalRef}
          inputRef={inputRef}
          favoriteId={favoriteId}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 1,
  },
});

export default MyFavoritesScreen;
