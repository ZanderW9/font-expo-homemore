import { gql, useMutation } from "@apollo/client";
import { Text, View, Pressable, TouchableOpacity } from "@components/Themed";
import AddModal from "@components/wishlist/AddModal";
import { useThemedColors } from "@constants/theme";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Card, CheckBox } from "@rneui/themed";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState, useRef } from "react";
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

const modifyPublishMutation = gql`
  mutation Mutation($modifyPublishId: String!, $published: Boolean!) {
    modifyPublish(id: $modifyPublishId, published: $published) {
      id
    }
  }
`;

const meQuery = gql`
  query Query {
    me {
      id
      myPublishedListings {
        id
        title
        description
        images {
          smallUrl
          thumbhash
          ratio
        }
        price
        favorited
        address
      }
      myUnPublishedListings {
        id
        title
        description
        images {
          smallUrl
          thumbhash
          ratio
        }
        price
        address
      }
    }
  }
`;

const PublishedCard: React.FunctionComponent<CardsComponentsProps> = ({
  data,
}) => {
  const colors = useThemedColors();
  const [modifyPublishFunction] = useMutation(modifyPublishMutation);

  const [showOptions, setShowOptions] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const imageData = data.images[0];

  const onImagePress = () => {
    setShowOptions(true);
  };

  const closeOptions = () => {
    setShowOptions(false);
  };

  const editHandler = () => {
    router.navigate({
      pathname: "/createlisting",
      params: { listingId: data.id },
    });
    closeOptions();
  };

  const unpublishHandler = () => {
    modifyPublishFunction({
      variables: {
        modifyPublishId: data.id,
        published: false,
      },
      refetchQueries: [{ query: meQuery }],
    });
    closeOptions();
  };

  const viewHandler = () => {
    router.navigate({
      pathname: `/detail/${data.id}`,
    });
  };

  const toggleCheckboxHandler = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onLongPress={onImagePress}
        onPress={viewHandler}
        style={{ borderRadius: 15 }}
      >
        <Card
          containerStyle={[
            styles.cardContainer,
            { backgroundColor: colors.back1 },
          ]}
        >
          <Image
            source={{ uri: imageData.smallUrl }}
            placeholder={{ thumbhash: imageData.thumbhash }}
            style={{ ...styles.image, aspectRatio: imageData.ratio }}
            contentFit="cover"
          />
          <View style={styles.cardContent}>
            <View style={styles.titleAndIconContainer}>
              <Ionicons name="location" size={13} style={styles.icon} />
              <Card.Title style={styles.address} numberOfLines={2}>
                <Text>{data.address.city + ", " + data.address.state}</Text>
              </Card.Title>
            </View>
            <Card.Title style={styles.title} numberOfLines={1}>
              <Text> {data.title}</Text>
            </Card.Title>
            <Text style={styles.description} numberOfLines={2}>
              {data.description}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <FontAwesome name="dollar" size={13} color={colors.mainColor} />
              <Card.Title style={styles.price}>
                <Text style={{ color: colors.mainColor }}>{data.price}</Text>
              </Card.Title>
            </View>
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
          {showOptions && (
            <Pressable style={styles.overlay} onPress={closeOptions}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={editHandler}
              >
                <Text style={styles.optionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={unpublishHandler}
              >
                <Text style={styles.optionText}>Unpublish</Text>
              </TouchableOpacity>
            </Pressable>
          )}
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
    position: "relative",
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
    marginLeft: -5,
    marginTop: -12,
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
    fontSize: 14,
    marginBottom: 3,
    marginTop: 4,
    textAlign: "left",
  },
  title: {
    fontSize: 14,
    fontWeight: "400",
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
  overlay: {
    ...StyleSheet.absoluteFillObject, // 充满整个父容器
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
  },
  optionButton: {
    marginBottom: 10,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "rgb(236, 76, 96)",
    width: 90,
    height: 30,
  },
  optionText: {
    fontSize: 18,
    color: "rgb(255, 255, 255)",
  },
});

export default PublishedCard;
