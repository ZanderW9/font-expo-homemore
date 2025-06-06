import { View } from "@components/Themed";
import { useCreateListingContext } from "@components/listing/create/CreateProvider";
import * as Location from "expo-location";
import { Stack, router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

function SearchLocation() {
  const { listingData, dispatchListingData } = useCreateListingContext();
  const inputRef = useRef(null);
  inputRef.current?.focus();

  const [currentPlace, setCurrentPlace] = useState({
    description: "Current location",
    geometry: {
      location: {
        lat: 0,
        lng: 0,
      },
    },
  });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setCurrentPlace({
        description: "Current location",
        geometry: {
          location: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          },
        },
      });
    })();
  }, []);

  const getGeolocationAddress = async (lat, lng) => {
    const location = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    });
    dispatchListingData({
      address: {
        street: location[0].name,
        city: location[0].city,
        state: location[0].region,
        postCode: location[0].postalCode,
        country: location[0].country,
      },
      searchHistory: [
        ...listingData.searchHistory,
        {
          description: `${location[0].name}, ${location[0].city}, ${location[0].region}, ${location[0].country}`,
          geometry: { location: { lat, lng } },
        },
      ],
    });
  };
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerShown: false,
        }}
      />
      <GooglePlacesAutocomplete
        ref={inputRef}
        placeholder="Search your address"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          if (data.description === "Current location") {
            getGeolocationAddress(
              currentPlace.geometry.location.lat,
              currentPlace.geometry.location.lng,
            );
          } else {
            const cityStateLength = data.description
              .split(",")[1]
              .split(" ").length;

            dispatchListingData({
              address: {
                street: data.description.split(",")[0],
                city: data.description
                  .split(",")[1]
                  .split(" ")
                  .slice(1, -1)
                  .join(" "),
                state: data.description.split(",")[1].split(" ")[
                  cityStateLength - 1
                ],
                country: data.description.split(",")[2].replace(" ", ""),
              },
              searchHistory: [
                ...listingData.searchHistory,
                {
                  description: data.description,
                  geometry: details.geometry,
                },
              ],
            });
          }
          router.navigate({
            pathname: "/listing/input-location",
          });
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        query={{
          key: "AIzaSyDq3UkkY4zOP1O-Dwa58IzxGXyZBU_lV5w",
          language: "en",
          components: "country:au",
          types: "address",
        }}
        predefinedPlaces={[currentPlace, ...listingData.searchHistory]}
        enablePoweredByContainer={false}
        listViewDisplayed="auto"
        fetchDetails
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 80,
    backgroundColor: "#ecf0f1",
  },
  safeArea: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingBottom: 0,
  },
  title: {
    fontSize: 25,
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    paddingBottom: 10,
  },
  historyContainer: {
    marginTop: 20,
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default SearchLocation;
