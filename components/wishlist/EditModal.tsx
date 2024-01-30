import { gql, useMutation, useQuery } from "@apollo/client";
import { View, Text } from "@components/Themed";
import UpdateModal from "@components/wishlist/UpdateModal";
import { useThemedColors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { ListItem, Dialog } from "@rneui/themed";
import React, { useMemo, useCallback, useRef, useState } from "react";
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
  mutation Mutation($favoriteId: String!) {
    deleteFavorite(favoriteId: $favoriteId)
  }
`;

function EditModal(data: any) {
  const colors = useThemedColors();
  const [showDialog, setShowDialog] = useState(false);
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
  const deleteFavoriteHandler = (favoriteId: string) => () => {
    deleteFavoriteFunction({
      variables: { favoriteId },
      refetchQueries: [
        {
          query: favoriteByUserQuery,
        },
      ],
    });
    setShowDialog(false);
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
        backgroundStyle={{ backgroundColor: colors.back1 }}
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
                containerStyle={{
                  backgroundColor: colors.back1,
                }}
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
                      color={colors.text}
                      style={{ marginRight: 15 }}
                    />
                    <ListItem.Title>
                      <Text>Edit</Text>
                    </ListItem.Title>
                  </View>
                </ListItem.Content>
              </ListItem>

              <ListItem
                containerStyle={{
                  backgroundColor: colors.back1,
                }}
                onPress={() => {
                  data.bottomSheetModalRef.current?.close();
                  setShowDialog(true);
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
                      name="trash-outline"
                      size={24}
                      color="red"
                      style={{ marginRight: 15 }}
                    />
                    <ListItem.Title>
                      <Text>Delete the wishlist</Text>
                    </ListItem.Title>
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

          <ListItem
            containerStyle={{
              backgroundColor: colors.back1,
            }}
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
              <ListItem.Title>
                <Text>Cancel</Text>
              </ListItem.Title>
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

      <Dialog
        isVisible={showDialog}
        onBackdropPress={() => setShowDialog(false)}
        overlayStyle={{ borderRadius: 10, backgroundColor: colors.back1 }}
      >
        <Text>Are you sure you want to delete the wishlist?</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 20,
            marginTop: 10,
          }}
        >
          <Dialog.Button
            title="Delete"
            titleStyle={{ color: "red" }}
            onPress={deleteFavoriteHandler(data.favoriteId)}
          />
          <Dialog.Button
            title="Cancel"
            onPress={() => {
              setShowDialog(false);
            }}
          />
        </View>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 1,
    width: "100%",
  },
});

export default EditModal;
