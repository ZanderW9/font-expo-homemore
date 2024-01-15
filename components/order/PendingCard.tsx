import { gql, useMutation } from "@apollo/client";
import { Text, View } from "@components/Themed";
import { Dialog } from "@rneui/themed";
import { Image } from "expo-image";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { showMessage } from "react-native-flash-message";

const updateBookingStatusMutation = gql`
  mutation Mutation($bookingId: String!, $status: String!) {
    updateBookingStatus(bookingId: $bookingId, status: $status)
  }
`;

const meQuery = gql`
  query Query {
    me {
      id
      receivedBookings {
        id
        listingId
        guestType
        dataRange
        status
        createdAt
        listing {
          images {
            smallUrl
            thumbhash
            ratio
          }
        }
        guests {
          user {
            id
            userName
          }
        }
      }
    }
  }
`;

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

function PendingCard(data: any) {
  const adultNum = data.guestType.Adults;
  const childNum = data.guestType.Children;
  const infantNum = data.guestType.Infants;

  const [showDialog, setShowDialog] = useState(false);

  const [updateBookingStatusFunction] = useMutation(
    updateBookingStatusMutation,
  );
  useMutation(updateBookingStatusMutation);

  const acceptHandler = async (bookingId: string) => {
    const result = await updateBookingStatusFunction({
      variables: {
        bookingId,
        status: "accepted",
      },
      refetchQueries: [
        {
          query: meQuery,
        },
      ],
    });

    if (!result.data.updateBookingStatus) {
      showMessage({
        type: "danger",
        message: "Due to date conflict, this order cannot be accepted.",
      });
    } else {
      showMessage({
        type: "success",
        message: "Order processed successfully.",
      });
    }
  };

  const rejectHandler = async (bookingId: string) => {
    const result = await updateBookingStatusFunction({
      variables: {
        bookingId,
        status: "rejected",
      },
      refetchQueries: [
        {
          query: meQuery,
        },
      ],
    });
    if (result.data.updateBookingStatus) {
      showMessage({
        type: "success",
        message: "Order processed successfully.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.1)",
          padding: 10,
          borderRadius: 15,
        }}
      >
        <View
          style={{
            width: "35%",
            backgroundColor: "rgba(0,0,0,0.1)",
            aspectRatio: 1,
            borderRadius: 10,
          }}
        >
          <Image
            source={{ uri: data.image.smallUrl }}
            placeholder={{ thumbhash: data.image.thumbhash }}
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
          <Text style={styles.userName}>Guest Name: {data.userName}</Text>
          <View style={styles.guest}>
            {adultNum > 0 && (
              <Text style={styles.guestContent}>
                {adultNum} adult{adultNum > 1 && "s"}
              </Text>
            )}
            {childNum > 0 && (
              <Text style={styles.guestContent}>
                , {childNum} child{childNum > 1 && "ren"}
              </Text>
            )}
            {infantNum > 0 && (
              <Text style={styles.guestContent}>
                , {infantNum} infant{infantNum > 1 && "s"}
              </Text>
            )}
          </View>
          <Text style={styles.guestContent}>
            From {data.dataRange[0]} To{" "}
            {data.dataRange[data.dataRange.length - 1]}
          </Text>
          <Text style={styles.guestContent}>
            Order time: {formatTime(data.createdAt)}
          </Text>
          <TouchableOpacity onPress={() => setShowDialog(true)}>
            <View style={styles.processButton}>
              <Text style={styles.processButtonText}>Process</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Dialog
        isVisible={showDialog}
        onBackdropPress={() => setShowDialog(false)}
        overlayStyle={{ borderRadius: 10 }}
      >
        <Text>Do you want to accept this order?</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 20,
            marginTop: 10,
          }}
        >
          <Dialog.Button
            title="No"
            onPress={() => {
              rejectHandler(data.orderId);
              setShowDialog(false);
            }}
          />
          <Dialog.Button
            title="Accept"
            onPress={() => {
              acceptHandler(data.orderId);
              setShowDialog(false);
            }}
          />
        </View>
      </Dialog>
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
  },
  separator: {
    marginBottom: 3,
    height: 1,
    width: "100%",
  },
  guestContent: {
    fontSize: 13,
    color: "gray",
  },
  userName: {
    fontSize: 14,
  },
  guest: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  processButton: {
    backgroundColor: "rgb(236, 76, 96)",
    padding: 6,
    borderRadius: 5,
  },
  processButtonText: {
    color: "white",
    fontSize: 13,
    alignSelf: "center",
    justifyContent: "center",
  },
});

export default PendingCard;
