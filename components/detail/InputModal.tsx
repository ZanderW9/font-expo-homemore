import { gql, useMutation } from "@apollo/client";
import { View } from "@components/Themed";
import { useDetailContext } from "@components/detail/DetailProvider";
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Button } from "@rneui/themed";
import React, { useState, useMemo, useCallback } from "react";
import { StyleSheet } from "react-native";

const createReviewMutation = gql`
  mutation Mutation(
    $listingId: Int!
    $text: String!
    $parentId: Int
    $receiverId: String
  ) {
    createReview(
      listingId: $listingId
      text: $text
      parentId: $parentId
      receiverId: $receiverId
    ) {
      id
    }
  }
`;

const listingDetailQuery = gql`
  query Query($ids: [Int]) {
    allListings(ids: $ids) {
      reviews {
        id
        text
        createdAt
        sender {
          id
          userName
        }
      }
    }
  }
`;

function ReviewInputModal(data: any) {
  const { reviewId, setReviewId, receiverId, receiverName, setReceiverName } =
    useDetailContext();
  const snapPoints = useMemo(() => [80], []);
  const [reviewText, setReviewText] = useState("");
  const [createReviewFunction] = useMutation(createReviewMutation, {
    errorPolicy: "all",
  });
  const listingId = parseInt(data.listingId);
  const renderBackdrop = useCallback(
    (propsBackdrop) => (
      <BottomSheetBackdrop
        {...propsBackdrop}
        enableTouchThrough
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        onPress={() => {
          setReceiverName("");
        }}
      />
    ),
    [],
  );

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
        <View style={styles.contentContainer}>
          <BottomSheetTextInput
            ref={data.inputRef}
            style={styles.input}
            placeholder={
              receiverName ? `Reply to @${receiverName}` : "Leave a review"
            }
            value={reviewText}
            onChangeText={setReviewText}
          />
          <Button
            title="Send"
            color="rgb(236, 76, 96)"
            buttonStyle={{
              borderRadius: 5,
              width: 80,
              justifyContent: "center",
              alignSelf: "center",
            }}
            disabled={reviewText === ""}
            containerStyle={styles.buttonContainer}
            onPress={() => {
              createReviewFunction({
                variables: {
                  listingId,
                  parentId: reviewId ? reviewId : null,
                  text: reviewText,
                  receiverId: receiverId ? receiverId : null,
                },
                refetchQueries: [
                  {
                    query: listingDetailQuery,
                    variables: { ids: [listingId] },
                  },
                ],
              });
              setReviewText("");
              setReviewId(null);
              data.bottomSheetModalRef.current?.close();
              setReceiverName("");
            }}
          />
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
  contentContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginHorizontal: 10,
  },
  input: {
    borderRadius: 10,
    fontSize: 16,
    height: 40,
    padding: 8,
    flex: 1,
    marginEnd: 10,
    backgroundColor: "rgba(151, 151, 151, 0.25)",
  },
  buttonContainer: {
    alignSelf: "flex-start",
    borderRadius: 10,
    fontSize: 16,
    height: 40,
  },
});

export default ReviewInputModal;
