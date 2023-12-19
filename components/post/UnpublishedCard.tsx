import { gql, useMutation } from "@apollo/client";
import { Text, View } from "@components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "@rneui/themed";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { StyleSheet, Pressable, TouchableOpacity } from "react-native";
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
  mutation Mutation($deleteListingId: Int!) {
    deleteListing(id: $deleteListingId) {
      id
    }
  }
`;

const UnpublishedCard: React.FunctionComponent<CardsComponentsProps> = ({
  data,
}) => {
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
    router.push({ pathname: "/createlisting", params: { listingId: data.id } });
    closeOptions();
  };

  const deleteHandler = () => {
    deleteListingFunction({
      variables: {
        deleteListingId: parseInt(data.id),
      },
      refetchQueries: [{ query: meQuery }],
    });
    closeOptions();
  };

  const viewHandler = () => {
    router.push(`/detail/${data.id}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onLongPress={onImagePress} onPress={viewHandler}>
        <Card containerStyle={styles.cardContainer}>
          <Image
            source={{ uri: imageData.smallUrl }}
            placeholder={{
              thumbhash: imageData.thumbhash || "MwgGDYJZZ3hvioiDdoeId4eAewi4",
            }}
            style={{ ...styles.image, aspectRatio: imageData.ratio || 1 }}
            contentFit="cover"
          />

          <View style={styles.cardContent}>
            {data.price ? (
              <Card.Title style={styles.price}>${data.price}</Card.Title>
            ) : (
              <></>
            )}
            {data.address?.city || data.address?.state ? (
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
            ) : (
              <></>
            )}

            {styles.title ? (
              <Card.Title style={styles.title} numberOfLines={2}>
                {data.title}
              </Card.Title>
            ) : (
              <></>
            )}

            {styles.description ? (
              <Text style={styles.description} numberOfLines={3}>
                {data.description}
              </Text>
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
    borderWidth: 1,
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
    marginLeft: 0,
    marginTop: -14,
    marginBottom: 0,
    color: "gray",
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
