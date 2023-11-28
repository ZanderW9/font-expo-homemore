import { gql, useMutation } from "@apollo/client";
import { View } from "@components/Themed";
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Button } from "@rneui/themed";
import React, { useState, useMemo, useCallback } from "react";
import { StyleSheet } from "react-native";

const createReviewMutation = gql`
  mutation Mutation($listingId: Int!, $text: String!) {
    createReviewOnListing(listingId: $listingId, text: $text) {
      id
    }
  }
`;

const listingDetailQuery = gql`
  query Query($listingDetailId: Int) {
    listingDetail(id: $listingDetailId) {
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

const ReviewInputModal = React.forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ["40%"], []);
  const [reviewText, setReviewText] = useState("");
  const [createReviewFunction] = useMutation(createReviewMutation, {
    errorPolicy: "all",
  });
  const listingId = parseInt(props.listingId);

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
    <View style={styles.container}>
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        android_keyboardInputMode="adjustResize"
        enablePanDownToClose
      >
        <View style={styles.contentContainer}>
          <BottomSheetTextInput
            style={styles.input}
            placeholder="Write your review here"
            multiline
            value={reviewText}
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
            disabled={reviewText === ""}
            containerStyle={styles.buttonContainer}
            onPress={() => {
              createReviewFunction({
                variables: {
                  listingId,
                  text: reviewText,
                },
                refetchQueries: [
                  {
                    query: listingDetailQuery,
                    variables: { listingDetailId: listingId },
                  },
                ],
              });
              setReviewText("");
              ref.current?.close();
            }}
          />
        </View>
      </BottomSheetModal>
    </View>
  );
});

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
    marginHorizontal: 24,
  },
  input: {
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    width: "75%",
    backgroundColor: "rgba(151, 151, 151, 0.25)",
  },
  buttonContainer: {
    alignSelf: "flex-start",
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
  },
});

export default ReviewInputModal;
