import { gql, useMutation } from "@apollo/client";
import { Text, View } from "@components/Themed";
import CreateModal from "@components/wishlist/CreateModal";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Button, ListItem } from "@rneui/themed";
import { useLocalSearchParams, router } from "expo-router";
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { StyleSheet, Pressable, ScrollView, Platform } from "react-native";

import useCachedQuery from "../config/useCachedQuery";

const favoriteByUserQuery = gql`
  query Query($listingId: String!) {
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
    $listingId: String!
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
  const snapPoints = useMemo(() => ["60%"], []);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const inputRef = useRef(null);
  const bottomSheetAddRef = useRef<BottomSheetModal>(null);
  bottomSheetAddRef.current?.present();

  const listingId = useLocalSearchParams().listingId;

  const { data: gqlData } = useCachedQuery(
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
    if (gqlData?.myFavorites) {
      setFavoriteIds(
        gqlData.myFavorites
          .filter((favorite: any) => favorite.isFavorite)
          .map((favorite: any) => favorite.id),
      );
    }
  }, [gqlData]);

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

  const renderBackdrop = useCallback(
    (propsBackdrop) => (
      <BottomSheetBackdrop
        {...propsBackdrop}
        enableTouchThrough
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        onPress={() => router.back()}
      />
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <BottomSheetModal
        ref={bottomSheetAddRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        android_keyboardInputMode="adjustResize"
        enablePanDownToClose
        enableContentPanningGesture={false}
      >
        <View style={styles.content}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add to wishlist</Text>
            <Pressable
              style={styles.modalSubTitle}
              onPress={() => {
                bottomSheetModalRef.current?.present();
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 100);
              }}
            >
              <Ionicons name="add-outline" size={20} color="gray" />
              <Text style={{ color: "gray" }}>New Wishlist</Text>
            </Pressable>
          </View>
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            {gqlData?.myFavorites?.map((favorite: any) => (
              <ListItem
                key={favorite.id}
                bottomDivider
                onPress={() => checkHandler(favorite.id)}
              >
                <ListItem.Content>
                  <ListItem.Title>{favorite.name}</ListItem.Title>
                  <ListItem.Subtitle>
                    {favorite?.listings?.length} items ·{" "}
                    {favorite.private ? "Private" : "Public"}
                  </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.CheckBox
                  checkedColor="rgb(236, 76, 96)"
                  checked={favoriteIds.includes(favorite.id)}
                  onPress={() => checkHandler(favorite.id)}
                />
              </ListItem>
            ))}
          </ScrollView>

          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />

          <Button
            title="Save"
            size="md"
            radius="sm"
            type="outline"
            buttonStyle={{
              margin: 10,
              borderWidth: 1,
              borderColor: "rgb(236, 76, 96)",
            }}
            titleStyle={{ color: "rgb(236, 76, 96)" }}
            onPress={() => {
              addOrMoveListingToFavoriteFunction({
                variables: {
                  listingId,
                  foldersToCreate,
                  foldersToDelete,
                },
              });
              bottomSheetAddRef.current?.close();
              router.back();
            }}
          />
          <CreateModal
            bottomSheetModalRef={bottomSheetModalRef}
            inputRef={inputRef}
          />
        </View>
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "transparentModal",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    marginBottom: Platform.OS === "ios" ? 0 : -35,
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
    marginLeft: 20,
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
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  separator: {
    height: 5,
    width: "100%",
  },
});

export default AddwishlistScreen;
