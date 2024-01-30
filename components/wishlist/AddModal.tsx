import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "@components/Themed";
import CreateModal from "@components/wishlist/CreateModal";
import { useThemedColors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { ListItem } from "@rneui/themed";
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { StyleSheet } from "react-native";

const favoriteByUserQuery = gql`
  query Query($listingId: String!) {
    myFavorites {
      id
      name
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

function AddModal(data: any) {
  const colors = useThemedColors();
  const snapPoints = useMemo(() => ["50%"], []);

  const listingId = data.listingId;
  const { data: gqlData } = useQuery(favoriteByUserQuery, {
    variables: { listingId },
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const inputRef = useRef(null);
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
  }, [gqlData?.myFavorites]);

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
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={data.bottomSheetModalRef}
      index={0}
      backgroundStyle={{ backgroundColor: colors.back1 }}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
      enablePanDownToClose
      enableContentPanningGesture={false}
    >
      {/* <View style={styles.content}> */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Add to wishlist</Text>
        <TouchableOpacity
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
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        theme={{ background: "back2" }}
      >
        {gqlData?.myFavorites?.map((favorite: any) => (
          <ListItem
            key={favorite.id}
            // bottomDivider
            onPress={() => checkHandler(favorite.id)}
            containerStyle={{
              backgroundColor: colors.back1,
              borderColor: colors.border1,
              borderBottomWidth: 0.25,
            }}
          >
            <ListItem.Content>
              <ListItem.Title>
                <Text>{favorite.name}</Text>
              </ListItem.Title>
              <ListItem.Subtitle>
                <Text>
                  {favorite?.listings?.length} items ·{" "}
                  {favorite.private ? "Private" : "Public"}
                </Text>
              </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.CheckBox
              checkedColor="rgb(236, 76, 96)"
              containerStyle={{ backgroundColor: "transparent" }}
              checked={favoriteIds.includes(favorite.id)}
              onPress={() => checkHandler(favorite.id)}
            />
          </ListItem>
        ))}
      </ScrollView>

      <SafeAreaView
        edges={["bottom"]}
        style={{
          width: "100%",
          borderTopWidth: 0.25,
        }}
        theme={{ border: "border1" }}
      >
        <TouchableOpacity
          onPress={() => {
            addOrMoveListingToFavoriteFunction({
              variables: {
                listingId,
                foldersToCreate,
                foldersToDelete,
              },
              refetchQueries: [
                {
                  query: favoriteByUserQuery,
                  variables: { listingId },
                },
              ],
            });
            data.bottomSheetModalRef.current?.close();
            setFoldersToCreate([]);
            setFoldersToDelete([]);
          }}
        >
          <Text
            style={{
              textAlign: "center",
              padding: 15,
              paddingBottom: 0,
              fontSize: 17,
            }}
          >
            Save
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
      <CreateModal
        bottomSheetModalRef={bottomSheetModalRef}
        inputRef={inputRef}
      />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 17,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 10,
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
  modalHeader: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
  },
});

export default AddModal;
