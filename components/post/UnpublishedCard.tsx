import { gql, useMutation } from "@apollo/client";
import { Text, View, Pressable, TouchableOpacity } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Card } from "@rneui/themed";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { showMessage } from "react-native-flash-message";

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
    address: {
      state: string;
      city: string;
      street: string;
    };
  };
};

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

const deleteListingMutation = gql`
  mutation Mutation($deleteListingId: String!) {
    deleteListing(id: $deleteListingId) {
      id
    }
  }
`;

const UnpublishedCard: React.FunctionComponent<CardsComponentsProps> = ({
  data,
}) => {
  const colors = useThemedColors();
  const [deleteListingFunction, { error: deleteListingError }] = useMutation(
    deleteListingMutation,
    {
      errorPolicy: "all",
    },
  );
  const imageData = data.images[0] || {};

  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (deleteListingError) {
      showMessage({
        message: "This listing has orders, cannot be deleted",
        type: "danger",
      });
    }
  }, [deleteListingError]);

  const onImagePress = () => {
    setShowOptions(true);
  };

  const closeOptions = () => {
    setShowOptions(false);
  };

  const editHandler = () => {
    router.navigate({
      pathname: "/listing/step-1",
      params: { listingId: data.id },
    });
    closeOptions();
  };

  const deleteHandler = () => {
    deleteListingFunction({
      variables: {
        deleteListingId: data.id,
      },
      refetchQueries: [{ query: meQuery }],
    });
    closeOptions();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onLongPress={onImagePress}
        onPress={editHandler}
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
            placeholder={{
              thumbhash: imageData.thumbhash || "MwgGDYJZZ3hvioiDdoeId4eAewi4",
            }}
            style={{ ...styles.image, aspectRatio: imageData.ratio || 1 }}
            contentFit="cover"
          />

          <View style={styles.cardContent}>
            {data.address?.city || data.address?.state ? (
              <View style={styles.titleAndIconContainer}>
                <Ionicons name="location" size={13} style={styles.icon} />
                <Card.Title style={styles.address} numberOfLines={2}>
                  <Text>{data.address.city + ", " + data.address.state}</Text>
                </Card.Title>
              </View>
            ) : (
              <></>
            )}

            {styles.title ? (
              <Card.Title style={styles.title} numberOfLines={1}>
                <Text> {data.title}</Text>
              </Card.Title>
            ) : (
              <></>
            )}

            {styles.description ? (
              <Text style={styles.description} numberOfLines={2}>
                {data.description}
              </Text>
            ) : (
              <></>
            )}

            {data.price ? (
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
            ) : (
              <></>
            )}
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
                onPress={deleteHandler}
              >
                <Text style={styles.optionText}>Delete</Text>
              </TouchableOpacity>
            </Pressable>
          )}
        </Card>
      </TouchableOpacity>
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
export default UnpublishedCard;
