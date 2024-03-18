import { gql, useQuery } from "@apollo/client";
import { Text, View } from "@components/Themed";
import GuestContent from "@components/order/Guest";
import OwnerContent from "@components/order/Owner";
import { useThemedColors } from "@constants/theme";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const meQuery = gql`
  query Query {
    me {
      id
      myRequests {
        booking {
          id
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
        }
      }
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

function MyOrder() {
  const colors = useThemedColors();
  const { data, refetch } = useQuery(meQuery);

  const [role, setRole] = useState("guest");

  const switchHandler = () => {
    setRole((prevRole) => (prevRole === "guest" ? "owner" : "guest"));
  };

  return (
    <View style={styles.container} theme={{ background: "back2" }}>
      <Stack.Screen
        options={{
          title: "My Order",
          animation: "slide_from_right",
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerStyle: {
            backgroundColor: colors.back1,
          },
          headerTitleStyle: {
            color: colors.text,
          },
          headerRight: () => (
            <TouchableOpacity
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                marginRight: 10,
              }}
              onPress={switchHandler}
            >
              {role === "guest" ? (
                <Text style={{ fontSize: 13, marginTop: 5 }}>
                  Switch to Owner
                </Text>
              ) : (
                <Text style={{ fontSize: 13, marginTop: 5 }}>
                  Switch to Guest
                </Text>
              )}
            </TouchableOpacity>
          ),
        }}
      />
      {role === "guest" ? (
        <GuestContent myRequests={data?.me.myRequests} refetch={refetch} />
      ) : (
        <OwnerContent
          receivedBookings={data?.me.receivedBookings}
          refetch={refetch}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    paddingBottom: 0,
  },
  separator: {
    marginBottom: 3,
    height: 1,
  },
});

export default MyOrder;
