import { SafeAreaView, View, Text } from "@components/Themed";
import { useSearchContext } from "@components/search/SearchProvider";
import { Ionicons } from "@expo/vector-icons";
import { RangeSlider } from "@react-native-assets/slider";
import { Button, SearchBar, Input, ButtonGroup } from "@rneui/themed";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";

export default function SearchView() {
  const { filters, onSearch, dispatchFilters } = useSearchContext();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  return (
    <View style={styles.container}>
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
        <Button title="Cancel" type="clear" onPress={() => router.back()} />
      </SafeAreaView>

      <ScrollView
        style={{ ...styles.container, padding: 5 }}
        scrollEnabled={scrollEnabled}
      >
        <View style={styles.filterCard}>
          <ButtonGroup
            containerStyle={{ borderRadius: 8 }}
            buttons={["Entire Place", "A Room", "Guesthouse/Inn"]}
            // selectedIndex={selectedIndex}
            // onPress={(value) => {
            //   setSelectedIndex(value);
            // }}
          />
          <Text style={styles.titleStyle}> </Text>
        </View>

        <View style={styles.filterCard}>
          <Text style={styles.titleStyle}>Price range (week) </Text>
          <RangeSlider
            inboundColor="rgb(236, 76, 96)"
            range={[
              parseInt(filters.price?.gte || "0", 10),
              parseInt(filters.price?.lte || "1500", 10),
            ]}
            onSlidingStart={() => setScrollEnabled(false)}
            onSlidingComplete={() => setScrollEnabled(true)}
            style={{ height: 50, marginTop: 10 }}
            minimumValue={0}
            maximumValue={1500}
            step={1}
            onValueChange={(range) => {
              dispatchFilters({
                price: { gte: range[0].toString(), lte: range[1].toString() },
              });
            }}
            thumbTintColor="white"
            thumbStyle={{
              width: 25,
              height: 25,
              borderRadius: 25,
              borderWidth: 0.4,
              borderColor: "#ccc",
            }}
          />

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              backgroundColor: "transparent",
            }}
          >
            <View style={styles.priceRangeContainer}>
              <Text
                style={{
                  paddingHorizontal: 10,
                  paddingTop: 3,
                  color: "gray",
                }}
              >
                Minimum
              </Text>
              <Input
                keyboardType="numeric"
                onChangeText={(text) => {
                  dispatchFilters({
                    price: {
                      gte: text,
                      lte: filters.price?.lte.toString() || "1500",
                    },
                  });
                }}
                value={filters.price?.gte.toString()}
                inputContainerStyle={{
                  margin: 0,
                  padding: 0,
                  borderBottomWidth: 0,
                }}
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  height: 35,
                }}
              />
            </View>
            <View style={styles.priceRangeContainer}>
              <Text
                style={{
                  paddingHorizontal: 10,
                  paddingTop: 3,
                  color: "gray",
                }}
              >
                Maximum
              </Text>
              <Input
                keyboardType="numeric"
                value={filters.price?.lte.toString()}
                onChangeText={(text) => {
                  dispatchFilters({
                    price: {
                      gte: filters.price?.gte.toString() || "0",
                      lte: text,
                    },
                  });
                }}
                inputContainerStyle={{
                  margin: 0,
                  padding: 0,
                  borderBottomWidth: 0,
                }}
                containerStyle={{
                  padding: 0,
                  margin: 0,
                  height: 35,
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.filterCard}>
          <Text style={styles.titleStyle}>Address </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    borderColor: "#ccc",
    borderRadius: 10,
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
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
