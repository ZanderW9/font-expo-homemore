import { View, Text } from "@components/Themed";
import { useSearchContext } from "@components/search/SearchProvider";
import { styles } from "@components/search/styles";
import { RangeSlider } from "@react-native-assets/slider";
import { Input } from "@rneui/themed";
import React from "react";

const PriceRange = (props: { setScrollEnabled: Function }) => {
  const { filters, dispatchFilters } = useSearchContext();
  const { setScrollEnabled } = props;
  return (
    <View style={styles.filterCard}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.titleStyle}>Price range </Text>
        {/* <View style={{ flexDirection: "row", alignItems: "center", top: -4 }}>
          <Text style={{ paddingRight: 5, color: "grey" }}>
            {filters.priceBy === "week" ? "pay by week" : "pay by night"}
          </Text>
          <Switch
            value={filters.priceBy === "week"}
            onValueChange={(value) => {
              dispatchFilters({
                priceBy: value ? "week" : "night",
              });
            }}
          />
        </View> */}
      </View>
      <RangeSlider
        inboundColor="rgb(236, 76, 96)"
        range={[filters.price?.gte || 0, filters.price?.lte || 1500]}
        onSlidingStart={() => setScrollEnabled(false)}
        onSlidingComplete={() => setScrollEnabled(true)}
        style={{ height: 50, marginTop: 10 }}
        minimumValue={0}
        maximumValue={1500}
        step={1}
        onValueChange={(range) => {
          dispatchFilters({
            price: { gte: range[0], lte: range[1] },
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
              const matches = text.match(/\d+/);
              const price = matches ? parseInt(matches[0], 10) : 0;
              dispatchFilters({
                price: {
                  gte: price,
                  lte: filters.price?.lte || 1500,
                },
              });
            }}
            value={`$ ${filters.price?.gte}`}
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
            value={`$ ${filters.price?.lte}`}
            onChangeText={(text) => {
              const matches = text.match(/\d+/);
              let price = matches ? parseInt(matches[0], 10) : 0;
              if (price > 1500) price = 1500;
              dispatchFilters({
                price: {
                  gte: filters.price?.gte || 0,
                  lte: price,
                },
              });
            }}
            inputContainerStyle={{
              margin: 0,
              padding: 0,
              borderBottomWidth: 0,
              width: 65,
            }}
            containerStyle={{
              padding: 0,
              margin: 0,
              height: 35,
              width: 65,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default PriceRange;
