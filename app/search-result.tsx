import ListingCard from "@components/ListingCard";
import { View } from "@components/Themed";
import SearchEntry from "@components/search/SearchEntry";
import { useSearchContext } from "@components/search/SearchProvider";
import { Ionicons } from "@expo/vector-icons";
import MasonryList from "@react-native-seoul/masonry-list";
import { FAB } from "@rneui/themed";
import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function SearchResultScreen() {
  const { loading, data, refetch, text } = useSearchContext();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <SearchEntry text={text} />
      <MasonryList
        style={styles.listingCardsContainer}
        data={data ? data.searchListings : []}
        numColumns={2}
        renderItem={({ item }) => <ListingCard data={item} />}
        // onEndReached={fetchMoreNew}
        refreshing={loading}
        onRefresh={refetch}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={false}
      />
      <FAB
        size="small"
        title="Map"
        style={{ position: "absolute", bottom: insets.bottom + 10 }}
        icon={
          <Ionicons
            name="map-outline"
            size={24}
            color="white"
            style={{ paddingLeft: 7 }}
          />
        }
        onPress={() =>
          router.navigate({ pathname: "/map", params: { center: {} } })
        }
        color="rgba(0,0,0,0.4)"
      />
    </View>
  );
}

export default SearchResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  listingCardsContainer: {
    flex: 1,
    margin: 3,
  },
  map: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
