import { gql, useMutation, useQuery } from "@apollo/client";
import { View } from "@components/Themed";
import UpdateModal from "@components/wishlist/UpdateModal";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { ListItem } from "@rneui/themed";
import React, { useMemo, useCallback, useRef } from "react";
import { StyleSheet } from "react-native";

const favoriteByUserQuery = gql`
  query MyFavorites {
    myFavorites {
      id
      name
      private
      owner {
        id
      }
    }
  }
`;

const meQuery = gql`
  query Me {
    me {
      id
    }
  }
`;

const copyFavoriteMutation = gql`
  mutation Mutation($favoriteId: String!) {
    copyWishlist(favoriteId: $favoriteId)
  }
`;

const deleteFavoriteMutation = gql`
  mutation Mutation($userId: String!, $favoriteId: String!) {
    deleteFavorite(userId: $userId, favoriteId: $favoriteId)
  }
`;

function EditModal(data: any) {
  const snapPoints = useMemo(() => [200], []);

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

  const { data: meData } = useQuery(meQuery);
  const [deleteFavoriteFunction] = useMutation(deleteFavoriteMutation, {
    errorPolicy: "all",
  });
  const deleteFavoriteHandler = (userId: string, favoriteId: string) => () => {
    deleteFavoriteFunction({
      variables: { userId, favoriteId },
      refetchQueries: [
        {
          query: favoriteByUserQuery,
        },
      ],
    });
    data.bottomSheetModalRef.current?.close();
  };

  const [copyFavoriteFunction] = useMutation(copyFavoriteMutation, {
    errorPolicy: "all",
  });

  const bottomSheetUpdateModalRef = useRef<BottomSheetModal>(null);
  const inputRef = useRef(null);

  return (
    <View style={styles.container}>
      <BottomSheetModal
        ref={data.bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        android_keyboardInputMode="adjustResize"
        enablePanDownToClose
      >
        <View>
          {meData?.me?.id === data.userId ? (
            <View>
              <ListItem
                onPress={() => {
                  data.bottomSheetModalRef.current?.close();
                  bottomSheetUpdateModalRef.current?.present();
                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 100);
                }}
              >
                <ListItem.Content>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Ionicons
                      name="create-outline"
                      size={24}
                      color="black"
                      style={{ marginRight: 15 }}
                    />
                    <ListItem.Title>Edit</ListItem.Title>
                  </View>
                </ListItem.Content>
              </ListItem>

              <ListItem
                onPress={deleteFavoriteHandler(data.userId, data.favoriteId)}
              >
                <ListItem.Content>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={24}
                      color="red"
                      style={{ marginRight: 15 }}
                    />
                    <ListItem.Title>Delete the wishlist</ListItem.Title>
                  </View>
                </ListItem.Content>
              </ListItem>
            </View>
          ) : (
            <View>
              <ListItem
                onPress={() => {
                  copyFavoriteFunction({
                    variables: { favoriteId: data.favoriteId },
                    refetchQueries: [
                      {
                        query: favoriteByUserQuery,
                      },
                    ],
                  });
                  data.bottomSheetModalRef.current?.close();
                }}
              >
                <ListItem.Content>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Ionicons
                      name="heart-outline"
                      size={24}
                      color="black"
                      style={{ marginRight: 15 }}
                    />
                    <ListItem.Title>Add to my wishlist</ListItem.Title>
                  </View>
                </ListItem.Content>
              </ListItem>

              <ListItem
                onPress={() => {
                  data.bottomSheetModalRef.current?.close();
                }}
              >
                <ListItem.Content>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Ionicons
                      name="alert-circle-outline"
                      size={24}
                      color="black"
                      style={{ marginRight: 15 }}
                    />
                    <ListItem.Title>Report</ListItem.Title>
                  </View>
                </ListItem.Content>
              </ListItem>
            </View>
          )}

          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />

          <ListItem
            onPress={() => {
              data.bottomSheetModalRef.current?.close();
            }}
          >
            <ListItem.Content
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ListItem.Title>Cancel</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </View>
      </BottomSheetModal>

      {meData?.me?.id === data.userId && (
        <UpdateModal
          bottomSheetModalRef={bottomSheetUpdateModalRef}
          inputRef={inputRef}
          favoriteId={data.favoriteId}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 5,
    width: "100%",
  },
});

export default EditModal;
