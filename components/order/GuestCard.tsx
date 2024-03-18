import { Text, View } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";

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

function GuestCard(data: any) {
  const colors = useThemedColors();
  const adultNum = data.guestType.Adults;
  const childNum = data.guestType.Children;
  const infantNum = data.guestType.Infants;
  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          borderWidth: 1,
          borderColor: colors.border1,
          padding: 10,
          borderRadius: 15,
        }}
      >
        <View
          style={{
            width: "35%",
            backgroundColor: colors.back1,
            aspectRatio: 1,
            borderRadius: 10,
          }}
        >
          <Image
            source={{ uri: data.image.smallUrl }}
            placeholder={{
              thumbhash: data.image.thumbhash || "MwgGDYJZZ3hvioiDdoeId4eAewi4",
            }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            width: "65%",
            paddingLeft: 10,
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.text}>Order ID: {data.id}</Text>
          <View style={styles.guest}>
            {adultNum > 0 && (
              <Text style={styles.text}>
                {adultNum} adult{adultNum > 1 && "s"}
              </Text>
            )}
            {childNum > 0 && (
              <Text style={styles.text}>
                , {childNum} child{childNum > 1 && "ren"}
              </Text>
            )}
            {infantNum > 0 && (
              <Text style={styles.text}>
                , {infantNum} infant{infantNum > 1 && "s"}
              </Text>
            )}
          </View>
          <Text style={styles.text}>
            From {data.dataRange[0]} To{" "}
            {data.dataRange[data.dataRange.length - 1]}
          </Text>
          <Text style={styles.text}>
            Order time: {formatTime(data.createdAt)}
          </Text>

          {data.status === "pending" && (
            <View
              style={[styles.statusButton, { backgroundColor: colors.border1 }]}
            >
              <Text style={styles.processButtonText}>Status: Pending</Text>
            </View>
          )}
          {data.status === "accepted" && (
            <View
              style={[styles.statusButton, { backgroundColor: colors.border1 }]}
            >
              <Text style={styles.processButtonText}>Status: Accepted</Text>
            </View>
          )}
          {data.status === "rejected" && (
            <View
              style={[styles.statusButton, { backgroundColor: colors.border1 }]}
            >
              <Text style={styles.processButtonText}>Status: Rejected</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: 5,
  },
  separator: {
    marginBottom: 3,
    height: 1,
    width: "100%",
  },
  text: {
    fontSize: 13,
  },
  guest: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  statusButton: {
    padding: 6,
    borderRadius: 5,
  },
  processButtonText: {
    fontSize: 13,
    alignSelf: "center",
    justifyContent: "center",
  },
});

export default GuestCard;
