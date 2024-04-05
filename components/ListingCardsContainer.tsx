import { gql, useQuery } from "@apollo/client";
import ListingCard from "@components/ListingCard";
import MasonryList from "@react-native-seoul/masonry-list";
import { debounce } from "lodash";
import React, { useState } from "react";

import { RootState, useSelector } from "@/config/state/store";

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
      serviceType
      discount
    }
  }
`;

function ListingCardsContainer() {
  const { loading, data, refetch, fetchMore } = useQuery(allListingsQuery, {
    variables: { first: 12, after: null, sortOrder: "desc", published: true },
    errorPolicy: "all",
  });

  const { width } = useSelector((state: RootState) => state.appMeta);

  const numPerRow = width < 450 ? 1 : width < 900 ? 2 : 3;

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchMoreNew = debounce(() => {
    if (!isFetchingMore && data && data.allListings) {
      setIsFetchingMore(true);
      fetchMore({
        variables: {
          first: 12,
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
      style={{ marginLeft: 10, marginVertical: 10 }}
      data={data ? data.allListings : []}
      numColumns={numPerRow}
      renderItem={({ item }) => <ListingCard data={item} />}
      onEndReached={fetchMoreNew}
      refreshing={loading}
      onRefresh={handleRefresh}
      onEndReachedThreshold={0.2}
      showsVerticalScrollIndicator={false}
    />
  );
}

export default ListingCardsContainer;
