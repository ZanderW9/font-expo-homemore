import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";

import {
  getFavoriteFolderRequest,
  addFavoriteFolderRequest,
} from "../config/requests";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    marginHorizontal: 5,
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
  FavoriteCardComponent: any;
  listingId?: string;
}

const FavoriteCardsContainer: React.FunctionComponent<
  FavoriteCardsContainerProps
> = ({ FavoriteCardComponent, listingId }) => {
  const [favoriteFolder, setFavoriteFolder] = useState([]);

  useEffect(() => {
    const getFavoriteFolder = async () => {
      const response = await getFavoriteFolderRequest();
      setFavoriteFolder(response.data);
    };
    getFavoriteFolder();
  }, [favoriteFolder]);

  useEffect(() => {
    if (!favoriteFolder) {
      const createDefaultFolder = async () => {
        const response = await addFavoriteFolderRequest("Default");
        setFavoriteFolder(response.data);
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
                  <FavoriteCardComponent data={item} listingId={listingId} />
                </View>
              ))
            : null}
        </View>
      </ScrollView>
    </View>
  );
};

export default FavoriteCardsContainer;
