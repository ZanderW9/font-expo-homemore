import {
  removeFavoriteFolderRequest,
  addFavoriteToFolderRequest,
} from "@config/requests";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, usePathname } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  cardContainer: {
    height: 200,
    padding: 10,
    backgroundColor: "white",
    overflow: "hidden",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  iconBackground: {
    height: 160,
  },
  icon: {
    fontSize: 70,
    color: "gray",
    position: "absolute",
    marginTop: 35,
    marginLeft: -35,
  },
  title: {
    fontSize: 13,
    color: "black",
    fontWeight: "400",
    textAlign: "left",
    paddingTop: 8,
  },
  deleteIcon: {
    fontSize: 28,
    color: "red",
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    position: "absolute",
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 28,
    zIndex: 1,
  },
});

type FavoriteCardProps = {
  data: string;
  listingId: string;
  favoriteData: any;
  toggleBottomSheetVisibility: (value: boolean) => void;
};

const FavoriteCard: React.FunctionComponent<FavoriteCardProps> = ({
  data,
  listingId,
  toggleBottomSheetVisibility,
}) => {
  const pathname = usePathname();
  const [isDeleteButtonVisible, setIsDeleteButtonVisible] = useState(false);
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

  const pressHandler = async () => {
    // router.push("/detail/" + data._id);
    if (isDeleteButtonVisible) {
      setIsDeleteButtonVisible(false);
      AsyncStorage.setItem(
        `favoriteCard:${data}`,
        JSON.stringify({ isDeleteButtonVisible: false }),
      );
    } else {
      if (pathname === "/wishlist") {
        router.push(`/wishlist/${data}`);
      } else if (pathname === "/") {
        toggleBottomSheetVisibility(false);
        const body = {
          listingId,
          folderName: data,
        };
        await addFavoriteToFolderRequest(body);
      }
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

  return (
    <TouchableOpacity
      onPress={pressHandler}
      onLongPress={handleLongPress}
      style={styles.container}
    >
      <View style={styles.cardContainer}>
        {isDeleteButtonVisible ? (
          <View style={{ ...styles.iconContainer, borderColor: "red" }}>
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

export default FavoriteCard;
