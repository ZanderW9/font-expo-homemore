import { gql, useMutation } from "@apollo/client";
import { Text, View } from "@components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { Card, Image, CheckBox } from "@rneui/themed";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, Pressable, TouchableOpacity } from "react-native";

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

const modefyPublishMutation = gql`
  mutation Mutation($modefyPublishId: Int!, $published: Boolean!) {
    modefyPublish(id: $modefyPublishId, published: $published) {
      id
    }
  }
`;

const meQuery = gql`
  query Query {
    me {
      myPublishedListings {
        id
        title
        description
        images
        price
        favorited
        address
      }
      myUnPublishedListings {
        id
        title
        description
        images
        price
        address
      }
    }
  }
`;

const PublishedCard: React.FunctionComponent<CardsComponentsProps> = ({
  data,
}) => {
  const [modefyPublishFunction] = useMutation(modefyPublishMutation);
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

  const [showOptions, setShowOptions] = useState(false);

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

  const unpublishHandler = () => {
    modefyPublishFunction({
      variables: {
        modefyPublishId: data.id,
        published: false,
      },
      refetchQueries: [{ query: meQuery }],
    });
    closeOptions();
  };

  const viewHandler = () => {
    router.push(`/detail/${data.id}`);
  };

  const toggleCheckboxHandler = () => {
    router.push({ pathname: "/addwishlist", params: { listingId: data.id } });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onLongPress={onImagePress} onPress={viewHandler}>
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
