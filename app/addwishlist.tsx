import { gql, useMutation } from "@apollo/client";
import { Text, View } from "@components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { Button, ListItem } from "@rneui/themed";
import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, Pressable, ScrollView } from "react-native";

import useCachedQuery from "../config/useCachedQuery";

const favoriteByUserQuery = gql`
  query Query($listingId: Int!) {
    myFavorites {
      name
      id
      private
      listings {
        listingId
      }
      isFavorite(listingId: $listingId)
    }
  }
`;

const addOrMoveListingToFavoriteMutation = gql`
  mutation Mutation(
    $listingId: Int!
    $foldersToCreate: [String!]
    $foldersToDelete: [String!]
  ) {
    addOrMoveListingToFavorite(
      listingId: $listingId
      foldersToCreate: $foldersToCreate
      foldersToDelete: $foldersToDelete
    )
  }
`;

function AddwishlistScreen() {
  const listingId = parseInt(useLocalSearchParams().listingId);
  const { data } = useCachedQuery(
    favoriteByUserQuery,
    `/wishlist/${listingId}`,
    {
      listingId,
    },
  );
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const [foldersToCreate, setFoldersToCreate] = useState<string[]>([]);
  const [foldersToDelete, setFoldersToDelete] = useState<string[]>([]);

  const [favorite, setFavorite] = useState<boolean>(false);

  useEffect(() => {
    if (data?.myFavorites) {
      setFavoriteIds(
        data.myFavorites
          .filter((favorite: any) => favorite.isFavorite)
          .map((favorite: any) => favorite.id),
      );
    }
  }, [data]);

  useEffect(() => {
    if (foldersToCreate.length + favoriteIds.length >= foldersToDelete.length) {
      setFavorite(true);
    } else if (
      foldersToCreate.length + favoriteIds.length <
      foldersToDelete.length
    ) {
      setFavorite(false);
    }
  }, [foldersToCreate, foldersToDelete, favoriteIds]);

  const [addOrMoveListingToFavoriteFunction] = useMutation(
    addOrMoveListingToFavoriteMutation,
    {
      update(cache) {
        cache.modify({
          id: cache.identify({ __typename: "Listing", id: listingId }),
          fields: {
            favorited() {
              return favorite;
            },
          },
        });
      },
      errorPolicy: "all",
    },
  );

  const checkHandler = (id: string) => {
    if (favoriteIds.includes(id) && !foldersToDelete.includes(id)) {
      setFoldersToDelete([...foldersToDelete, id]);
      setFavoriteIds(favoriteIds.filter((item) => item !== id));
    } else if (!favoriteIds.includes(id) && !foldersToCreate.includes(id)) {
      setFoldersToCreate([...foldersToCreate, id]);
      setFavoriteIds([...favoriteIds, id]);
    } else if (favoriteIds.includes(id) && foldersToDelete.includes(id)) {
      setFoldersToDelete(foldersToDelete.filter((item) => item !== id));
      setFavoriteIds([...favoriteIds, id]);
    } else if (!favoriteIds.includes(id) && foldersToCreate.includes(id)) {
      setFoldersToCreate(foldersToCreate.filter((item) => item !== id));
      setFavoriteIds([...favoriteIds, id]);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={{ flex: 1, width: "100%" }}
        onPress={() => router.back()}
      >
        <Text />
      </Pressable>
      <View style={styles.modalHeader}>
        <Ionicons
          name="close"
          size={24}
          color="gray"
          style={styles.closeButton}
          onPress={() => router.back()}
        />
        <Text style={styles.modalTitle}>Add to wishlist</Text>
        <Pressable
          style={styles.modalSubTitle}
          onPress={() => router.push("/createwishlist")}
        >
          <Ionicons name="add-outline" size={20} color="gray" />
          <Text style={{ color: "gray" }}>New Wishlist</Text>
        </Pressable>
      </View>
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView style={{ flex: 1, width: "100%" }}>
          {data?.myFavorites?.map((favorite: any) => (
            <ListItem
              key={favorite.id}
              bottomDivider
              onPress={() => checkHandler(favorite.id)}
            >
              <ListItem.Content>
                <ListItem.Title>{favorite.name}</ListItem.Title>
                <ListItem.Subtitle>
                  {favorite?.listings?.length} items .{" "}
                  {favorite.private ? "Private" : "Public"}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.CheckBox
                checked={favoriteIds.includes(favorite.id)}
                onPress={() => checkHandler(favorite.id)}
              />
            </ListItem>
          ))}
        </ScrollView>
        <Button
          title="Submit"
          size="lg"
          radius="sm"
          type="solid"
          containerStyle={{
            width: 200,
            alignSelf: "center",
          }}
          onPress={() => {
            addOrMoveListingToFavoriteFunction({
              variables: {
                listingId,
                foldersToCreate,
                foldersToDelete,
              },
            });
            router.back();
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  safeContainer: {
    backgroundColor: "white",
    width: "100%",
    height: "50%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 40,
    textAlign: "left",
  },
  modalSubTitle: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 10,
    marginTop: 10,
    marginRight: 20,
    flexDirection: "row",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    left: 10,
    zIndex: 1,
  },

  modalHeader: {
    height: 50,
    borderBottomColor: "rgba(230, 230, 230, 1)",
    borderBottomWidth: 0.5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default AddwishlistScreen;
