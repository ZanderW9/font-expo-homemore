import { gql, useMutation } from "@apollo/client";
import { View } from "@components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { ListItem } from "@rneui/themed";
import React, { useMemo, useCallback } from "react";
import { StyleSheet } from "react-native";

const favoriteByUserQuery = gql`
  query MyFavorites {
    myFavorites {
      id
      name
      private
    }
  }
`;

const deleteFavoriteMutation = gql`
  mutation Mutation($userId: String!, $favoriteId: String!) {
    deleteFavorite(userId: $userId, favoriteId: $favoriteId)
  }
`;

function EditModal(data: any) {
  const snapPoints = useMemo(() => [150], []);

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  separator: {
    height: 5,
    width: "100%",
  },
});

export default EditModal;
