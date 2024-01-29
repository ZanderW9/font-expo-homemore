import { View, Text } from "@components/Themed";
import { useSearchContext } from "@components/search/SearchProvider";
import { styles } from "@components/search/styles";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { CheckBox } from "@rneui/themed";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { TouchableOpacity } from "react-native";

const PropertyTypeFilters = (props: any) => {
  const { filters, dispatchFilters } = useSearchContext();
  const propertyTypes = [
    {
      name: "Apartment",
      value: "apartment",
      icon: <MaterialIcons name="apartment" size={30} color="black" />,
    },
    {
      name: "House",
      value: "house",
      icon: (
        <MaterialCommunityIcons name="greenhouse" size={30} color="black" />
      ),
    },
  ];

  const placeTypes = [
    {
      name: <Text style={{ width: 75 }}>Entire Place</Text>,
      value: "entire",
    },
    {
      name: <Text style={{ width: 36 }}>Room</Text>,
      value: "room",
    },
  ];

  const serviceTypes = [
    {
      name: <Text style={{ width: 75 }}>Travel</Text>,
      value: "travel",
    },
    {
      name: <Text style={{ width: 36 }}>Rent</Text>,
      value: "rent",
    },
  ];

  return (
    <View
      style={{
        ...styles.filterCard,
        paddingHorizontal: 10,
        paddingBottom: 10,
        flex: 1,
        minHeight: 200,
        minWidth: 200,
      }}
    >
      <Text
        style={{
          ...styles.titleStyle,
          paddingHorizontal: 5,
          marginBottom: 10,
        }}
      >
        Property Type
      </Text>

      <FlashList
        estimatedItemSize={95}
        data={propertyTypes}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              dispatchFilters({
                propertyType: item.value,
              });
            }}
            style={{
              alignItems: "center",
              width: "100%",
              padding: 5,
            }}
          >
            <View
              style={{
                alignItems: "center",
                minWidth: 80,
                width: "100%",
                maxWidth: 200,
                borderWidth: 1,
                borderRadius: 8,
                paddingBottom: 5,
                paddingTop: 6,
                borderColor:
                  filters.propertyType === item.value ? "#888" : "#ccc",
                height: 85,
                backgroundColor:
                  filters.propertyType === item.value ? "#f5f5f5" : "white",
              }}
            >
              <View
                style={{
                  margin: 5,
                  height: 30,
                  justifyContent: "center",
                  backgroundColor: "transparent",
                }}
              >
                {item.icon}
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  backgroundColor: "transparent",
                }}
              >
                <Text style={{ textAlign: "center" }}>{item.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.name}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 5,
          paddingTop: 10,
        }}
      >
        <Text style={styles.titleStyle}>Place Type</Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {placeTypes.map((item) => {
            return (
              <TouchableOpacity
                key={item.value}
                onPress={() => {
                  dispatchFilters({
                    placeType: item.value,
                  });
                }}
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  padding: 0,
                  minWidth: 80,
                }}
              >
                <CheckBox
                  checkedColor="rgb(236, 76, 96)"
                  containerStyle={{ margin: 0, padding: 0 }}
                  checked={filters.placeType === item.value}
                  onPress={() => {
                    dispatchFilters({
                      placeType: item.value,
                    });
                  }}
                />
                {item.name}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 5,
          paddingTop: 10,
          paddingBottom: 5,
        }}
      >
        <Text style={{ ...styles.titleStyle, marginVertical: 0 }}>
          Service Type
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {serviceTypes.map((item) => {
            return (
              <TouchableOpacity
                key={item.value}
                onPress={() => {
                  dispatchFilters({
                    placeType: item.value,
                  });
                }}
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  padding: 0,
                  minWidth: 80,
                }}
              >
                <CheckBox
                  checkedColor="rgb(236, 76, 96)"
                  containerStyle={{ margin: 0, padding: 0 }}
                  checked={filters.serviceType === item.value}
                  onPress={() => {
                    dispatchFilters({
                      serviceType: item.value,
                    });
                  }}
                />
                {item.name}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default PropertyTypeFilters;
