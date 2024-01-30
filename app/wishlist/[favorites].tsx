import { gql, useQuery } from "@apollo/client";
import ListingCard from "@components/ListingCard";
import { View, Text } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import MasonryList from "@react-native-seoul/masonry-list";
import { useLocalSearchParams, Stack } from "expo-router";
import React from "react";
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

function MyFavoritesScreen() {
  const colors = useThemedColors();
  const { favorites } = useLocalSearchParams();
  const favoriteId = useLocalSearchParams().favoriteId;
  const { data, refetch } = useQuery(favoriteListingsQuery, {
    variables: { favoriteId },
    errorPolicy: "all",
  });

  const handleRefresh = () => {
    refetch();
  };

  refetch();

  return (
    <View style={styles.container} theme={{ background: "back2" }}>
      <Stack.Screen
        options={{
          title: favorites,
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerBackTitle: "Wishlist",
          animation: "slide_from_right",
          headerStyle: {
            backgroundColor: colors.back1,
          },
          headerTitleStyle: {
            color: colors.text,
          },
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
        <MasonryList
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
  },
});

export default MyFavoritesScreen;
