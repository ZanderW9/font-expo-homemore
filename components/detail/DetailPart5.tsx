import { Text, View } from "@components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Pressable } from "react-native";

function DetailPart5(data: any) {
  const now = new Date();
  const openModalHandler = () => {
    data.openBottomSheet();
  };

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

      {data.reviews.length !== 0 &&
        data.reviews.map((review: any) => (
          <View key={review.id} style={styles.reviewWrapper}>
            <Text style={styles.senderName}>{review.sender.userName}</Text>
            <Text style={styles.reviewText}>{review.text}</Text>
            <View style={styles.reviewEndWrapper}>
              <Text style={styles.reviewEnd}>
                {now.getTime() - new Date(review.createdAt).getTime() < 60000
                  ? `Now`
                  : now.getTime() - new Date(review.createdAt).getTime() <
                    3600000
                  ? `${Math.floor(
                      (now.getTime() - new Date(review.createdAt).getTime()) /
                        60000,
                    )} minutes ago`
                  : now.getTime() - new Date(review.createdAt).getTime() <
                    86400000
                  ? `${Math.floor(
                      (now.getTime() - new Date(review.createdAt).getTime()) /
                        3600000,
                    )} hours ago`
                  : `${Math.floor(
                      (now.getTime() - new Date(review.createdAt).getTime()) /
                        86400000,
                    )} days ago`}
              </Text>
              {/* 一个回复按钮，点击回复消息 */}
              <Pressable
                onPress={() => {
                  data.openBottomSheet();
                }}
              >
                <Text style={styles.reviewEnd}>Reply</Text>
              </Pressable>
            </View>
            <View
              style={styles.separator}
              lightColor="#eee"
              darkColor="rgba(255,255,255,0.1)"
            />
          </View>
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
});

export default DetailPart5;
