import { Text, View } from "@components/Themed";
import { useDetailContext } from "@components/detail/DetailProvider";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "@rneui/themed";
import { router } from "expo-router";
import { StyleSheet, Pressable, TouchableOpacity } from "react-native";

const formatTime = (timestamp) => {
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
};

const renderReviw = (props: any, review: any, dispatchReviewData: Function) => {
  const renderSubReview = (subReview: any) => {
    if (!subReview || !subReview.length) {
      return;
    }

    return (
      <View style={styles.subReviewWrapper}>
        {subReview.map((subReview: any) => (
          <View key={subReview.id} style={styles.reviewWrapper}>
            {subReview?.sender?.avatar ? (
              <Avatar
                size={20}
                rounded
                containerStyle={styles.Avatar}
                source={{
                  uri: subReview?.sender?.avatar,
                }}
                onPress={() =>
                  router.navigate(`/user/${subReview?.sender?.id}`)
                }
              />
            ) : (
              <Avatar
                title={subReview?.sender?.userName?.slice(0, 2) ?? ""}
                titleStyle={{
                  justifyContent: "center",
                  alignSelf: "center",
                  fontSize: 12,
                }}
                size={20}
                rounded
                containerStyle={styles.Avatar}
                onPress={() =>
                  router.navigate(`/user/${subReview?.sender?.id}`)
                }
              />
            )}
            <TouchableOpacity
              style={styles.reviewContent}
              onPress={() => {
                props.openBottomSheet();
                dispatchReviewData({
                  receiverName: subReview.sender.userName,
                  receiverId: subReview.sender.id,
                  reviewId: subReview.id,
                });
              }}
              onLongPress={() => {
                props.openEditBottomSheet();
                dispatchReviewData({
                  receiverName: subReview.sender.userName,
                  receiverId: subReview.sender.id,
                  reviewId: subReview.id,
                  reviewOwner: subReview.sender.id,
                  reviewText: subReview.text,
                  longPressReviewId: subReview.id,
                });
              }}
            >
              <Text style={styles.senderName}>
                {subReview?.sender?.userName} {">"}{" "}
                {subReview?.receiver?.userName}
              </Text>
              <Text style={styles.reviewText}>{subReview?.text}</Text>
              <View style={styles.reviewEndWrapper}>
                <Text style={styles.reviewEnd}>
                  {formatTime(subReview.createdAt)}
                </Text>
                <Pressable
                  onPress={() => {
                    props.openBottomSheet();
                    dispatchReviewData({
                      receiverName: subReview.sender.userName,
                      receiverId: subReview.sender.id,
                      reviewId: subReview.id,
                    });
                  }}
                >
                  <Text style={styles.reviewEnd}>Reply</Text>
                </Pressable>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View key={review.id} style={styles.reviewWrapper}>
      {review?.sender?.avatar ? (
        <Avatar
          size={35}
          rounded
          containerStyle={styles.Avatar}
          source={{
            uri: review?.sender?.avatar,
          }}
          onPress={() => router.navigate(`/user/${review?.sender?.id}`)}
        />
      ) : (
        <Avatar
          title={review?.sender?.userName?.slice(0, 2) ?? ""}
          titleStyle={{
            justifyContent: "center",
            alignSelf: "center",
            fontSize: 20,
          }}
          size={35}
          rounded
          containerStyle={styles.Avatar}
          onPress={() => router.navigate(`/user/${review?.sender?.id}`)}
        />
      )}
      <View style={styles.reviewContent}>
        <TouchableOpacity
          onPress={() => {
            props.openBottomSheet();
            dispatchReviewData({
              receiverName: review.sender.userName,
              receiverId: review.sender.id,
              reviewId: review.id,
            });
          }}
          onLongPress={() => {
            props.openEditBottomSheet();
            dispatchReviewData({
              receiverName: review.sender.userName,
              receiverId: review.sender.id,
              reviewId: review.id,
              reviewOwner: review.sender.id,
              reviewText: review.text,
              longPressReviewId: review.id,
            });
          }}
        >
          <Text style={styles.senderName}>{review.sender.userName}</Text>
          <Text style={styles.reviewText}>{review.text}</Text>
          <View style={styles.reviewEndWrapper}>
            <Text style={styles.reviewEnd}>{formatTime(review.createdAt)}</Text>
            {/* 一个回复按钮，点击回复消息 */}
            <Pressable
              onPress={() => {
                props.openBottomSheet();
                dispatchReviewData({
                  receiverName: review.sender.userName,
                  receiverId: review.sender.id,
                  reviewId: review.id,
                });
              }}
            >
              <Text style={styles.reviewEnd}>Reply</Text>
            </Pressable>
          </View>
        </TouchableOpacity>
        {renderSubReview(review.subReviews)}
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
      </View>
    </View>
  );
};

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
      {props.reviews.map((review: any) =>
        renderReviw(props, review, dispatchReviewData),
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
