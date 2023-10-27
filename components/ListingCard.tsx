import { Ionicons } from "@expo/vector-icons";
import { Card, Image, CheckBox } from "@rneui/themed";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Pressable } from "react-native";

import { Text, View } from "./Themed";
// import FavoriteCardsContainer from "./wishlist/FavoriteCardsContainer";
// import {
//   addFavoriteFolderRequest,
//   addFavoriteToFolderRequest,
// } from "../config/requests";

type CardsComponentsProps = {
  data: {
    id: string;
    title: string;
    description: string;
    images: any[];
    price: number;
    address: {
      state: string;
      city: string;
      street: string;
    };
  };
};

const ListingCard: React.FunctionComponent<CardsComponentsProps> = ({
  data,
}) => {
  const [checked, setChecked] = useState(false);
  const [favoriteBottomSheet, setFavoriteBottomSheet] = useState(false);
  // const [createFavoriteFolder, setCreateFavoriteFolder] = useState(false);
  // const [favoriteFolderName, setFavoriteFolderName] = useState("");

  // const toggleBottomSheetVisibility = (isVisible: boolean) => {
  //   setFavoriteBottomSheet(isVisible);
  // };

  const toggleCheckboxHandler = () => {
    setFavoriteBottomSheet(!favoriteBottomSheet);
    setChecked(!checked);
    router.push({ pathname: "/addwishlist", params: { listingId: data.id } });
  };

  const pressHandler = () => {
    // router.push("/detail/" + data._id);
    router.push(`/detail/${data.id}`);
  };
  return (
    <View style={styles.container}>
      <Pressable onPress={pressHandler}>
        <Card containerStyle={styles.cardContainer}>
          <Image
            style={styles.image}
            containerStyle={styles.item}
            source={{ uri: data.images[0] }}
          />
          <Card.Title style={styles.price}>${data.price}</Card.Title>
          <View style={styles.titleAndIconContainer}>
            <Ionicons
              name="location"
              size={13}
              color="black"
              style={styles.icon}
            />
            <Card.Title style={styles.address}>
              {data.address.city + ", " + data.address.state}
            </Card.Title>
          </View>
          <Card.Title style={styles.title} numberOfLines={2}>
            {data.title}
          </Card.Title>
          <Text style={styles.description} numberOfLines={3}>
            {data.description}
          </Text>
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={checked}
              checkedIcon="heart"
              uncheckedIcon="heart-o"
              onPress={toggleCheckboxHandler}
              containerStyle={styles.checkbox}
              checkedColor="rgb(236, 76, 96)"
            />
          </View>
        </Card>
      </Pressable>
    </View>
  );
};

// const addFavoriteFolderHandler = () => {
//   setFavoriteBottomSheet(false);
//   setCreateFavoriteFolder(true);
// };

// const backDropHandler = () => {
//   setFavoriteBottomSheet(false);
//   setCreateFavoriteFolder(false);
//   setChecked(false);
// };

// const createFavoriteFolderHandler = async () => {
//   if (favoriteFolderName === "") {
//     return;
//   }
//   const response = await addFavoriteFolderRequest(favoriteFolderName);
//   if (response.ok) {
//     setCreateFavoriteFolder(false);
//     setFavoriteBottomSheet(false);
//     const body = {
//       listingId: data.id,
//       folderName: favoriteFolderName,
//     };
//     addFavoriteToFolderRequest(body);
//   }
// };

// const goBackHome = () => {
//   setFavoriteBottomSheet(false);
//   setCreateFavoriteFolder(false);
// };

// const goBack = () => {
//   setCreateFavoriteFolder(false);
//   setFavoriteBottomSheet(true);
// };

{
  /* {createFavoriteFolder ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.bottomSheetContent}
        >
          <BottomSheet
            modalProps={{
              animationType: "slide",
              transparent: true,
              statusBarTranslucent: false,
            }}
            isVisible={createFavoriteFolder}
            onBackdropPress={backDropHandler}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color="black"
              style={styles.backButton}
              onPress={goBack}
            />
            <View style={styles.bottomSheetContent}>
              <Text style={styles.BottomSheetTitle}>Create a wish list</Text>
              <Input
                placeholder="Name"
                onChangeText={(text) => setFavoriteFolderName(text)}
              />
              <Button
                size="lg"
                radius="sm"
                type="solid"
                containerStyle={{
                  width: 150,
                  alignSelf: "center",
                }}
                onPress={createFavoriteFolderHandler}
              >
                Create
              </Button>
            </View>
          </BottomSheet>
        </KeyboardAvoidingView>
      ) : (
        <BottomSheet
          modalProps={{
            animationType: "slide",
            transparent: true,
            statusBarTranslucent: false,
          }}
          isVisible={favoriteBottomSheet}
          onBackdropPress={backDropHandler}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color="black"
            style={styles.backButton}
            onPress={goBackHome}
          />
          <View style={styles.bottomSheetContent}>
            <Text style={styles.BottomSheetTitle}>Add to Wishlist</Text>
            <FavoriteCardsContainer
              listingId={data.id}
              toggleBottomSheetVisibility={toggleBottomSheetVisibility}
            />
            <Button
              size="lg"
              radius="sm"
              type="solid"
              containerStyle={{
                width: 250,
                alignSelf: "center",
              }}
              onPress={addFavoriteFolderHandler}
            >
              Create New Wish List
            </Button>
          </View>
        </BottomSheet>
      )} */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    width: "100%",
    flex: 1,
    margin: 0,
    padding: 0.5,
    borderRadius: 10,
  },
  item: {
    aspectRatio: 1,
    width: "100%",
    flex: 1,
  },
  icon: {
    marginRight: 0,
    marginLeft: 0,
    marginTop: -14,
    marginBottom: 0,
    color: "#1e88e5",
  },
  address: {
    fontSize: 13,
  },
  titleAndIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: -13,
  },
  price: {
    fontSize: 15,
    color: "black",
    fontWeight: "400",
    marginBottom: 1,
    marginTop: 1,
    marginRight: 2,
    marginLeft: 2,
    textAlign: "left",
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
  },
  image: {
    aspectRatio: 1,
    width: "100%",
    flex: 1,
    resizeMode: "cover",
    borderRadius: 10,
  },
  description: {
    fontSize: 12,
    color: "black",
    marginBottom: 1,
    marginTop: 1,
    marginRight: 2,
    marginLeft: 2,
    textAlign: "left",
  },
  checkboxContainer: {
    position: "absolute",
    top: 0,
    right: -8,
    zIndex: 1,
    backgroundColor: "transparent",
  },
  checkbox: {
    margin: 0,
    backgroundColor: "transparent",
  },
  // bottomSheetContent: {
  //   backgroundColor: "white",
  //   paddingBottom: 25,
  //   paddingTop: 10,
  //   borderRadius: 10,
  // },
  // BottomSheetTitle: {
  //   fontSize: 18,
  //   fontWeight: "700",
  //   marginBottom: 10,
  //   marginTop: 10,
  //   textAlign: "center",
  // },
  // backButton: {
  //   position: "absolute",
  //   top: 5,
  //   left: 5,
  //   zIndex: 1,
  // },
});

export default ListingCard;
