import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
} from "react-native";

import {
  removeFavoriteFolderRequest,
  addFavoriteToFolderRequest,
} from "../config/requests";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    width: "80%",
    height: "100%",
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  iconBackground: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 10,
  },
  icon: {
    fontSize: 70,
    color: "gray",
  },
  title: {
    fontSize: 13,
    color: "black",
    fontWeight: "400",
    marginBottom: 1,
    marginTop: 1,
    marginRight: 2,
    marginLeft: 2,
    textAlign: "left",
    padding: 8,
  },
  deleteIcon: {
    fontSize: 28,
    color: "gray",
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
});

type FavoriteCardProps = {
  data: string;
  listingId: string;
};

const FavoriteCardOfBottomSheet: React.FunctionComponent<FavoriteCardProps> = ({
  data,
  listingId,
}) => {
  const [isDeleteButtonVisible, setIsDeleteButtonVisible] = useState(false);

  const pressHandler = async () => {
    if (isDeleteButtonVisible) {
      setIsDeleteButtonVisible(false);
    } else {
      const body = {
        listingId,
        folderName: data,
      };
      await addFavoriteToFolderRequest(body);
      //
    }
  };

  const handleLongPress = () => {
    Vibration.vibrate([10, 10], false);
    setIsDeleteButtonVisible(true);
    AsyncStorage.setItem(
      `favoriteCard:${data}`,
      JSON.stringify({ isDeleteButtonVisible: true }),
    );
  };

  const handleDelete = () => {
    setIsDeleteButtonVisible(false);
    removeFavoriteFolderRequest(data);
    AsyncStorage.removeItem(`favoriteCard:${data}`);
  };

  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cachedData = await AsyncStorage.getItem(`favoriteCard:${data}`);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setIsDeleteButtonVisible(parsedData.isDeleteButtonVisible);
        }
      } catch (error) {
        console.error("Error loading cached data: " + error);
      }
    };
    loadCachedData();
  }, [data]);

  return (
    <TouchableOpacity
      onPress={pressHandler}
      onLongPress={handleLongPress}
      style={styles.container}
    >
      <View style={styles.cardContainer}>
        {isDeleteButtonVisible ? (
          <View style={styles.iconContainer}>
            <Ionicons
              name="md-close-outline"
              style={styles.deleteIcon}
              onPress={handleDelete}
            />
            <View style={styles.iconBackground}>
              <Ionicons name="heart" style={styles.icon} />
            </View>
          </View>
        ) : (
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Ionicons name="heart" style={styles.icon} />
            </View>
          </View>
        )}

        <Text style={styles.title}>{data}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default FavoriteCardOfBottomSheet;
