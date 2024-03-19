import { View, Text } from "@components/Themed";
import { useSearchContext } from "@components/search/SearchProvider";
import { styles } from "@components/search/styles";
import { useThemedColors } from "@constants/theme";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { CheckBox } from "@rneui/themed";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { TouchableOpacity } from "react-native";

const PropertyTypeFilters = () => {
  const colors = useThemedColors();
  const { filters, dispatchFilters } = useSearchContext();
  const placeTypes = [
    {
      name: "Apartment",
      value: "apartment",
      icon: <MaterialIcons name="apartment" size={30} color={colors.text} />,
    },
    {
      name: "House",
      value: "house",
      icon: (
        <MaterialCommunityIcons
          name="greenhouse"
          size={30}
          color={colors.text}
        />
      ),
    },
    {
      name: "Unit",
      value: "unit",
      icon: (
        <MaterialCommunityIcons
          name="home-modern"
          size={30}
          color={colors.text}
        />
      ),
    },
  ];

  const rentTypes = [
    {
      name: <Text style={{ width: 80 }}>Entire Place</Text>,
      value: "anEntirePlace",
    },
    {
      name: <Text style={{ width: 40 }}>Room</Text>,
      value: "aRoom",
    },
  ];

  const serviceTypes = [
    {
      name: <Text style={{ width: 80 }}>Travel</Text>,
      value: "travel",
    },
    {
      name: <Text style={{ width: 40 }}>Rent</Text>,
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
        estimatedItemSize={100}
        data={placeTypes}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              dispatchFilters({
                placeType: item.value,
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
                  filters.placeType === item.value ? "#888" : colors.border1,
                height: 85,
                backgroundColor:
                  filters.placeType === item.value
                    ? colors.back2
                    : colors.back1,
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
          {rentTypes.map((item) => {
            return (
              <TouchableOpacity
                key={item.value}
                onPress={() => {
                  dispatchFilters({
                    rentType: item.value,
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
                  containerStyle={{
                    margin: 0,
                    padding: 0,
                    backgroundColor: "transparent",
                  }}
                  checked={filters.rentType === item.value}
                  onPress={() => {
                    dispatchFilters({
                      rentType: item.value,
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
                    serviceType: item.value,
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
                  containerStyle={{
                    margin: 0,
                    padding: 0,
                    backgroundColor: "transparent",
                  }}
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
