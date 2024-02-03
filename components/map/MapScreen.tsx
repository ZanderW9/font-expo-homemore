import { gql, useQuery } from "@apollo/client";
import { View } from "@components/Themed";
import MapView from "@components/map/MapView";
import { useSearchContext } from "@components/search/SearchProvider";
import { useLocation } from "@config/hooks/location";
import React from "react";
import { StyleSheet } from "react-native";

const MAP_SCREEN_LISTING_SEARCH_QUERY = gql`
  query MapScreenListingSearchQuery($filters: Json) {
    searchListings(filters: $filters) {
      id
      coordinate
      price
    }
  }
`;

//主页和搜索页面显示的主要地图
const MapScreen = () => {
  const { filters, center, setCenter } = useSearchContext();
  const { location } = useLocation();
  const { data, refetch } = useQuery(MAP_SCREEN_LISTING_SEARCH_QUERY, {
    variables: { filters },
  });
  console.log("filters:", filters);

  return (
    <View style={styles.container}>
      {location.coords && (
        <MapView
          userLocation={{
            lat: location.coords.latitude,
            lng: location.coords.longitude,
            accuracy: location.coords.accuracy,
          }}
          listings={data ? data.searchListings : []}
          refetch={refetch}
          filters={filters}
          center={
            center || {
              lat: location.coords.latitude,
              lng: location.coords.longitude,
              latDelta: 0.05,
              lngDelta: 0.05,
            }
          }
          setCenter={setCenter}
          scrollEnabled // 设置可拖动
        />
      )}
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
