import { Text, View } from "@components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { Card, Image, CheckBox } from "@rneui/themed";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Pressable } from "react-native";

type CardsComponentsProps = {
  data: {
    id: string;
    title: string;
    description: string;
    images: any[];
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
  // const [favoriteBottomSheet, setFavoriteBottomSheet] = useState(false);
  const toggleCheckboxHandler = () => {
    // setFavoriteBottomSheet(!favoriteBottomSheet);
    router.push({ pathname: "/addwishlist", params: { listingId: data.id } });
  };

  const pressHandler = () => {
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
          <View style={styles.cardContent}>
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
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 3,
    borderRadius: 9,
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContainer: {
    width: "100%",
    flex: 1,
    margin: 0,
    padding: 0,
    borderRadius: 8,
    borderWidth: 0,
  },
  cardContent: {
    paddingHorizontal: 8,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 0,
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
    marginBottom: 3,
    marginTop: 4,
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
    borderRadius: 7,
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
});

export default ListingCard;
