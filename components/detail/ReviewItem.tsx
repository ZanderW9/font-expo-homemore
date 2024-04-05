import { View, TouchableOpacity, Pressable, Text } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { Avatar, Divider } from "@rneui/themed";
import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export const formatTime = (timestamp) => {
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

const RenderReviw = (props: any) => {
  const colors = useThemedColors();
  const renderSubReview = (subReview: any) => {
    if (!subReview || !subReview?.length) {
      return;
    }

    return (
      <View style={styles.subReviewWrapper}>
        {subReview?.map((subReview: any) => (
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
                props.dispatchReviewData({
                  receiverName: subReview.sender.userName,
                  receiverId: subReview.sender.id,
                  reviewId: subReview.id,
                });
              }}
              onLongPress={() => {
                props.openEditBottomSheet();
                props.dispatchReviewData({
                  receiverName: subReview.sender.userName,
                  receiverId: subReview.sender.id,
                  reviewId: subReview.id,
                  reviewOwner: subReview.sender.id,
                  reviewText: subReview.text,
                  longPressReviewId: subReview.id,
                });
              }}
            >
              <Text
                style={[styles.senderName, { color: colors.textSub1Reverse }]}
              >
                {subReview?.sender?.userName} {">"}{" "}
                {subReview?.receiver?.userName}
              </Text>
              <Text style={styles.reviewText}>{subReview?.text}</Text>
              <View style={styles.reviewEndWrapper}>
                <Text
                  style={[styles.reviewEnd, { color: colors.textSub1Reverse }]}
                >
                  {formatTime(subReview.createdAt)}
                </Text>
                <Pressable
                  onPress={() => {
                    props.openBottomSheet();
                    props.dispatchReviewData({
                      receiverName: subReview.sender.userName,
                      receiverId: subReview.sender.id,
                      reviewId: subReview.id,
                    });
                  }}
                >
                  <Text
                    style={[
                      styles.reviewEnd,
                      { color: colors.textSub1Reverse },
                    ]}
                  >
                    Reply
                  </Text>
                </Pressable>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View key={props.review.id} style={styles.reviewWrapper}>
      {props.review?.sender?.avatar ? (
        <Avatar
          size={35}
          rounded
          containerStyle={styles.Avatar}
          source={{
            uri: props.review?.sender?.avatar,
          }}
          onPress={() => router.navigate(`/user/${props.review?.sender?.id}`)}
        />
      ) : (
        <Avatar
          title={props.review?.sender?.userName?.slice(0, 2) ?? ""}
          titleStyle={{
            justifyContent: "center",
            alignSelf: "center",
            fontSize: 20,
          }}
          size={35}
          rounded
          containerStyle={styles.Avatar}
          onPress={() => router.navigate(`/user/${props.review?.sender?.id}`)}
        />
      )}
      <View style={styles.reviewContent}>
        <TouchableOpacity
          onPress={() => {
            props.openBottomSheet();
            props.dispatchReviewData({
              receiverName: props.review.sender.userName,
              receiverId: props.review.sender.id,
              reviewId: props.review.id,
            });
          }}
          onLongPress={() => {
            props.openEditBottomSheet();
            props.dispatchReviewData({
              receiverName: props.review.sender.userName,
              receiverId: props.review.sender.id,
              reviewId: props.review.id,
              reviewOwner: props.review.sender.id,
              reviewText: props.review.text,
              longPressReviewId: props.review.id,
            });
          }}
        >
          <Text style={[styles.senderName, { color: colors.textSub1Reverse }]}>
            {props.review.sender.userName}
          </Text>
          <Text style={styles.reviewText}>{props.review.text}</Text>
          <View style={styles.reviewEndWrapper}>
            <Text style={[styles.reviewEnd, { color: colors.textSub1Reverse }]}>
              {formatTime(props.review.createdAt)}
            </Text>
            {/* 一个回复按钮，点击回复消息 */}
            <Pressable
              onPress={() => {
                props.openBottomSheet();
                props.dispatchReviewData({
                  receiverName: props.review.sender.userName,
                  receiverId: props.review.sender.id,
                  reviewId: props.review.id,
                });
              }}
            >
              <Text
                style={[styles.reviewEnd, { color: colors.textSub1Reverse }]}
              >
                Reply
              </Text>
            </Pressable>
          </View>
        </TouchableOpacity>
        {renderSubReview(props.review.subReviews)}
        <Divider width={1} color={colors.border1} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    marginVertical: 10,
    height: 1,
    width: "85%",
  },
  reviewContent: {
    height: "auto",
    width: "88%",
  },
  senderName: {
    fontSize: 14,
  },
  reviewText: {
    fontSize: 14,
    paddingVertical: 5,
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
    alignSelf: "flex-start",
    marginEnd: 10,
    marginTop: -4,
  },
  subReviewWrapper: {
    marginTop: 5,
  },
  reviewWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  Avatar: {
    marginRight: 10,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#F3EED9",
  },
});

export default RenderReviw;
