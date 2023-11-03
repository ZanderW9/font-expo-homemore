import { gql, useQuery } from "@apollo/client";
import ListingCard from "@components/ListingCard";
import MasonryList from "@react-native-seoul/masonry-list";
import { debounce } from "lodash";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

const allListingsQuery = gql`
  query Query($after: String, $first: Int, $sortOrder: SortOrder) {
    allListings(after: $after, first: $first, sortOrder: $sortOrder) {
      id
      title
      description
      images
      price
      favorited
      address
    }
  }
`;

function ListingCardsContainer() {
  const { loading, data, refetch, fetchMore } = useQuery(allListingsQuery, {
    variables: { first: 10, after: null, sortOrder: "desc" },
    errorPolicy: "all",
  });

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchMoreNew = debounce(() => {
    if (
      !isFetchingMore &&
      data &&
      data.allListings[data.allListings.length - 1].id
    ) {
      setIsFetchingMore(true);
      fetchMore({
        variables: {
          first: 10,
          after: data.allListings[data.allListings.length - 1].id.toString(),
          sortOrder: "desc",
        },
      }).then(() => {
        setIsFetchingMore(false);
      });
    }
  }, 30);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <MasonryList
      style={styles.container}
      data={data ? data.allListings : []}
      numColumns={2}
      renderItem={({ item }) => <ListingCard data={item} />}
      onEndReached={fetchMoreNew}
      refreshing={loading}
      onRefresh={handleRefresh}
      onEndReachedThreshold={0.2}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ListingCardsContainer;
