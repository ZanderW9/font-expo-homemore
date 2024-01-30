import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from "@components/Themed";
import { useSearchContext } from "@components/search/SearchProvider";
import { Ionicons } from "@expo/vector-icons";
import { Button, SearchBar } from "@rneui/themed";
import { router } from "expo-router";
import React, { useState } from "react";

import AmenitiesFilters from "./filters/AmenitiesFilters";
import PriceRange from "./filters/PriceRange";
import PropertyTypeFilters from "./filters/PropertyTypeFilters";
import { styles } from "./styles";

export default function SearchView() {
  const { filters, onSearch, dispatchFilters, clearFilters } =
    useSearchContext();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
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

      <ScrollView
        style={{ ...styles.container, padding: 5 }}
        theme={{ background: "back2" }}
        scrollEnabled={scrollEnabled}
      >
        <PropertyTypeFilters />

        <PriceRange setScrollEnabled={setScrollEnabled} />

        <AmenitiesFilters />
      </ScrollView>

      <KeyboardAvoidingView
        behavior="padding"
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          paddingTop: 5,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -10,
          },
          shadowOpacity: 0.03,
          borderTopWidth: 0.25,
        }}
      >
        <Button
          title="Clear all"
          type="clear"
          titleStyle={{ color: "gray" }}
          onPress={clearFilters}
          buttonStyle={{ width: 100, marginBottom: 5 }}
        />
        <Button
          title="Search"
          onPress={onSearch}
          color="rgb(236, 76, 96)"
          buttonStyle={{ width: 150, borderRadius: 8, marginBottom: 5 }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
