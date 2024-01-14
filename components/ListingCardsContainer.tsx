import { gql, useQuery } from "@apollo/client";
import ListingCard from "@components/ListingCard";
import MasonryList from "@react-native-seoul/masonry-list";
import { debounce } from "lodash";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

const allListingsQuery = gql`
  query Query(
    $after: String
    $first: Int
    $sortOrder: SortOrder
    $published: Boolean
  ) {
    allListings(
      after: $after
      first: $first
      sortOrder: $sortOrder
      published: $published
    ) {
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
`;

function ListingCardsContainer() {
  const { loading, data, refetch, fetchMore } = useQuery(allListingsQuery, {
    variables: { first: 10, after: null, sortOrder: "desc", published: true },
    errorPolicy: "all",
  });

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchMoreNew = debounce(() => {
    if (!isFetchingMore && data && data.allListings) {
      setIsFetchingMore(true);
      fetchMore({
        variables: {
          first: 10,
          after:
            data.allListings.length > 0
              ? data.allListings[data.allListings.length - 1].id
              : null,
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
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 3,
  },
});

export default ListingCardsContainer;
