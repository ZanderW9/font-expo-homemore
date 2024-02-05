import { Text, View, Pressable } from "@components/Themed";
import { useDetailContext } from "@components/detail/DetailProvider";
import RenderReviw from "@components/detail/ReviewItem";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

function Review(props: { openBottomSheet: Function; reviews: any[] }) {
  const openModalHandler = () => {
    props.openBottomSheet();
  };

  const { dispatchReviewData } = useDetailContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.reviews.length} Reviews</Text>
      <Pressable style={styles.inputWrapper} onPress={openModalHandler}>
        <Ionicons
          name="document-text-outline"
          size={24}
          color="rgba(0, 0, 0, 0.5)"
        />
        <Text
          style={{
            fontSize: 15,
            color: "gray",
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
    marginTop: 10,
    marginHorizontal: 10,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "85%",
  },
  title: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.5)",
    marginLeft: 8,
  },
  reviewContent: {
    width: "100%",
    height: "auto",
    borderRadius: 10,
  },
  senderName: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
  },
  reviewText: {
    fontSize: 14,
  },
  reviewEndWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 5,
    marginBottom: 5,
  },

  reviewEnd: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.5)",
    alignSelf: "flex-start",
    marginEnd: 10,
    marginTop: -4,
  },
  inputWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 40,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
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
