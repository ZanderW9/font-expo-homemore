import { gql, useQuery } from "@apollo/client";
import { Text } from "@components/Themed";
import GuestContent from "@components/order/Guest";
import OwnerContent from "@components/order/Owner";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";

const meQuery = gql`
  query Query {
    me {
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
  const { data, refetch } = useQuery(meQuery);

  const [role, setRole] = useState("guest");

  const switchHandler = () => {
    setRole((prevRole) => (prevRole === "guest" ? "owner" : "guest"));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "My Order",
          animation: "simple_push",
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
