import { Text, View } from "@components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { Card, Image, CheckBox } from "@rneui/themed";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, Pressable } from "react-native";

type CardsComponentsProps = {
  data: {
    id: string;
    title: string;
    description: string;
    images: string[];
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
  const [ratio, setRatio] = useState(1);
  const onLayout = useCallback(() => {
    Image.getSize(data.images[0], (width, height) => {
      const ratio = width / height;
      if (ratio > 1.333) {
        setRatio(1.333);
      } else if (ratio < 0.75) {
        setRatio(0.75);
      } else {
        setRatio(width / height);
      }
    });
  }, []);
  const toggleCheckboxHandler = () => {
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
            onLayout={onLayout}
            style={{ ...styles.image, aspectRatio: ratio }}
            resizeMode="cover"
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
    borderRadius: 8,
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
