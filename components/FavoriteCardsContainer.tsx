import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";

import FavoriteCard from "./FavoriteCard";
import {
  getFavoriteFolderRequest,
  addFavoriteFolderRequest,
} from "../config/requests";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  card: {
    width: "50%",
  },
});

interface FavoriteCardsContainerProps {
  listingId?: string;
  toggleBottomSheetVisibility?: (value: boolean) => void;
}

const FavoriteCardsContainer: React.FunctionComponent<
  FavoriteCardsContainerProps
> = ({ listingId, toggleBottomSheetVisibility }) => {
  const [favoriteFolder, setFavoriteFolder] = useState([]);

  useEffect(() => {
    const loadFavoriteFolderFromStorage = async () => {
      try {
        const cachedData = await AsyncStorage.getItem("favoriteFolderData");
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setFavoriteFolder(parsedData);
        }
      } catch (error) {
        console.error("Error loading cached data: " + error);
      }
    };

    loadFavoriteFolderFromStorage();
  }, []);

  useEffect(() => {
    const getFavoriteFolder = async () => {
      const response = await getFavoriteFolderRequest();
      setFavoriteFolder(response.data);
      try {
        await AsyncStorage.setItem(
          "favoriteFolderData",
          JSON.stringify(response.data),
        );
      } catch (error) {
        console.error("Error saving data to AsyncStorage: " + error);
      }
    };
    getFavoriteFolder();
  }, [favoriteFolder]);

  useEffect(() => {
    if (!favoriteFolder) {
      const createDefaultFolder = async () => {
        const response = await addFavoriteFolderRequest("Default");
        setFavoriteFolder(response.data);
        try {
          await AsyncStorage.setItem(
            "favoriteFolderData",
            JSON.stringify([response.data]),
          );
        } catch (error) {
          console.error("Error saving data to AsyncStorage: " + error);
        }
      };
      createDefaultFolder();
    }
  }, [favoriteFolder]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.row}>
          {favoriteFolder && favoriteFolder.length > 0
            ? favoriteFolder.map((item, index) => (
                <View key={index} style={styles.card}>
                  <FavoriteCard
                    data={item}
                    listingId={listingId}
                    favoriteData={favoriteFolder}
                    toggleBottomSheetVisibility={toggleBottomSheetVisibility}
                  />
                </View>
              ))
            : null}
        </View>
      </ScrollView>
    </View>
  );
};

export default FavoriteCardsContainer;
