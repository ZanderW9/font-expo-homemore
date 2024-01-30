import { gql, useMutation } from "@apollo/client";
import { View } from "@components/Themed";
import { useDetailContext } from "@components/detail/DetailProvider";
import { LISTING_REVIEW_QUERY } from "@config/gql/listing";
import { useThemedColors } from "@constants/theme";
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
    $listingId: String!
    $text: String!
    $parentId: String
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

function ReviewInputModal(props: any) {
  const colors = useThemedColors();
  const { reviewData, dispatchReviewData } = useDetailContext();
  const snapPoints = useMemo(() => [80], []);
  const [reviewText, setReviewText] = useState("");
  const [createReviewFunction] = useMutation(createReviewMutation, {
    errorPolicy: "all",
  });
  const listingId = props.listingId;
  const renderBackdrop = useCallback(
    (propsBackdrop) => (
      <BottomSheetBackdrop
        {...propsBackdrop}
        enableTouchThrough
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        onPress={() => {
          dispatchReviewData({
            receiverName: "",
          });
        }}
      />
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <BottomSheetModal
        ref={props.bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: colors.back1 }}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        android_keyboardInputMode="adjustResize"
        enablePanDownToClose
      >
        <View style={styles.contentContainer}>
          <BottomSheetTextInput
            ref={props.inputRef}
            style={[styles.input, { color: colors.text }]}
            placeholder={
              reviewData.receiverName
                ? `Reply to @${reviewData.receiverName}`
                : "Leave a review"
            }
            onChangeText={(text) => setReviewText(text)}
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
            disabledStyle={{ backgroundColor: colors.back2 }}
            disabled={reviewText === ""}
            containerStyle={styles.buttonContainer}
            onPress={() => {
              createReviewFunction({
                variables: {
                  listingId,
                  parentId: reviewData.reviewId || null,
                  text: reviewText,
                  receiverId: reviewData.receiverId || null,
                },
                refetchQueries: [
                  {
                    query: LISTING_REVIEW_QUERY,
                    variables: { listingId },
                  },
                ],
              });
              setReviewText("");
              dispatchReviewData({
                receiverName: "",
                reviewId: null,
              });
              props.bottomSheetModalRef.current?.close();
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
  },
});

export default ReviewInputModal;
