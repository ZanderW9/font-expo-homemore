import { Text, View, TouchableOpacity } from "@components/Themed";
import AddModal from "@components/wishlist/AddModal";
import { useThemedColors } from "@constants/theme";
import { Fontisto } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Card, CheckBox } from "@rneui/themed";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useRef } from "react";
import { StyleSheet } from "react-native";

import { RootState, useSelector } from "@/config/state/store";

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
    serviceType: string;
    discount: {
      discountType: string;
      discountValue: number;
    }[];
  };
};

const ListingCard: React.FunctionComponent<CardsComponentsProps> = ({
  data,
}) => {
  const token = useSelector((state: RootState) => state.appMeta.token);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const colors = useThemedColors();
  const weekDiscount = data?.discount?.find(
    (discount: any) => discount.discountType === "week",
  );
  const weekPrice = weekDiscount
    ? (data?.price * 7 * (1 - weekDiscount.discountValue / 100)).toFixed()
    : data?.price * 7;

  const toggleCheckboxHandler = () => {
    if (!token) {
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
            style={{ ...styles.image, aspectRatio: imageData?.ratio || 1 }}
            placeholder={{ thumbhash: imageData?.thumbhash }}
            source={{ uri: imageData?.smallUrl }}
          />
          <View style={styles.cardContent}>
            <Card.Title style={styles.title} numberOfLines={1}>
              <Text> {data.title}</Text>
            </Card.Title>

            <Text style={styles.description} numberOfLines={2}>
              {data.address.city + ", " + data.address.state}
            </Text>

            <Text style={styles.description} numberOfLines={2}>
              {data.description}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Fontisto
                name="dollar"
                size={12}
                color={colors.text}
                style={{ marginRight: -5 }}
              />
              <Text
                style={{
                  fontSize: 15,
                  color: colors.text,
                  marginLeft: 5,
                }}
              >
                {data
                  ? data?.serviceType === "rent"
                    ? weekPrice
                    : data?.price
                  : 0}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textSub1Reverse,
                  marginLeft: 5,
                }}
              >
                {data?.serviceType === "rent" ? "/ week" : "/ night"}
              </Text>
            </View>

            {data?.serviceType === "rent" && (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "flex-start",
                  flexDirection: "row",
                }}
              >
                <Fontisto
                  name="dollar"
                  size={7}
                  color={colors.textSub1Reverse}
                  style={{ marginRight: 1 }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    color: colors.textSub1Reverse,
                  }}
                >
                  {data?.price} / night
                </Text>
              </View>
            )}
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
    paddingTop: 8,
    marginBottom: 8,
    borderWidth: 0,
  },
  icon: {
    marginRight: 0,
    marginLeft: -5,
    marginTop: -12,
    marginBottom: 0,
    color: "#1e88e5",
  },
  address: {
    fontSize: 12,
    marginBottom: 1,
    marginTop: 1,
    marginRight: 2,
    textAlign: "left",
  },
  titleAndIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: -13,
  },
  price: {
    fontSize: 14,
    marginBottom: 3,
    marginTop: 4,
    textAlign: "left",
  },
  title: {
    fontSize: 14,
    marginBottom: 1,
    marginTop: 1,
    marginRight: 2,
    marginLeft: -3,
    textAlign: "left",
  },
  description: {
    fontSize: 12,
    marginBottom: 1,
    marginTop: 1,
    marginRight: 2,
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
