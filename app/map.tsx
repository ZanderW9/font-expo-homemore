import { View, SafeAreaView } from "@components/Themed";
import MapScreen from "@components/map/MapScreen";
import { useSearchContext } from "@components/search/SearchProvider";
import { Ionicons } from "@expo/vector-icons";
import { Button, SearchBar, FAB } from "@rneui/themed";
import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ExploreMapScreen = () => {
  const { filters, onSearch, dispatchFilters } = useSearchContext();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.searchBarContainer} edges={["top"]}>
        <SearchBar
          placeholder="Search address, facilities..."
          platform="default"
          containerStyle={styles.searchContainer}
          inputStyle={styles.searchInput}
          inputContainerStyle={styles.searchInputContainer}
          onChangeText={(text) => {
            dispatchFilters({ text });
          }}
          value={filters.text || ""}
          searchIcon={<Ionicons name="search" size={22} color="gray" />}
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />
        <Button
          title="Cancel"
          type="clear"
          onPress={() => router.back()}
          titleStyle={{ color: "grey" }}
        />
      </SafeAreaView>

      <MapScreen />
      <FAB
        title="Filters"
        color="rgba(125,125,125,0.4)"
        style={{
          alignSelf: "center",
          position: "absolute",
          top: insets.top + 60,
        }}
      />
    </View>
  );
};
export default ExploreMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f5f5f5",
  },
  filterCard: {
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.11,
    marginBottom: 5,
  },
  priceRangeContainer: {
    width: 120,
    borderWidth: 1,
    // borderColor: "#ccc",
    borderRadius: 10,
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  searchBarContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    shadowOpacity: 0.11,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#000",
  },
  searchContainer: {
    flex: 1,
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingVertical: 0,
    paddingRight: 0,
  },
  searchInputContainer: {
    backgroundColor: "transparent",
  },
  searchInput: {
    backgroundColor: "transparent",
  },
});
