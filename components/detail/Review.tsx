import { GlobalContext } from "@app/_layout";
import { Text, View, Pressable } from "@components/Themed";
import { useDetailContext } from "@components/detail/DetailProvider";
import RenderReviw from "@components/detail/ReviewItem";
import { useThemedColors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext } from "react";
import { StyleSheet } from "react-native";

function Review(props: { openBottomSheet: Function; reviews: any[] }) {
  const colors = useThemedColors();
  const { isLoggedIn } = useContext(GlobalContext);
  const openModalHandler = () => {
    if (!isLoggedIn) {
      router.navigate("/signin");
    } else {
      props.openBottomSheet();
    }
  };

  const { dispatchReviewData } = useDetailContext();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        {props.reviews.length} Reviews
      </Text>
      <Pressable
        style={[styles.inputWrapper, { backgroundColor: colors.back2 }]}
        onPress={openModalHandler}
      >
        <Ionicons name="document-text-outline" size={24} color={colors.text} />
        <Text
          style={{
            fontSize: 15,
            color: colors.textSub1Reverse,
            marginLeft: 5,
          }}
        >
          Leave a review ···
        </Text>
      </Pressable>
      {props.reviews.map((review: any) => (
        <RenderReviw
          key={review.id}
          review={review}
          dispatchReviewData={dispatchReviewData}
          openBottomSheet={props.openBottomSheet}
          openEditBottomSheet={props.openEditBottomSheet}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginVertical: 10,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 16,
    marginLeft: 8,
  },
  reviewContent: {
    width: "100%",
    height: "auto",
    borderRadius: 10,
  },
  reviewText: {
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  subReviewWrapper: {
    borderRadius: 10,
    marginTop: 5,
  },
  reviewWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  Avatar: {
    marginRight: 10,
    marginTop: 5,
    justifyContent: "flex-start",
    alignContent: "flex-start",
    backgroundColor: "#F3EED9",
  },
});

export default Review;
