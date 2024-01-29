import { View, Text } from "@components/Themed";
import { useSearchContext } from "@components/search/SearchProvider";
import { styles } from "@components/search/styles";
import {
  MaterialCommunityIcons,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { TouchableOpacity } from "react-native";

const AmenitiesFilters = (props: any) => {
  const { filters, dispatchFilters } = useSearchContext();

  const amenities = [
    {
      name: "Wifi",
      value: "wifi",
      icon: <FontAwesome6 name="wifi" size={24} color="black" />,
    },

    {
      name: "Air Conditioner",
      value: "airConditioner",
      icon: <Ionicons name="snow" size={26} color="black" />,
    },
    {
      name: "Fridge",
      value: "fridge",
      icon: (
        <MaterialCommunityIcons name="fridge-outline" size={28} color="black" />
      ),
    },
    {
      name: "Washer",
      value: "washer",
      icon: (
        <MaterialCommunityIcons
          name="washing-machine"
          size={28}
          color="black"
        />
      ),
    },
    {
      name: "Kitchen",
      value: "kitchen",
      icon: <FontAwesome6 name="kitchen-set" size={24} color="black" />,
    },
    {
      name: "Bath Tub",
      value: "bathTub",
      icon: (
        <MaterialCommunityIcons
          name="bathtub-outline"
          size={26}
          color="black"
        />
      ),
    },
  ];

  return (
    <View
      style={{
        ...styles.filterCard,
        paddingHorizontal: 10,
        paddingBottom: 10,
        flex: 1,
        minHeight: 100,
        minWidth: 100,
      }}
    >
      <Text
        style={{
          ...styles.titleStyle,
          paddingHorizontal: 5,
          marginBottom: 10,
        }}
      >
        Amenities you want{" "}
      </Text>

      <FlashList
        estimatedItemSize={95}
        data={amenities}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              const newAmenities = filters.amenities?.includes(item.value)
                ? filters.amenities?.filter((amenity) => amenity !== item.value)
                : [...(filters.amenities || []), item.value];
              dispatchFilters({
                amenities: newAmenities,
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
                maxWidth: 130,
                borderWidth: 1,
                borderRadius: 8,
                paddingBottom: 5,
                paddingTop: 6,
                borderColor: filters.amenities?.includes(item.value)
                  ? "#888"
                  : "#ccc",
                height: 85,
                backgroundColor: filters.amenities?.includes(item.value)
                  ? "#f5f5f5"
                  : "white",
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
    </View>
  );
};

export default AmenitiesFilters;
