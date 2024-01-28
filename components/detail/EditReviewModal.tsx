import { gql, useMutation, useQuery } from "@apollo/client";
import { View, Text } from "@components/Themed";
import { useDetailContext } from "@components/detail/DetailProvider";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { ListItem, Dialog } from "@rneui/themed";
import * as Clipboard from "expo-clipboard";
import React, { useMemo, useCallback, useState } from "react";
import { StyleSheet } from "react-native";

const deleteReviewMutation = gql`
  mutation Mutation($deleteReviewId: String!) {
    deleteReview(id: $deleteReviewId)
  }
`;

const listingDetailQuery = gql`
  query Query($ids: [String]) {
    allListings(ids: $ids) {
      id
      reviews {
        id
        text
        createdAt
        sender {
          id
          userName
          avatar
        }
        subReviews {
          text
          id
          createdAt
          sender {
            id
            userName
            avatar
          }
          receiver {
            id
            userName
            avatar
          }
        }
      }
    }
    me {
      id
    }
  }
`;

function EditReviewModal(props: any) {
  const [showDialog, setShowDialog] = useState(false);

  const { reviewData, resetReviewData } = useDetailContext();
  const [deleteReviewFunction] = useMutation(deleteReviewMutation);

  const deleteHandler = async () => {
    await deleteReviewFunction({
      variables: {
        deleteReviewId: reviewData.longPressReviewId,
      },
      refetchQueries: [
        {
          query: listingDetailQuery,
          variables: {
            ids: [props.listingId],
          },
        },
      ],
    });
    setShowDialog(false);
    resetReviewData();
  };

  const snapPoints = useMemo(() => [200], []);

  const renderBackdrop = useCallback(
    (propsBackdrop) => (
      <BottomSheetBackdrop
        {...propsBackdrop}
        enableTouchThrough
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        onPress={resetReviewData}
      />
    ),
    [],
  );

  const copyHandler = async () => {
    await Clipboard.setStringAsync(reviewData.reviewText || "");
    props.bottomSheetModalRef.current?.close();
  };

  const { data } = useQuery(listingDetailQuery, {
    variables: {
      ids: [props.listingId],
    },
  });

  return (
    <View style={styles.container}>
      <BottomSheetModal
        ref={props.bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        android_keyboardInputMode="adjustResize"
        enablePanDownToClose
      >
        <View>
          {data?.me?.id === reviewData.reviewOwner ? (
            <View>
              <ListItem onPress={copyHandler}>
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
                      name="copy-outline"
                      size={24}
                      color="black"
                      style={{ marginRight: 15 }}
                    />
                    <ListItem.Title>Copy</ListItem.Title>
                  </View>
                </ListItem.Content>
              </ListItem>

              <ListItem
                onPress={() => {
                  props.bottomSheetModalRef.current?.close();
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
                    <ListItem.Title>Delete</ListItem.Title>
                  </View>
                </ListItem.Content>
              </ListItem>
            </View>
          ) : (
            <View>
              <ListItem onPress={copyHandler}>
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
                      name="copy-outline"
                      size={24}
                      color="black"
                      style={{ marginRight: 15 }}
                    />
                    <ListItem.Title>Copy</ListItem.Title>
                  </View>
                </ListItem.Content>
              </ListItem>

              <ListItem>
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
                      name="warning-outline"
                      size={24}
                      color="red"
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
              props.bottomSheetModalRef.current?.close();
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

      <Dialog
        isVisible={showDialog}
        onBackdropPress={() => setShowDialog(false)}
        overlayStyle={{ borderRadius: 10 }}
      >
        <Text>Are you sure you want to delete this review?</Text>
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
            onPress={deleteHandler}
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

export default EditReviewModal;
