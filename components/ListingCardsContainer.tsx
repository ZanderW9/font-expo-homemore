import { gql, useQuery, useApolloClient } from "@apollo/client";
import ListingCard from "@components/ListingCard";
import MasonryList from "@react-native-seoul/masonry-list";
import { Skeleton } from "@rneui/themed";
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

function LoadingView({ numPerRow }: { numPerRow: number }) {
  return (
    <MasonryList
      style={{ marginLeft: 10, marginRight: 10 }}
      keyExtractor={(item) => item}
      data={[1, 2]}
      numColumns={numPerRow}
      renderItem={({ item }) => (
        <Skeleton
          animation="pulse"
          height={300}
          width="100%"
          style={{ marginRight: 10, borderRadius: 10, marginBottom: 10 }}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

function ListingCardsContainer() {
  const client = useApolloClient();

  const { loading, data, refetch, fetchMore } = useQuery(allListingsQuery, {
    variables: { first: 12, after: null, sortOrder: "desc", published: true },
    errorPolicy: "all",
  });

  const { width } = useSelector((state: RootState) => state.appMeta);

  const numPerRow = width < 450 ? 1 : width < 900 ? 2 : 3;

  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const after =
    data?.allListings?.length > 0
      ? data.allListings[data.allListings.length - 1].id
      : null;

  const fetchMoreNew = debounce(() => {
    if (!isFetchingMore && data && data.allListings) {
      setIsFetchingMore(true);
      fetchMore({
        variables: {
          first: 12,
          after,
          sortOrder: "desc",
          published: true,
        },
      }).then((res) => {
        const incoming = res?.data.allListings;
        const existing = data.allListings;
        const cached_data = client.readQuery({
          query: allListingsQuery,
        });
        /*
          ! cached_data: 按理来说是 apollo 缓存的数据，但是点进 detail 之后，这个缓存会变成 undefined
          ! incoming: 从服务器获取的数据，existing: 已经存在的数据
          ! 如果缓存不存在，且 incoming 有数据，就将 incoming 数据和 existing 数据合并
          ! 并且手动写入缓存
         */
        if (!cached_data && incoming && incoming.length > 0) {
          client.writeQuery({
            query: allListingsQuery,
            data: {
              allListings: [...existing, ...incoming],
            },
          });
        }

        setIsFetchingMore(false);
      });
    }
  }, 30);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <MasonryList
      style={{ marginLeft: 10, marginTop: 10 }}
      keyExtractor={(item) => item.id}
      data={data ? data?.allListings : []}
      numColumns={numPerRow}
      renderItem={({ item }) => <ListingCard data={item} />}
      onEndReached={fetchMoreNew}
      refreshing={loading}
      onRefresh={handleRefresh}
      loading={isFetchingMore || loading}
      onEndReachedThreshold={0.2}
      showsVerticalScrollIndicator={false}
      LoadingView={<LoadingView numPerRow={numPerRow} />}
    />
  );
}

export default ListingCardsContainer;
