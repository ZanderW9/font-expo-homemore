import { View, Text, TouchableOpacity } from "@components/Themed";
import { useSearchContext } from "@components/search/SearchProvider";
import { styles } from "@components/search/styles";
import { useThemedColors } from "@constants/theme";
import {
  MaterialCommunityIcons,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import React from "react";

const AmenitiesFilters = () => {
  const colors = useThemedColors();
  const { filters, dispatchFilters } = useSearchContext();

  const amenities = [
    {
      name: "Wi-Fi",
      value: "Wi-Fi",
      icon: <FontAwesome6 name="wifi" size={24} color={colors.text} />,
    },

    {
      name: "Air Conditioner",
      value: "airConditioner",
      icon: <Ionicons name="snow" size={26} color={colors.text} />,
    },
    {
      name: "Fridge",
      value: "fridge",
      icon: (
        <MaterialCommunityIcons
          name="fridge-outline"
          size={28}
          color={colors.text}
        />
      ),
    },
    {
      name: "Washer",
      value: "washingMachine",
      icon: (
        <MaterialCommunityIcons
          name="washing-machine"
          size={28}
          color={colors.text}
        />
      ),
    },
    {
      name: "Kitchen",
      value: "kitchen",
      icon: <FontAwesome6 name="kitchen-set" size={24} color={colors.text} />,
    },
    {
      name: "Bath Tub",
      value: "bathTub",
      icon: (
        <MaterialCommunityIcons
          name="bathtub-outline"
          size={26}
          color={colors.text}
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
        Amenities you want
      </Text>

      <FlashList
        estimatedItemSize={100}
        data={amenities}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              const newAmenities = filters.devices?.includes(item.value)
                ? filters.devices?.filter((amenity) => amenity !== item.value)
                : [...(filters.devices || []), item.value];
              dispatchFilters({
                devices: newAmenities,
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
                borderColor: filters.devices?.includes(item.value)
                  ? "#888"
                  : colors.border1,
                height: 85,
                backgroundColor: filters.devices?.includes(item.value)
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
    </View>
  );
};

export default AmenitiesFilters;
