import { Text, View } from "@components/Themed";
import { useDetailContext } from "@components/detail/DetailProvider";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Pressable } from "react-native";

function formatTime(timestamp) {
  const now = new Date();
  const createdAt = new Date(timestamp);
  const timeDiff = now.getTime() - createdAt.getTime();

  if (timeDiff < 60000) {
    return "Now";
  } else if (timeDiff < 3600000) {
    return `${Math.floor(timeDiff / 60000)} minutes ago`;
  } else if (timeDiff < 86400000) {
    return `${Math.floor(timeDiff / 3600000)} hours ago`;
  } else {
    return `${Math.floor(timeDiff / 86400000)} days ago`;
  }
}

function renderReviw(data: any, review: any, setReviewId: any) {
  const renderSubReview = (subReview: any) => {
    if (!subReview || !subReview.length) {
      return;
    }

    return (
      <View style={styles.subReviewWrapper}>
        {subReview.map((subReview: any) => (
          <View key={subReview.id} style={styles.subReviewsContainer}>
            <Text style={styles.senderName}>{subReview.sender.userName}</Text>
            <Text style={styles.reviewText}>{subReview.text}</Text>
            <View style={styles.reviewEndWrapper}>
              <Text style={styles.reviewEnd}>
                {formatTime(subReview.createdAt)}
              </Text>
              {/* 一个回复按钮，点击回复消息 */}
              <Pressable
                onPress={() => {
                  data.openBottomSheet();
                  setReviewId(review.id);
                }}
              >
                <Text style={styles.reviewEnd}>Reply</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View key={review.id} style={styles.reviewWrapper}>
      <Text style={styles.senderName}>{review.sender.userName}</Text>
      <Text style={styles.reviewText}>{review.text}</Text>
      <View style={styles.reviewEndWrapper}>
        <Text style={styles.reviewEnd}>{formatTime(review.createdAt)}</Text>
        {/* 一个回复按钮，点击回复消息 */}
        <Pressable
          onPress={() => {
            data.openBottomSheet();
            setReviewId(review.id);
          }}
        >
          <Text style={styles.reviewEnd}>Reply</Text>
        </Pressable>
      </View>
      {renderSubReview(review.subReviews)}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
    </View>
  );
}

function DetailPart5(data: any) {
  const openModalHandler = () => {
    data.openBottomSheet();
  };
  const { setReviewId } = useDetailContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.reviews.length} Reviews</Text>
      <Pressable style={styles.inputWrapper} onPress={openModalHandler}>
        <Ionicons
          name="md-document-text-outline"
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
      {data.reviews.map((review: any) =>
        renderReviw(data, review, setReviewId),
      )}
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
    width: "100%",
  },
  title: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.5)",
    marginLeft: 8,
  },
  reviewWrapper: {
    width: "100%",
    height: "auto",
    borderRadius: 10,
    // padding: 10,
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
  subReviewsContainer: {
    marginLeft: 20, // Adjust the margin to your preference
  },
  subReviewWrapper: {
    borderRadius: 10,
    marginTop: 5,
  },
});

export default DetailPart5;
