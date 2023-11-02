import ListingCard from "@components/ListingCard";
import { View } from "@components/Themed";
import { getFavoriteDetailsOfFolderRequest } from "@config/requests";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MasonryList from "@react-native-seoul/masonry-list";
import { useLocalSearchParams, Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function MyFavoritesScreen() {
  const { favorites } = useLocalSearchParams();
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    const loadFavoriteList = async () => {
      try {
        const body = {
          folderName: favorites,
        };
        const response = await getFavoriteDetailsOfFolderRequest(body);
        if (response.ok) {
          setAllData(response.data.listings);
          await AsyncStorage.setItem(
            `cachedFavoriteList${favorites}`,
            JSON.stringify(response.data.listings),
          );
        } else {
          console.log("Error loading data: " + response.error);
        }
      } catch (error) {
        console.error("An error occurred: " + error);
      }
    };
    loadFavoriteList();
  }, []);

  useEffect(() => {
    const loadCachedFavoriteList = async () => {
      const cachedData = await AsyncStorage.getItem(
        `cachedFavoriteList${favorites}`,
      );
      if (cachedData) {
        setAllData(JSON.parse(cachedData));
      }
    };
    loadCachedFavoriteList();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: favorites }} />
      <MasonryList
        style={styles.container}
        data={allData}
        numColumns={1}
        renderItem={({ item }) => <ListingCard data={item} />}
        onEndReachedThreshold={0.1}
        horizontal={false}
      />
    </View>
  );
}

export default MyFavoritesScreen;
