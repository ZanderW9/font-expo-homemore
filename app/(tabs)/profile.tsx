import { gql, useMutation } from "@apollo/client";
import { GlobalContext } from "@app/_layout";
import NotLogIn from "@components/NotLogIn";
import { View, Text, SafeAreaView } from "@components/Themed";
import { clearLocalItems, getLocalItem } from "@config/storageManager";
import useCachedQuery from "@config/useCachedQuery";
import { ListItem, Avatar } from "@rneui/themed";
import { router, usePathname } from "expo-router";
import React, { useEffect, useContext } from "react";
import { StyleSheet, ScrollView, Pressable } from "react-native";

const createListingMutation = gql`
  mutation Mutation {
    createListing {
      id
    }
  }
`;

const meQuery = gql`
  query Query {
    me {
      id
      userName
      avatar
      createdAt
    }
  }
`;

function TabProfileScreen() {
  const { setIsLoggedIn, isLoggedIn, setToken, httpLinkUrl, setApolloClient } =
    useContext(GlobalContext);
  const [createListingFunction, { data }] = useMutation(createListingMutation);

  const { data: gqlData } = useCachedQuery(meQuery, usePathname());

  useEffect(() => {
    if (data?.createListing.id) {
      router.push({
        pathname: "/createlisting",
        params: { listingId: data?.createListing.id },
      });
    }
  }, [data]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getLocalItem("userToken");
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const logOutHandler = async () => {
    await clearLocalItems();
    setIsLoggedIn(false);
    setToken(null);
    setApolloClient("", httpLinkUrl);
    router.replace("/profile");
  };

  const createListingHandler = async () => {
    createListingFunction();
  };

  const myPostHandler = async () => {
    router.push("/managepost");
  };

  const myOrderHandler = async () => {
    router.push("/manageorder");
  };

  const AccountHandler = async () => {
    router.push("/user/accountsecurity");
  };

  return (
    <View style={styles.container}>
      {!isLoggedIn && (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
          <NotLogIn
            title="Find your next home from here!"
            subtitle="Sign in to publish or order a listing"
          />
        </SafeAreaView>
      )}

      {isLoggedIn && (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View>
            <Pressable
              style={styles.userInfo}
              onPress={() => {
                router.push("/user/user-info");
              }}
            >
              {gqlData?.me?.avatar ? (
                <Avatar
                  size={64}
                  rounded
                  source={{ uri: gqlData?.me?.avatar }}
                  containerStyle={styles.avatar}
                >
                  <Avatar.Accessory size={20} />
                </Avatar>
              ) : (
                <Avatar
                  size={64}
                  rounded
                  title={gqlData?.me?.userName?.slice(0, 2) ?? ""}
                  containerStyle={styles.avatar}
                >
                  <Avatar.Accessory size={20} />
                </Avatar>
              )}

              <View style={styles.usernameWrapper}>
                <Text style={styles.username}>{gqlData?.me?.userName}</Text>
                <Text style={{ color: "gray", fontSize: 12 }}>
                  Joined on {gqlData?.me?.createdAt?.slice(0, 10)}
                </Text>
              </View>
            </Pressable>

            <View
              style={styles.separator}
              lightColor="#eee"
              darkColor="rgba(255,255,255,0.1)"
            />

            <ListItem onPress={createListingHandler}>
              <ListItem.Content>
                <ListItem.Title>Create Listing</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <View
              style={styles.separator}
              lightColor="#eee"
              darkColor="rgba(255,255,255,0.1)"
            />

            <ListItem onPress={myPostHandler}>
              <ListItem.Content>
                <ListItem.Title>Manage Listing</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <View
              style={styles.separatorThin}
              lightColor="#eee"
              darkColor="rgba(255,255,255,0.1)"
            />

            <ListItem onPress={myOrderHandler}>
              <ListItem.Content>
                <ListItem.Title>My Order</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <View
              style={styles.separator}
              lightColor="#eee"
              darkColor="rgba(255,255,255,0.1)"
            />

            <ListItem onPress={AccountHandler}>
              <ListItem.Content>
                <ListItem.Title>Account and Security</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <View
              style={styles.separator}
              lightColor="#eee"
              darkColor="rgba(255,255,255,0.1)"
            />

            <ListItem onPress={logOutHandler}>
              <ListItem.Content>
                <ListItem.Title>Log Out</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 0,
  },
  title: {
    fontSize: 18,
  },
  separator: {
    height: 10,
    width: "100%",
  },
  separatorThin: {
    height: 1,
    width: "95%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "white",
  },
  userInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "white",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 100,
    marginRight: 20,
    borderWidth: 0.5,
    borderColor: "gray",
    borderStyle: "dashed",
    backgroundColor: "#F3EED9",
  },
  usernameWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  username: {
    fontSize: 16,
  },
});

export default TabProfileScreen;
