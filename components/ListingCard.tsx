import { GlobalContext } from "@app/_layout";
import { Text, View, TouchableOpacity } from "@components/Themed";
import AddModal from "@components/wishlist/AddModal";
import { useThemedColors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Card, CheckBox } from "@rneui/themed";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useContext, useRef } from "react";
import { StyleSheet } from "react-native";

type CardsComponentsProps = {
  data: {
    id: string;
    title: string;
    description: string;
    images: {
      smallUrl: string;
      thumbhash: string;
      ratio: number;
    };
    price: number;
    favorited: boolean;
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
  const { isLoggedIn } = useContext(GlobalContext);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const colors = useThemedColors();

  const toggleCheckboxHandler = () => {
    if (!isLoggedIn) {
      router.navigate("/signin");
    } else {
      bottomSheetModalRef.current?.present();
    }
  };

  const pressHandler = () => {
    router.navigate({
      pathname: `/detail/${data.id}`,
    });
  };

  const imageData = data?.images[0];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={pressHandler}
        style={{ backgroundColor: "transparent" }}
      >
        <Card
          containerStyle={{
            ...styles.cardContainer,
            backgroundColor: colors.back1,
          }}
        >
          <Image
            style={{ ...styles.image, aspectRatio: imageData.ratio || 1 }}
            placeholder={{ thumbhash: imageData.thumbhash }}
            source={{ uri: imageData.smallUrl }}
          />
          <View style={styles.cardContent}>
            <Card.Title style={styles.price}>
              <Text>${data.price}</Text>
            </Card.Title>
            <View style={styles.titleAndIconContainer}>
              <Ionicons
                name="location"
                size={13}
                color="black"
                style={styles.icon}
              />
              <Card.Title style={styles.address}>
                <Text>{data.address.city + ", " + data.address.state}</Text>
              </Card.Title>
            </View>
            <Card.Title style={styles.title} numberOfLines={2}>
              <Text> {data.title}</Text>
            </Card.Title>
            <Text style={styles.description} numberOfLines={3}>
              {data.description}
            </Text>
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={data.favorited}
              checkedIcon="heart"
              uncheckedIcon="heart-o"
              onPress={toggleCheckboxHandler}
              containerStyle={styles.checkbox}
              checkedColor="rgb(236, 76, 96)"
            />
          </View>
        </Card>
      </TouchableOpacity>

      <AddModal bottomSheetModalRef={bottomSheetModalRef} listingId={data.id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 3,
    borderRadius: 9,
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContainer: {
    margin: 0,
    padding: 0,
    borderRadius: 8,
    borderWidth: 0,
  },
  image: {
    width: "100%",
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  cardContent: {
    paddingHorizontal: 8,
    marginBottom: 8,
    borderWidth: 0,
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
    fontWeight: "400",
    marginBottom: 3,
    marginTop: 4,
    textAlign: "left",
  },
  title: {
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 1,
    marginTop: 1,
    marginRight: 2,
    textAlign: "left",
  },
  description: {
    fontSize: 12,
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
});

export default ListingCard;
