import { gql, useQuery } from "@apollo/client";
import ListingCard from "@components/ListingCard";
import { View } from "@components/Themed";
import MasonryList from "@react-native-seoul/masonry-list";
import { useLocalSearchParams, Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const favoriteListingsQuery = gql`
  query Query($favoriteId: String!) {
    favorite(favoriteId: $favoriteId) {
      listings {
        listing {
          id
          title
          description
          images
          price
          favorited
          address
        }
      }
    }
  }
`;

function MyFavoritesScreen() {
  const { favorites } = useLocalSearchParams();
  const favoriteId = useLocalSearchParams().favoriteId;
  const { data, loading, refetch } = useQuery(favoriteListingsQuery, {
    variables: { favoriteId },
    errorPolicy: "all",
  });

  refetch();

  const handleRefresh = () => {
    refetch();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: favorites }} />
      <MasonryList
        style={styles.container}
        data={data ? data.favorite.listings.map((item) => item.listing) : []}
        numColumns={2}
        renderItem={({ item }) => <ListingCard data={item} />}
        refreshing={loading}
        onRefresh={handleRefresh}
        onEndReachedThreshold={0.2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MyFavoritesScreen;
